import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function getFirebaseConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey || !storageBucket) {
    throw new Error("Firebase Storage nao configurado. Defina FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY e FIREBASE_STORAGE_BUCKET.");
  }

  if (
    privateKey.includes("SUA_CHAVE_AQUI") ||
    !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
    !privateKey.includes("-----END PRIVATE KEY-----")
  ) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY invalida. Use a chave privada real da service account do Firebase no formato PEM."
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
    storageBucket,
  };
}

function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const config = getFirebaseConfig();

  return initializeApp({
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey,
    }),
    storageBucket: config.storageBucket,
  });
}

function getFileExtension(file: File) {
  const fileName = file.name.toLowerCase();

  if (fileName.includes(".")) {
    return fileName.split(".").pop() || "jpg";
  }

  const mime = file.type.toLowerCase();

  if (mime === "image/png") {
    return "png";
  }

  if (mime === "image/webp") {
    return "webp";
  }

  if (mime === "image/gif") {
    return "gif";
  }

  return "jpg";
}

export async function uploadImageToFirebase(file: File, slug: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Envie apenas arquivos de imagem.");
  }

  const maxFileSize = 5 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("A imagem deve ter no maximo 5MB.");
  }

  const app = getFirebaseApp();
  const bucket = getStorage(app).bucket();
  const extension = getFileExtension(file);
  const sanitizedSlug = slug.replace(/[^a-z0-9-]/g, "-");
  const filePath = `blog-covers/${sanitizedSlug}-${randomUUID()}.${extension}`;
  const bucketFile = bucket.file(filePath);
  const buffer = Buffer.from(await file.arrayBuffer());

  await bucketFile.save(buffer, {
    resumable: false,
    metadata: {
      contentType: file.type || "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  await bucketFile.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}
