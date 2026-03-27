"use client";

import { useEffect, useState } from "react";

type PostFormValues = {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  coverImage?: string | null;
  content?: string;
  published?: boolean;
};

type PostFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  heading: string;
  description: string;
  values?: PostFormValues;
};

export function PostForm({
  action,
  submitLabel,
  heading,
  description,
  values,
}: PostFormProps) {
  const initialCoverImage = values?.coverImage ?? null;
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialCoverImage);
  const [hasNewFile, setHasNewFile] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setHasNewFile(Boolean(file));

    setPreviewUrl((currentUrl) => {
      if (currentUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(currentUrl);
      }

      if (!file) {
        return initialCoverImage;
      }

      return URL.createObjectURL(file);
    });
  }

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="grid gap-6 rounded-[2rem] border border-black/10 bg-white/90 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)]"
    >
      {values?.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <input type="hidden" name="currentCoverImage" value={values?.coverImage ?? ""} />

      <div className="grid gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
          Painel editorial
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{heading}</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Titulo
          <input
            name="title"
            required
            minLength={3}
            defaultValue={values?.title ?? ""}
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-amber-500 focus:bg-white"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Slug
          <input
            name="slug"
            minLength={3}
            defaultValue={values?.slug ?? ""}
            placeholder="gerado-a-partir-do-titulo"
            className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-amber-500 focus:bg-white"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-slate-800">
        Resumo
        <textarea
          name="excerpt"
          rows={3}
          defaultValue={values?.excerpt ?? ""}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-amber-500 focus:bg-white"
        />
      </label>

      <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
        <div className="grid gap-2">
          <span className="text-sm font-medium text-slate-800">Imagem de capa</span>
          <input
            name="coverImageFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <p className="text-xs leading-6 text-slate-500">
            O arquivo sera enviado para o Firebase Storage e apenas a URL publica sera salva no banco.
          </p>
        </div>

        {previewUrl ? (
          <div className="grid gap-3">
            <div
              className="min-h-48 rounded-[1.5rem] border border-black/10 bg-cover bg-center"
              style={{ backgroundImage: `url(${previewUrl})` }}
            />
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
              {hasNewFile ? "Preview da nova imagem" : "Imagem atual"}
            </p>
          </div>
        ) : null}

        {values?.coverImage ? (
          <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              name="removeCoverImage"
              type="checkbox"
              className="h-5 w-5 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            Remover imagem atual se nenhum novo arquivo for enviado
          </label>
        ) : null}
      </div>

      <label className="grid gap-2 text-sm font-medium text-slate-800">
        Conteudo
        <textarea
          name="content"
          required
          minLength={20}
          rows={16}
          defaultValue={values?.content ?? ""}
          className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm leading-7 outline-none transition focus:border-amber-500 focus:bg-white"
        />
      </label>

      <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-800">
        <input
          name="published"
          type="checkbox"
          defaultChecked={values?.published ?? false}
          className="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
        />
        Publicar no blog
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          {submitLabel}
        </button>
        <a
          href="/admin"
          className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
        >
          Voltar ao painel
        </a>
      </div>
    </form>
  );
}
