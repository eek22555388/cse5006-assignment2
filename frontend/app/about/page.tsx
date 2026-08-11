export default function About() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">About This Project</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Who made this</h3>
        <p className="text-slate-700 dark:text-slate-300">
          Created by Erdi Erden Kekec — Student Number 22555388, for CSE5006
          Assessment 1.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">What this is</h3>
        <p className="mb-3 text-slate-700 dark:text-slate-300">
          This is the frontend for an RSS Server that will feed content into a
          Learning Management System (LMS). The goal of the wider project is to
          gather content from external sources and present it to learners in one
          clear, easy-to-scan place.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          <strong>Assessment 1 is frontend only.</strong> There is no backend or
          live RSS processing at this stage. The sample blog posts you see act as
          a temporary stand-in for real RSS feed items, so the focus can stay on
          layout, navigation, usability, and responsive design.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Where it&apos;s heading</h3>
        <p className="text-slate-700 dark:text-slate-300">
          In later stages, a backend and database will be added so that live RSS
          feed items can be stored and displayed. Those items will flow into this
          same interface, which has been built so that adding the backend
          requires minimal rework to the frontend.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">How to use this website</h3>
        <p className="mb-4 text-slate-700 dark:text-slate-300">
          The short video below walks through the main features: navigation,
          switching themes, browsing and searching the feed, and creating a post.
        </p>

        {/* VIDEO PLACEHOLDER — we'll replace this once you've recorded */}
        <div className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <video
          controls
          preload="metadata"
          className="w-full rounded-lg"
        >
          <source src="/22555388_Assignment1_Recording.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        </div>
      </section>
    </div>
  );
}