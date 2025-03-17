import { NextRequest, NextResponse } from "next/server";
import * as jwt from 'jsonwebtoken'
import User from "@/app/db.ts/models/usersModel";
import { IUser } from "@/app/db.ts/models/types";
import Result from "@/app/db.ts/models/resultsModel";
import { syncDatabase } from "@/app/db.ts/sequelize";

export async function GET(request: NextRequest) {
    await syncDatabase()
    const token = request.cookies.get('token')?.value
    
    if(!token) {
        return NextResponse.json({message: 'Not authenticated'}, {status: 401})
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string) as IUser
        if(!user) {
            return NextResponse.json({message: 'Not authenticated'}, {status: 401})
        }
        const finded = await User.findOne({
            where: {id: user.id},
            include: [{
                model: Result
            }]
        })
        if(!finded) {
            return NextResponse.json({message: 'Not authenticated'}, {status: 401})
        }
        return NextResponse.json(finded, {status: 200})
    } catch(err: any) {
        return NextResponse.json({message: 'Not authenticated'}, {status: 401})
    }
}