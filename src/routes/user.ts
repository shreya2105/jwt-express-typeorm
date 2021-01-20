import { Router } from "express";
  import UserController from "../controllers/UserController";
  import { checkRole } from "../middlewares/checkRole";

  const router = Router();

  //Get all users
  router.get("/", [checkRole(["Editor", "Admin"])], UserController.getUsers);

  // Get one user
  router.get("/:id",[checkRole(["Editor", "Admin"])],UserController.getUser);

  //Create a new user
  router.post("/", [checkRole(["Admin"])], UserController.newUser);

  //Update a user's details
  router.patch("/:id",[checkRole(["Admin"])], UserController.updateUser);

  //Delete one user
  router.delete("/:id",[checkRole(["Admin"])],UserController.deleteUser);

  export default router;