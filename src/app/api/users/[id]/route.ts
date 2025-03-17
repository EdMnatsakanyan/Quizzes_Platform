import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";
import authJwt from "../../_helpers/authMiddlewair";
import { IUser } from "@/app/db.ts/models/types";
import User from "@/app/db.ts/models/usersModel";
import Quiz from "@/app/db.ts/models/quizModel";
import Result from "@/app/db.ts/models/resultsModel";

interface IProps{
    params: {
        id: number
    }
}

export async function PUT(request: NextRequest, {params}: IProps){
    await syncDatabase()
    const {id} = await params
    const body = await request.json()
    const user = await authJwt(request) as IUser

    if(user.id != id){
        return NextResponse.json({message: "Can't change other's data"})
    }

    try {
        const changedUser = await User.update({...body}, {where: {id}})
        return NextResponse.json(changedUser, {status: 200})
    } catch(err) {
        console.log(err)
    }
}

export async function GET(request: NextRequest, {params}: IProps){
    await syncDatabase()
    const {id} = await params

    try {
        const user = await User.findByPk(id,{
            attributes: {exclude: ['password']},
            include: [{
                model: Result,
                include: [{
                    model: Quiz
                }]
            }]
        })
        if(!user){
            return NextResponse.json({message: 'No user with that id'}, {status: 400})
        }
        return NextResponse.json({user}, {status: 200})
    } catch(err) {
        console.log(err)
        return NextResponse.json({message: 'Something went wrong'}, {status: 500})
    }
}