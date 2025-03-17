import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt"
import User from "@/app/db.ts/models/usersModel";
import { IUser } from "@/app/db.ts/models/types";
import { syncDatabase } from "@/app/db.ts/sequelize";

interface IProps{
    params: {
        id: number
    }
}

export async function PUT(request: NextRequest, {params}: IProps){
    await syncDatabase()
    const {id} = await params
    const {newPassword, oldPassword} = await request.json()

    const finded = await User.findByPk(id) as IUser
    const isMatch = await bcrypt.compare(oldPassword, finded.password)
    if(!isMatch){
        return NextResponse.json({message: 'Wrong password'}, {status: 400})
    }

    const newHashed = await bcrypt.hash(newPassword, 10)
    finded.password = newHashed
    finded.save()
    return NextResponse.json({message: 'Changed successfully !'}, {status: 200})
}