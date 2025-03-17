"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const handleLogout = () => {
    Axios.get("api/auth/logout").then(() => router.push("/auth/login"));
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-gray-900/60 border-b border-gray-700 shadow-xl">
        <nav className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Panel
          </h1>
          <div className="space-x-6 flex">
            <Link
              href="/admin/private-quizzes"
              className="px-5 py-3 text-lg font-medium rounded-lg border border-gray-600 bg-gray-800 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition duration-300 shadow-md transform hover:scale-105"
            >
              Private Quizzes
            </Link>
            <Link
              href="/admin/add-quiz"
              className="px-5 py-3 text-lg font-medium rounded-lg border border-gray-600 bg-gray-800 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition duration-300 shadow-md transform hover:scale-105"
            >
              Add Quiz
            </Link>
            <Link
              href="/admin"
              className="px-5 py-3 text-lg font-medium rounded-lg border border-gray-600 bg-gray-800 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition duration-300 shadow-md transform hover:scale-105"
            >
              My Quizzes
            </Link>
            <Link
              href="/admin/users"
              className="px-5 py-3 text-lg font-medium rounded-lg border border-gray-600 bg-gray-800 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition duration-300 shadow-md transform hover:scale-105"
            >
              Users
            </Link>
            <Link
              href="/admin/results"
              className="px-5 py-3 text-lg font-medium rounded-lg border border-gray-600 bg-gray-800 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition duration-300 shadow-md transform hover:scale-105"
            >
              Results
            </Link>
            <button
              className="px-5 py-3 text-lg font-medium rounded-lg border border-gray-600 bg-gray-800 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition duration-300 shadow-md transform hover:scale-105"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-8 bg-gray-800 rounded-lg shadow-md">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 text-sm border-t border-gray-700 ">
        Created by Adolf &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
