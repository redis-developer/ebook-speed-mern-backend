import type { Request, Response } from "../dependencies";
import { HTTP_STATUS_CODES } from "../config/constants";
import { LoggerCls } from "../utils/logger";

import { express } from "../dependencies";

import { MovieController } from "./movie-cntlr";
import { MasterController } from "./master-cntlr";
import { MasterRedisController } from "./master-redis-cntlr";
import { RedisCacheAsideController } from "./redis-cache-aside-cntlr";

const router = express.Router();
const DEFAULT_USER_ID = "usrNodeJS";

interface IApiResponseBody {
  data: unknown,
  error: unknown,
  isFromCache?: boolean
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
router.post("/getMoviesByText", async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null,
    isFromCache: false
  };

  try {
    const cachedData = await RedisCacheAsideController.getDataFromRedis(body);
    if (cachedData && cachedData.length) {
      result.data = cachedData;
      result.isFromCache = true;
    }
    else {
      const dbData = await MovieController.getMoviesByText(body);
      RedisCacheAsideController.setDataInRedis(body, dbData); //set async
      result.data = dbData;
    }
  }
  catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error("/getMoviesByText API failed !", pureErr);
  }

  res.send(result);
});
//--------------------------------
router.post("/getMoviesByBasicFilters", async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null,
    isFromCache: false
  };

  try {
    const cachedData = await RedisCacheAsideController.getDataFromRedis(body);
    if (cachedData && cachedData.length) {
      result.data = cachedData;
      result.isFromCache = true;
    }
    else {
      const dbData = await MovieController.getMoviesByBasicFilters(body);
      RedisCacheAsideController.setDataInRedis(body, dbData, true); //set async
      result.data = dbData;
    }
  }
  catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error("/getMoviesByBasicFilters API failed !", pureErr);
  }

  res.send(result);
});
//--------------------------------
router.post("/getMasterCategories", async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null
  };

  try {
    result.data = await MasterController.getMasterCategories(body, {});
  }
  catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error("/getMasterCategories API failed !", pureErr);
  }

  res.send(result);
});

//--------------------------------
router.post("/getMasterCategoriesFromRedis", async (req: Request, res: Response) => {
  const body = req.body;
  const result: IApiResponseBody = {
    data: null,
    error: null
  };

  try {
    result.data = await MasterRedisController.getMasterCategoriesFromRedis(body);
  }
  catch (err) {
    const pureErr = getPureError(err);
    result.error = pureErr;
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    LoggerCls.error("/getMasterCategoriesFromRedis API failed !", pureErr);
  }

  res.send(result);
});

export {
  router
};
