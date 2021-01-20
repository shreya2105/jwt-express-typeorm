
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { User } from "../entity/User";

class UserController{

//Get all the users from database
static getUsers = async (req: Request, res: Response) => {
  
  const userRepository = getRepository(User);
  const users = await userRepository.find({
    select: ["id", "username", "role"] 
  });
  
  res.send(users);
};
//Get user by ID
static getUser = async (req: Request, res: Response) => {
  
  const id: number = req.params.id;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOneOrFail(id, {
      select: ["id", "username", "role"] 
    });
    res.send(user);
  } catch (error) {
    res.status(404).send("User not found");
  }
};

// Create new user
static newUser = async (req: Request, res: Response) => {
  let { username, password, role } = req.body;
  let user = new User();
  user.username = username;
  user.password = password;
  user.role = role;

  //Validade if the parameters are ok
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }

  //Hash the password, to securely store on DB
  user.hashPassword();

  //Check if the username is already in use
  const userRepository = getRepository(User);
  try {
    await userRepository.save(user);
  } catch (error) {
    res.status(409).send("username already in use");
    return;
  }

  //If all ok, send 201 response
  res.status(201).send("User created");
};

//Update a user's details
static updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { username, role } = req.body;

  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    res.status(404).send("User not found");
    return;
  }

  //Validate the new values on model
  user.username = username;
  user.role = role;
  const errors = await validate(user);
  if (errors.length > 0) {
    res.status(400).send(errors);
    return;
  }
};

//Delete a user
static deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    res.status(404).send("User not found");
    return;
  }
  userRepository.delete(id);

  res.status(204).send();
};
};

export default UserController;
