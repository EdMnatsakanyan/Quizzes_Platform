"use client";

import ToastNotification from "@/app/(components)/ToastContainer";
import { Axios } from "@/app/api/_helpers/Axios";
import { IUser } from "@/app/db.ts/models/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [newUsername, setNewUsername] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [usernameErr, setUsernameErr] = useState<string>("")
  const [passwordErr, setPasswordErr] = useState<string>("")

  const refetch = () => {
    Axios
      .get("api/auth/authenticate")
      .then((res) => {
        setNewUsername(res.data.username)
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          router.push("/auth/login");
        }
      });
  }

  useEffect(() => {
    refetch()
  }, []);

  const handleChangeUsername = () => {
    if(!newUsername || newUsername.length < 3){
      setUsernameErr('Username length must be at least 3')
      return
    }
    if(newUsername == user.username){
      setUsernameErr('New username cant be same that old one')
      return
    }

    Axios.put('api/users/' + user.id, {username: newUsername})
      .then(res => {
        toast.success('Username changed sucessfully !')
        refetch()
        setUsernameErr('')
      })
      .catch(err => {
        console.log(err)
        setUsernameErr('Something went wrong')
      })
  };

  const handleChangePassword = () => {
    if(newPassword.length < 4) {
      setPasswordErr('Password length must be at least 4')
      return
    }
    Axios.put(`api/users/${user.id}/change-password`, {
      newPassword,
      oldPassword
    })
      .then(res => {
        setPasswordErr('')
        setNewPassword('')
        setOldPassword('')
        toast.success('Password changed successfully !')
      })
      .catch(err => {
        setPasswordErr(err.response.data?.message || 'something went wrong')
      })
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 rounded-2xl bg-gray-900 shadow-xl border border-gray-800">
      <ToastNotification /> 
      <h1 className="text-3xl font-semibold text-center text-gray-200">Profile</h1>

      <div className="flex flex-col items-center mt-6">
        <img
          src={user.image_url || "/profile.jpg"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-700 shadow-md"
        />
        <h2 className="mt-4 text-2xl font-bold text-white">{user.username}</h2>
        <p className="text-gray-400">Passed {user.Results.length} quizzes</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Change Username */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
          <p className="text-gray-300 text-lg font-medium">Change Username</p>
          {usernameErr || <p className="text-white">{usernameErr}</p>}
          <div className="flex items-center gap-3 mt-3">
            <input
              type="text"
              defaultValue={user.username}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2 text-gray-300 bg-gray-900 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleChangeUsername}
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-500 transition-all"
            >
              Change
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 bg-gray-800 rounded-xl shadow-md border border-gray-700">
          <p className="text-gray-300 text-lg font-medium">Change Password</p>
          {passwordErr || <p className="text-red-400">{passwordErr}</p>}
          <div className="mt-3 space-y-3">
            <input
              type="password"
              placeholder="Old password"
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-300 bg-gray-900 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="password"
              placeholder="New password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-300 bg-gray-900 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleChangePassword}
              className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-500 transition-all"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
