import knex from "knex";

class SQLClient {
  constructor(options, tableName) {
    this.knex = knex(options);
    this.tableName = tableName;
  }

  createTable() {
    if (this.tableName === "products") {
      return this.knex.schema.dropTableIfExists("products").finally(() => {
        return this.knex.schema.createTable("products", (table) => {
          table.increments("id").primary().unsigned;
          table.string("nombre", 50).notNullable();
          table.integer("precio").notNullable().unsigned;
          table.string("thumbnail", 500);
        });
      });
    } else if (this.tableName === "chat") {
      return this.knex.schema.dropTableIfExists("chat").finally(() => {
        return this.knex.schema.createTable("chat", (table) => {
          table.string("date", 20).notNullable();
          table.string("email", 50).notNullable();
          table.text("message", 500);
        });
      });
    }
  }
  add(data) {
    return this.knex(this.tableName).insert(data);
  }

  getAll() {
    return this.knex(this.tableName).select("*");
  }

  deletebyId(id) {
    return this.knex.from(this.tableName).where("id", "=", id).del();
  }
  close() {
    this.knex.destroy();
  }
}

export default SQLClient;
