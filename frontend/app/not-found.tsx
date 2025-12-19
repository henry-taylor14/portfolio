import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-bold tracking-tight text-gray-900">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600">
          Sorry, we couldn’t find the page you were looking for.
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-md border border-gray-300 px-5 py-3 text-gray-800 hover:bg-gray-100 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
