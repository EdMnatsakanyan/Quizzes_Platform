import Image from "next/image";
import Link from "next/link";
import { syncDatabase } from "./db.ts/sequelize";

export default async function HomePage() {
  await syncDatabase();

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center relative">
      <div className="text-center z-10">
        <h1 className="text-5xl font-bold mb-6">🚀 Quizzes Platform</h1>
        <p className="text-lg text-gray-300 mb-8">
          Test your knowledge in JavaScript, React, Node.js, and more!
        </p>

        <div className="flex gap-4 justify-center mb-8">
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition"
            >
            Sign Up
          </Link>
          <Link
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-600 transition"
            href="/auth/login"
          >
            Sign In
          </Link>
        </div>

        <div className="absolute top-20 left-16 z-0">
          <Image
            src="/JavaScript2.png"
            alt="JavaScript"
            width={80}
            height={80}
          />
        </div>
        <div className="absolute top-40 right-16 z-0">
          <Image
            src="/React.png"
            alt="React"
            width={80}
            height={80}
          />
        </div>
        <div className="absolute bottom-20 left-70 z-0">
          <Image
            src="/node.png"
            alt="Node.js"
            width={80}
            height={80}
          />
        </div>
        <div className="absolute bottom-40 right-60 z-0">
          <Image
            src="/express.png"
            alt="Express.js"
            width={80}
            height={80}
          />
        </div>
        <div className="absolute top-10 left-170 z-0">
          <Image
            src="/Nest.png"
            alt="Nest.js"
            width={80}
            height={80}
          />
        </div>
      </div>
    </main>
  );
}
