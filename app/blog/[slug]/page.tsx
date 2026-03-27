import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPostBySlug } from "@/lib/posts";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(date);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-14 lg:px-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-amber-700 transition hover:text-slate-950"
      >
        Voltar para o blog
      </Link>

      <article className="grid gap-8">
        <header className="grid gap-5">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            <span>Artigo publicado</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{post.excerpt}</p>
          ) : null}
          {post.coverImage ? (
            <div
              className="min-h-80 rounded-[2rem] border border-black/10 bg-cover bg-center shadow-[0_30px_90px_rgba(15,23,42,0.12)]"
              style={{ backgroundImage: `url(${post.coverImage})` }}
            />
          ) : null}
        </header>

        <div className="rounded-[2rem] border border-black/10 bg-white/90 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-base leading-8 text-slate-700">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}
