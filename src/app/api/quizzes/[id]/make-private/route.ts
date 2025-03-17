import { roleCheck } from "@/app/api/_helpers/roleMiddlewair"
import Quiz from "@/app/db.ts/models/quizModel"
import Result from "@/app/db.ts/models/resultsModel"
import { sequelize, syncDatabase } from "@/app/db.ts/sequelize"
import { NextRequest, NextResponse } from "next/server"

interface IProps {
    params: {
        id: number
    }
}

export async function PUT(request: NextRequest, {params}: IProps){
    await syncDatabase()
    const {id} = await params
    const finded = await Quiz.findByPk(id)
    await roleCheck(request)
    if(!finded){
        return NextResponse.json({message: 'No quiz with that id'}, {status: 400})
    }

    const t = await sequelize.transaction()
    try {
        await Result.destroy({where: {quizId: id}})
        finded.isPrivate = true
        await finded.save()
        await t.commit()
        return NextResponse.json({message: {}}, {status: 200})
    } catch(err) {
        console.log(err)
        await t.rollback()
        return NextResponse.json({message: 'Something went wrong'}, {status: 500})
    }
}