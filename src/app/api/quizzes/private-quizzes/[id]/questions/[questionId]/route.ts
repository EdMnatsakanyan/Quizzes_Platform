import { roleCheck } from "@/app/api/_helpers/roleMiddlewair"
import Question from "@/app/db.ts/models/questionModel"
import { syncDatabase } from "@/app/db.ts/sequelize"
import { NextRequest, NextResponse } from "next/server"

interface IProps{
    params: {
        id: string
        questionId: string
    }
}
export async function DELETE(req:NextRequest, {params}: IProps){
    await syncDatabase()
    await roleCheck(req)
    const { questionId} = await params

    try {
        await Question.destroy({where: {id: questionId}})
        return NextResponse.json({}, {status: 200})
    } catch(error) {
        console.log(error)
        return NextResponse.json({}, {status: 500})
    }
}