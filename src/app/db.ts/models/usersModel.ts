import { DataTypes, Model } from "sequelize";
import { IResult, IUser } from "./types";

import Quiz from "./quizModel";

class User extends Model implements IUser {
  id!: number;
  username!: string;
  email!: string;
  password!: string;
  image_url!: string;
  role!: "user" | "admin";
  verified!: boolean;
  verifyToken!: string;
  Results!: IResult[];

  static initTable(sequelize: any) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {isEmail: true}
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM("user", "admin"),
          defaultValue: "user",
        },
        image_url: {
          type: DataTypes.STRING,
          defaultValue: '/profile.jpg'
        },
        verified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        verifyToken: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: "users",
        modelName: "User",
      }
    );
  }
}

export default User;
