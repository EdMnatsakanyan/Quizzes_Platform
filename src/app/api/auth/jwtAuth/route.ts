import { NextRequest, NextResponse } from "next/server";
import * as jwt from 'jsonwebtoken'
import User from "@/app/db.ts/models/usersModel";
import { IUser } from "@/app/db.ts/models/types";

export async function POST(request: NextRequest){
    const {token} = await request.json()

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string) as IUser
        const finded = await User.findByPk(user.id)
        if(!finded) {
            return NextResponse.json({message: 'Authentication failed'}, {status: 401})
        }
        return NextResponse.json({}, {status: 200})
        
    } catch(err) {
        return NextResponse.json({message: 'Authentication failed'}, {status: 401})
    }
}