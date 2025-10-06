
export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-2xl">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100">About Me</h1>
        </header>
        <div className="prose prose-invert text-neutral-300">
          <p>Welcome to my digital garden.</p>
          <p>This is where I share what I'm learning about programming, technology, and maybe some other things.</p>
        </div>
      </div>
    </main>
  );
}
