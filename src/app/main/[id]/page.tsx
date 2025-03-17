"use client"

import { Quiz } from "@/app/(components)/Quiz"
import { useParams } from "next/navigation"

export default function QuizPage(){
    const {id} = useParams()

    return <>
        <Quiz id={+id!}/>
    </>
}