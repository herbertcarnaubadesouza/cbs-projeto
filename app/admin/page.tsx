import Link from "next/link";
import { deletePost } from "@/app/admin/posts/actions";
import { getAdminPosts } from "@/lib/posts";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminPage() {
  const posts = await getAdminPosts();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12 lg:px-10">
      <section className="grid gap-6 rounded-[2rem] border border-black/10 bg-[linear-gradient(135deg,#fff8eb_0%,#fff_50%,#eef6ff_100%)] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
              Admin do blog
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Gerencie os posts do site
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-600">
              Esta area cria, edita e remove posts direto no MySQL via Prisma.
              Neste momento ela nao possui autenticacao, entao nao deve ser exposta
              publicamente sem protecao adicional.
            </p>
          </div>

          <Link
            href="/admin/posts/new"
            className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Novo post
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-lg font-semibold text-slate-900">Nenhum post cadastrado.</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Comece criando o primeiro artigo do blog.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="grid gap-5 rounded-[2rem] border border-black/10 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:grid-cols-[1fr_auto]"
            >
              <div className="grid gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                      post.published
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {post.published ? "Publicado" : "Rascunho"}
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Atualizado em {formatDate(post.updatedAt)}
                  </span>
                </div>

                <div className="grid gap-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500">/{post.slug}</p>
                </div>

                {post.excerpt ? (
                  <p className="max-w-3xl text-sm leading-7 text-slate-600">{post.excerpt}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Editar
                </Link>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Ver post
                </Link>

                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
