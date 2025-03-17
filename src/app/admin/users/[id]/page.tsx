"use client";

import { Axios } from "@/app/api/_helpers/Axios";
import { IUser } from "@/app/db.ts/models/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    Axios.get("api/users/" + id)
      .then((res) => {
        console.log(res.data.user);
        setUser(res.data.user);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-10 flex flex-col items-center">
      <div className="max-w-lg w-full bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700 text-center">
        <img
          src={user.image_url || "/profile.jpg"}
          alt={user.username}
          className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-indigo-500 shadow-md"
        />
        <h1 className="mt-4 text-3xl font-extrabold text-white">{user.username}</h1>
        <p className="mt-1 text-lg text-gray-400">{user.email}</p>
      </div>

      <div className="mt-10 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-indigo-400">Passed Quizzes</h2>
        <p className="text-gray-300">Total: {user.Results.length}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {user.Results.map((result) => (
            <div
              key={result.id}
              className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={result.Quiz.quiz_img}
                alt={result.Quiz.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="mt-3 text-xl font-semibold text-white">{result.Quiz.name}</p>
              <strong className="block mt-2 text-green-400 text-lg">
                Correct: {result.correctSum}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
