import { mySQLoptions } from "./options/mysqlconn.js";
import { SQLLiteoptions } from "./options/sqlLiteconn.js";
import SQLClient from "./SQLClient.js";

const mySql = new SQLClient(mySQLoptions, "products");
const sqlite = new SQLClient(SQLLiteoptions, "chat");

(async (req, res) => {
  try {
    await mySql.createTable("products");
    await sqlite.createTable("chat");
    console.log("Tablas creadas con Exito");
    await mySql.close();
    await sqlite.close();
    return;
  } catch (err) {
    console.log("No se pudo crear la tabla");
    console.log(err);
    return;
  }
})();
