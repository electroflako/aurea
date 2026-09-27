import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    // En local usa .env; en producción, exporta DATABASE_URL con la URL del proveedor:
    //   DATABASE_URL="postgres://…neon.tech/app_db" npx drizzle-kit push
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
