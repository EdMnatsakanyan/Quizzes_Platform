"use client";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { Axios } from "../api/_helpers/Axios";
import { IUser } from "../db.ts/models/types";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    Axios.get("/api/auth/authenticate")
      .then((res) => {
        if(res.data.role == 'admin'){
          router.push('admin')
        }
        setUser(res.data)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          router.push("/auth/login");
        }
        console.log(err);
      });
  }, []);

  const handleLogout = () => {
    Axios.get('api/auth/logout')
      .then(() => router.push('/auth/login'))
  }

  return (
    <>
      <header className="rounded-tl rounded-tr bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-5 flex justify-between items-center shadow-md border-2 border-white">
        <div className="flex items-center space-x-4">
          <Image src={"/Icon.png"} alt="icon" width={80} height={80} />

        </div>

        <nav className="space-x-8">
          {user?.role === "admin" && <Link
            href={"/admin"}
            className="text-gray-300 border-1 border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 hover:border-indigo-600 transition duration-300"
          >
            Admin
          </Link>}
          <Link
            href={"/main/profile"}
            className="text-gray-300 border-1  border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600  hover:border-indigo-600 transition duration-300"
          >
            Profile
          </Link>
          <Link
            href={"/main"}
            className="text-gray-300 border-1 border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600  hover:border-indigo-600 transition duration-300"
          >
            Quizzes
          </Link>
          <Link
            href={"/main/results"}
            className="text-gray-300 border-1 border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 hover:border-indigo-600 transition duration-300"
          >
            Results
          </Link>
          
          <button
            className="text-gray-300 border-1 border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 hover:border-indigo-600 transition duration-300"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </nav>
      </header>

      <main className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 min-h-screen border-1 border-white">
        {children}
      </main>

      <footer className="bg-gray-900 text-center text-gray-300 p-4 mt-8">
        Created by Adolf
      </footer>
    </>
  );
}
