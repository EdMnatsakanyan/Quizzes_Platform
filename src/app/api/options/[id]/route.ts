import { syncDatabase } from "@/app/db.ts/sequelize";
import { NextRequest, NextResponse } from "next/server";
import authJwt from "../../_helpers/authMiddlewair";
import Option from "@/app/db.ts/models/optionsModel";

interface IProps{
    params: {
        id: number
    }
}

export async function DELETE(request: NextRequest, {params}: IProps){
    await syncDatabase()
    const user = await authJwt(request)
    const {id} = await params

    const finded = (await Option.findByPk(id))?.dataValues
    if(!finded) {
        return NextResponse.json({message: 'no option with that id'}, {status: 400})
    }

    await Option.destroy({where: {id}})
    return NextResponse.json({message: 'Deleted successfully'}, {status: 200})
}