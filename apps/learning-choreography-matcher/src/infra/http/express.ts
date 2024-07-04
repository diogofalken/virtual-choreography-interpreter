import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

import { GetChoreographiesController } from "../../adapters/controllers/get-choreographies.controller";
import { GetVirtualChoreographiesUseCase } from "../../application/use-cases/get-virtual-choreographies.use-case";
import { GetChoreographiesSchema } from "./validators/get-choreographies.schema";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

const getChoreographiesController = new GetChoreographiesController(
  new GetVirtualChoreographiesUseCase()
);
app.get("/choreographies", async (req: Request, res: Response) => {
  try {
    const data = GetChoreographiesSchema.parse(req);

    const sourceResponse = await fetch(
      `http://localhost:5001/sources/${data.query.sourceId}?statements=true`
    );
    const { statements } = await sourceResponse.json();

    const result = await getChoreographiesController.handle(
      statements,
      data.query.sourceId
    );

    return res.status(200).json(result);
  } catch (err: any) {
    console.log(err.toString());
    return res.status(err.status ?? 500).json({ err: err.toString() });
  }
});

const PORT = parseInt(process.env.PORT ?? "5002");
app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
