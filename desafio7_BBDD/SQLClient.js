import knex from "knex";

class SQLClient {
  constructor(options) {
    this.knex = knex(options);
  }

  createTable(tableName) {
    if (tableName === "productos") {
      return this.knex.schema.dropTableIfExists("products").finally(() => {
        return this.knex.schema.createTable("products", (table) => {
          table.increments("id").primary().unsigned;
          table.string("nombre", 50).notNullable();
          table.integer("precio").notNullable().unsigned;
          table.string("thumbnail", 500);
        });
      });
    } else if (tableName === "chat") {
      return this.knex.schema.dropTableIfExists("chat").finally(() => {
        return this.knex.schema.createTable("chat", (table) => {
          table.string("date", 20).notNullable();
          table.string("email", 50).notNullable();
          table.text("messages", 500);
        });
      });
    }
  }
  createChatTable() {
    return this.knex.schema.dropTableIfExists("products").finally(() => {
      return this.knex.schema.createTable("products", (table) => {
        table.increments("id").primary().unsigned;
        table.string("nombre", 50).notNullable();
        table.integer("precio").notNullable().unsigned;
        table.string("thumbnail", 500);
      });
    });
  }
  addProduct(product) {
    return this.knex("products").insert(product);
  }

  getAll() {
    return this.knex("products").select("*");
  }

  deletebyId(id) {
    return this.knex.from("products").where("id", "=", id).del();
  }
  close() {
    this.knex.destroy();
  }
}

export default SQLClient;
