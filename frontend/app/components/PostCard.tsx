import Link from "next/link";


type Post = {
  slug: string;
  title: string;
  date: string;
  image: string;
  summary: string;
  category: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-5">
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {post.category}
        </span>
        <h3 className="text-lg font-bold mt-1 mb-1">{post.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{post.date}</p>
        <p className="mb-3">{post.summary}</p>
        <Link
          href={`/feeds/${post.slug}`}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}