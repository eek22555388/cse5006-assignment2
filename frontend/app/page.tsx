import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-3">RSS Server &amp; Client</h2>
      <p className="text-lg mb-6 text-slate-600 dark:text-slate-300">
        A backend-driven RSS system built for CSE5006 Assessment 2. Feed content
        is stored in a PostgreSQL database, served through a REST API, and
        displayed here by the RSS Client.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/feeds"
          className="rounded-lg border border-slate-200 dark:border-slate-600 p-5 hover:border-blue-500"
        >
          <h3 className="font-semibold mb-1">RSS Client →</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Live feed items fetched from the RSS Server.
          </p>
        </Link>

        <Link
          href="/about"
          className="rounded-lg border border-slate-200 dark:border-slate-600 p-5 hover:border-blue-500"
        >
          <h3 className="font-semibold mb-1">About →</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            What this project is and how it was built.
          </p>
        </Link>
      </div>
    </div>
  );
}