import { NextRequest, NextResponse } from "next/server";
import authJwt from "./authMiddlewair";
import { IUser } from "@/app/db.ts/models/types";

export const roleCheck = async(request: NextRequest) => {
    const token = request.cookies.get('token')
    try {
        const user = await authJwt(request) as IUser
        if(user.role !== 'admin'){
            return NextResponse.json({message: 'Forbidden'}, {status: 403})
        }
        return
    } catch(err) {
        console.log(err)
        return NextResponse.json({}, {status: 500})
    }
}