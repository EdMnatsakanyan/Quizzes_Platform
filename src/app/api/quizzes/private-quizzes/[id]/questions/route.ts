import { roleCheck } from "@/app/api/_helpers/roleMiddlewair";
import Question from "@/app/db.ts/models/questionModel";
import Quiz from "@/app/db.ts/models/quizModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";

interface IProps{
    params: {
        id: string
    },
}
export async function POST(request: NextRequest, {params}: IProps) {
    await syncDatabase()
    await roleCheck(request)
    const {id} = await params

    const findedQuiz = await Quiz.findByPk(id)
    if(!findedQuiz){
        return NextResponse.json({message: 'No quiz with that id'}, {status: 400})
    }
    try {
        const newQuestion = await Question.create({quizId: id, content: ''})
        return NextResponse.json({newQuestion}, {status: 201})
    }catch(err){
        console.log(err)
        return NextResponse.json({}, {status: 500})
    }
}

export async function PUT(request: NextRequest, {params}: IProps){
    await syncDatabase()
    await roleCheck(request)
    const {id} = await params
    const {question} = await request.json()

    const findedQuestion = await Question.findByPk(question.id)
    if(!findedQuestion){
        return NextResponse.json({message: 'No quiz with that id'}, {status: 400})
    }
    findedQuestion!.content = question.content
    findedQuestion.save()
    return NextResponse.json(findedQuestion, {status: 201})
}

