import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Template engine
app.set("view engine", "ejs");

// Views directory
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
import pageRoutes from "./routes/pageRoutes.js";

app.use("/", pageRoutes);

// Export application
export default app;
