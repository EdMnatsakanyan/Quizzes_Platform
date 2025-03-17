import Option from "@/app/db.ts/models/optionsModel";
import Question from "@/app/db.ts/models/questionModel";
import Quiz from "@/app/db.ts/models/quizModel";
import { IQuiz } from "@/app/db.ts/models/types";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";

interface IProps{
    params: {
        id: number
    }
}

export async function POST(request: NextRequest, {params}: IProps){
    await syncDatabase()

    const {id} = await params

    const finded = await Quiz.findByPk(
        id, 
        {
            include: [
                {
                    model: Question,
                    include: [Option]
                }
            ]
        }
    )
    const quiz = finded?.dataValues

    if(quiz.Questions.length < 3) {
        return NextResponse.json({message: 'Quiz must have at least 3 questions'}, {status: 400})
    }

    for(let i = 0; i < quiz.Questions.length; ++i) {
        if(quiz.Questions[i].content === ''){
            return NextResponse.json({message: "Question's content can't be empty" + ++i}, {status: 400})
        }
        let options = quiz.Questions[i].Options
        if(options.length < 2){
            return NextResponse.json({message: 'Evert question must have at least 2 options. Question: ' + ++i}, {status: 400})
        }
        let count = 0
        for(let j = 0; j < options.length; ++j){
            if(options[j].content === ''){
            return NextResponse.json({message:"Option's content can't be empty. Question: " + ++i}, {status: 400})
            }
            if(options[j].isTrue) count ++
        }
        if(count !== 1){
            return NextResponse.json({message: 'Every question must have 1 true option. Quiz: ' + ++i}, {status: 400})
        }
    }

    finded!.isPrivate = false
    finded!.save()
    return NextResponse.json({message: 'Quiz maked public successfully'}, {status: 200})
}