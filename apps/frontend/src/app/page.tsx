export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Convoy</h1>
        <p className="mt-4 text-gray-400">Real-Time Logistics Tracking System</p>
        <div className="mt-8">
          <a
            href="/login"
            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
