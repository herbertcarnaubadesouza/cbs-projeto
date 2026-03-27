import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(date);
}

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-10 lg:px-10">
      <section className="grid gap-8 rounded-[2rem] border border-black/10 bg-[radial-gradient(circle_at_top_left,#ffe8b6_0%,#fff7e7_28%,#eff6ff_65%,#ffffff_100%)] p-8 shadow-[0_40px_100px_rgba(15,23,42,0.08)] lg:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-6">
          <div className="grid gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">
              CBS Blog
            </span>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Historias, bastidores e atualizacoes publicadas direto do seu painel.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              A pagina principal consome posts publicados no MySQL com Prisma,
              enquanto o painel admin controla criacao, edicao e exclusao.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin"
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Abrir admin
            </Link>
            <a
              href="/api/health/db"
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              Testar conexao DB
            </a>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] border border-white/80 bg-white/70 p-6 backdrop-blur">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Stack ativa
          </span>
          <div className="grid gap-3 text-sm leading-7 text-slate-700">
            <p>Next 16 com App Router</p>
            <p>Prisma 6 conectado ao MySQL</p>
            <p>CRUD editorial com Server Actions</p>
            <p>Rotas publicas para home e post interno</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Publicados
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Ultimos artigos do blog
            </h2>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-lg font-semibold text-slate-900">Nenhum post publicado ainda.</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Use o painel admin para criar seu primeiro artigo e marcar como publicado.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="grid gap-4 rounded-[2rem] border border-black/10 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    /{post.slug}
                  </span>
                </div>

                <div className="grid gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">
                    {post.excerpt || `${post.content.slice(0, 180)}...`}
                  </p>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex w-fit items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                >
                  Ler artigo
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
