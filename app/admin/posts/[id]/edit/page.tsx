import { notFound } from "next/navigation";
import { updatePost } from "@/app/admin/posts/actions";
import { PostForm } from "@/app/admin/posts/post-form";
import { getPostById } from "@/lib/posts";

type EditPostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId <= 0) {
    notFound();
  }

  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-12 lg:px-10">
      <PostForm
        action={updatePost}
        submitLabel="Salvar alteracoes"
        heading="Editar post"
        description="Atualize titulo, slug, capa, conteudo e status de publicacao do artigo."
        values={post}
      />
    </div>
  );
}
