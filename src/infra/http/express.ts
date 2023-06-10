import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import multer, { FileFilterCallback } from "multer";
import path, { extname } from "path";
import { CreateSourceController } from "../../adapters/controllers/sources/create-source.controller";
import { GetSourceController } from "../../adapters/controllers/sources/get-source.controller";
import { ExcelFileRetrievalStrategy } from "../../application/strategies/file-data-retrieval/excel-file-retrieval-strategy";
import { ReadLocalFileDataUseCase } from "../../application/use-cases/files/read-local-file-data.use-case";
import { WriteLocalFileUsecase } from "../../application/use-cases/files/write-local-file.use-case";
import { CreateRecipeUseCase } from "../../application/use-cases/recipes/create-recipe.use-case";
import { ExportSourceUseCase } from "../../application/use-cases/sources/export-source.use-case";
import { CreateStatementsFromLogsUseCase } from "../../application/use-cases/statements/create-statements-from-logs.use-case";
import { RecipeInMemoryRepository } from "../db/in-memory/recipe-in-memory.repository";
import { SourceInMemoryRepository } from "../db/in-memory/source-in-memory.repository";
import { StatementInMemoryRepository } from "../db/in-memory/statement-in-memory.repository";
import { GetSourceSchema } from "./validators/get-source.schema";

const app = express();

app.use(cors());
app.use(helmet());
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
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedExtensions = [".xlsx"];

  const fileExtension = extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(
      new Error(`Invalid file type (allowed extensions: ${allowedExtensions}).`)
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB
  },
});

// Repositories
const sourceRepository = new SourceInMemoryRepository();
const statementRepository = new StatementInMemoryRepository();
const recipeRepository = new RecipeInMemoryRepository();

// Routes
const createSourceController = new CreateSourceController(
  new ReadLocalFileDataUseCase(
    sourceRepository,
    new ExcelFileRetrievalStrategy()
  ),
  new CreateStatementsFromLogsUseCase(statementRepository),
  new CreateRecipeUseCase(recipeRepository, statementRepository)
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

const getSourceController = new GetSourceController(
  new ExportSourceUseCase(
    sourceRepository,
    recipeRepository,
    statementRepository,
    new WriteLocalFileUsecase()
  )
);
app.get("/sources/:id", async (req: Request, res: Response) => {
  try {
    const data = GetSourceSchema.parse(req);

    const result = await getSourceController.handle(data.params.id, data.query);

    return res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status ?? 500).json(err);
  }
});

const PORT = parseInt(process.env.PORT ?? "5001");
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
