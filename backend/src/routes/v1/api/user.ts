import express, { Router } from "express";
import { getUser } from "../../../middleware/User/getUser";
import asyncMiddleware from "../../../middleware/async";
import userController from "../../../controllers/user";
const router: Router = express.Router();

router.param("userId", getUser);

router.get(
  "",
  //   [jwtValidator, hasAccessByRole(["Admin"])],
  asyncMiddleware(userController.getAllUsers),
);

router.get(
  "/:userId",
  //   [jwtValidator, hasAccessByRole(["Admin"])],
  asyncMiddleware(userController.getUserById),
);

router.delete(
  "/:userId",
  //   [jwtValidator, hasAccessByRole(["Admin"])],
  asyncMiddleware(userController.deleteUser),
);

router.put(
  "/:userId",
  //   [jwtValidator, hasAccessByAdminOrOwner],
  asyncMiddleware(userController.updateUser),
);

router.post(
  "/",
  //   [jwtValidator, hasAccessByAdminOrOwner],
  asyncMiddleware(userController.createUser),
);
// router.get(
//   "/avatar/:userId",
//   [jwtValidator, hasAccessByAdminOrOwner],
//   asyncMiddleware(userController.getUserAvatar),
// );

// router.patch(
//   "/update-avatar/:userId",
//   [jwtValidator, hasAccessByAdminOrOwner, uploadAvatar],
//   asyncMiddleware(userController.updateUserAvatar),
// );

export default router;
