
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 text-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-neutral-100 mb-4">Welcome to My Blog</h1>
        <p className="text-lg text-neutral-400">
          This is my personal space to document my journey in technology. 
          <br />
          Explore my notes, projects, and learn more about me.
        </p>
      </div>
    </main>
  );
}
