import type { Request, Response } from "../dependencies";
import { express } from "../dependencies";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Request Specific API endpoint!");
});
router.post("/test", (req: Request, res: Response) => {
  const body = req.body;
  const params = req.query;

  res.send({
    body: body,
    params: params
  });
});


export {
  router
};
