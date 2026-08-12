export default function About() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About This Project</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Who made this</h3>
        <p className="text-slate-700 dark:text-slate-300">
          Created by Erdi Erden Kekec — Student Number 22555388, for CSE5006.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">What this is</h3>
        <p className="mb-3 text-slate-700 dark:text-slate-300">
          This is an RSS Server and RSS Client built to feed content into a
          Learning Management System (LMS). Feed items are created, stored and
          published from one place, then presented to learners in a clear,
          easy-to-scan interface.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Assessment 1 built the frontend. <strong>Assessment 2 adds the backend:</strong>{' '}
          a PostgreSQL database, a REST API, an RSS 2.0 feed endpoint, and Docker
          deployment. The sample posts have been replaced by real records served
          from the database.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">How it works</h3>
        <p className="mb-3 text-slate-700 dark:text-slate-300">
          The system runs as three containers. The RSS Client is this interface.
          The RSS Server exposes the API and generates RSS XML. PostgreSQL stores
          feeds, items, authors and request metrics.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Content is organised as feeds and items: a feed is a channel, and an
          item is a single post within it — the same structure an RSS document
          uses. Items can carry their content directly, or link out to an
          original source.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Where it&apos;s heading</h3>
        <p className="text-slate-700 dark:text-slate-300">
          Assessment 3 will add dashboard views and reporting on top of the
          metrics the server already collects, along with end-to-end and load
          testing.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Walkthrough</h3>
        <p className="mb-4 text-slate-700 dark:text-slate-300">
          The video below walks through the system: the database schema, the API
          endpoints, the RSS Server sending feeds to the RSS Client, and the
          application running in Docker.
        </p>

        <video controls preload="metadata" className="w-full rounded-lg">
          <source src="/22555388_Assignment2_Walkthrough.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
    </div>
  );
}