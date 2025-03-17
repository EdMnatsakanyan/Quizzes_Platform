"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import { IUser } from "@/app/db.ts/models/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState<IUser[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    Axios.get("api/users")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!users) {
    return (
      <div className="w-150 flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  w-full bg-gray-900 text-gray-100 p-10">
      <h1 className="text-4xl font-extrabold text-white text-center mb-10">Users</h1>
      <div className="grid w-250 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => router.push("users/" + user.id)}
            className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg border border-gray-700 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={user.image_url || "/profile.jpg"}
              alt={user.username}
              className="w-24 h-24 object-cover rounded-full mx-auto shadow-md border-2 border-indigo-500"
            />
            <h1 className="mt-4 text-lg font-semibold text-indigo-400 text-center">{user.username}</h1>
            <p className=" font-semibold text-indigo-400 text-center">{user.email}</p>
            <p className="mt-2 text-gray-300 text-center">
              Passed <span className="font-bold text-green-400">{user.Results.length}</span> quizzes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
