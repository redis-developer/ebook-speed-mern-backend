import type { Request, Response } from "../dependencies";
import { HTTP_STATUS_CODES } from "../config/constants";
import { LoggerCls } from "../utils/logger";

import { express } from "../dependencies";

import { MovieController } from "./movie-cntlr";

const router = express.Router();
const DEFAULT_USER_ID = "usrNodeJS";

interface IApiResponseBody {
  data: unknown,
  error: unknown
}
const getPureError = (err: unknown) => {
  return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
};

router.get("/", (req: Request, res: Response) => {
  res.send("Request Specific API endpoint!");
});

//--------------------------------
router.post("/insertMovie", async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null
  };

  try {
    result.data = await MovieController.insertMovie(body, DEFAULT_USER_ID);
  }
  catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error("/insertMovie API failed !", pureErr);
  }

  res.send(result);
});
//--------------------------------

router.post("/updateMovie", async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null
  };

  try {
    result.data = await MovieController.updateMovie(body, DEFAULT_USER_ID);
  }
  catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error("/updateMovie API failed !", pureErr);
  }

  res.send(result);
});

//--------------------------------
router.post("/getMoviesByText", (req: Request, res: Response) => {
  const body = req.body;
  const params = req.query;

  res.send({
    body: body,
    params: params
  });
});
//--------------------------------
router.post("/getMoviesByBasicFilters", (req: Request, res: Response) => {
  const body = req.body;
  const params = req.query;

  res.send({
    body: body,
    params: params
  });
});
//--------------------------------

export {
  router
};
