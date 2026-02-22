import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import releasesRouter from "./routes/releases.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/releases", releasesRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map