import Result from "@/app/db.ts/models/resultsModel";
import User from "@/app/db.ts/models/usersModel";
import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    await syncDatabase()
    try {
        const users = await User.findAll({
            where: {role :'user'},
            include: [{
                model: Result
            }]
        })
        return NextResponse.json({users}, {status: 200})
    } catch(err) {
        console.log(err)
        return NextResponse.json({message: 'Something went wrong'}, {status: 500})
    }
}