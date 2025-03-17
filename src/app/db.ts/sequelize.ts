import { Sequelize } from "sequelize";
import databaseSettings from "../../configs/databaseConfigs";
import initTables from ".";
import associateTables from "./associations";


export const sequelize = new Sequelize({
  database: databaseSettings.database,
  username: databaseSettings.username,
  password: databaseSettings.password,
  host: databaseSettings.host,
  port: Number(databaseSettings.port),
  logging: false,
  dialect: "mysql",
  dialectModule: require("mysql2"),
});

export const syncDatabase = async () => {
  if (syncDatabase.synced) {
    console.log("Database already synced");
    return;
  }
  try {
    console.log("Initializing tables...");
    initTables();
    console.log("Syncing database...");
    await sequelize.sync({ force: false });
    console.log("Database synced");
    associateTables();
    syncDatabase.synced = true;
  } catch (err: any) {
    console.error("Error syncing database:", err.stack);
  }
};
syncDatabase.synced = false;
