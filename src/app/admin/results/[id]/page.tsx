"use client";

import { Results } from "@/app/(components)/Results";
import { Axios } from "@/app/api/_helpers/Axios";
import { IResult } from "@/app/db.ts/models/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState<IResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    Axios.get("api/results/" + id)
      .then((res) => setResult(res.data))
      .catch((err) => {
        console.log(err);
        router.push("/admin/results");
      });
  }, [id]);

  if (!result) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-100 p-10">
      <Results result={result} />
    </div>
  );
}
