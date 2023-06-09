import express, { Request, Response } from "express";
import multer from "multer";
import path, { extname } from "path";
import { CreateSourceController } from "../../adapters/controllers/sources/create-source.controller";
import { ExcelFileRetrievalStrategy } from "../../application/strategies/file-data-retrieval/excel-file-retrieval-strategy";
import { ReadLocalFileDataUseCase } from "../../application/use-cases/files/read-local-file-data.use-case";
import { CreateStatementsFromLogsUseCase } from "../../application/use-cases/statements/create-statements-from-logs.use-case";
import { SourceInMemoryRepository } from "../db/in-memory/source-in-memory.repository";
import { StatementInMemoryRepository } from "../db/in-memory/statement-in-memory.repository";

const app = express();

app.use(express.json());

// Multer config
const tmpFolderPath = path.resolve(__dirname, "../../../tmp/");
const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, tmpFolderPath);
  },
  filename: (_, file, cb) => {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + extname(file.originalname);
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Repositories
const sourceRepository = new SourceInMemoryRepository();
const statementRepository = new StatementInMemoryRepository();

// Routes

const createSourceController = new CreateSourceController(
  new ReadLocalFileDataUseCase(
    sourceRepository,
    new ExcelFileRetrievalStrategy()
  ),
  new CreateStatementsFromLogsUseCase(statementRepository)
);
app.post(
  "/sources",
  upload.single("source"),
  async (req: Request, res: Response) => {
    try {
      return await createSourceController.handle(req, res);
    } catch (err: any) {
      res.status(err.status ?? 500).json(err);
    }
  }
);

const PORT = parseInt(process.env.PORT ?? "5001");
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
