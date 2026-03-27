import { createPost } from "@/app/admin/posts/actions";
import { PostForm } from "@/app/admin/posts/post-form";

export default function NewPostPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 px-6 py-12 lg:px-10">
      <PostForm
        action={createPost}
        submitLabel="Criar post"
        heading="Novo post"
        description="Escreva, revise e publique diretamente no banco usando Prisma. O slug pode ser informado manualmente ou derivado do titulo."
      />
    </div>
  );
}
