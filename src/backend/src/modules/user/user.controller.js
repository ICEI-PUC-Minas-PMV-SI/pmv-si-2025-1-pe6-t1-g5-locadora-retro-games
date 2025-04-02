import UserService from "./user.service.js";
import jwt from "jsonwebtoken";

const UserController = {};
const SECRET="Teste123";
// get, post, put, patch, etc ...
UserController.getUser = async (req, res) => {
  try {
    const data = await UserService.list();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

UserController.insertUser = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      email: req.body.email,
      cpf: req.body.cpf,
      password: req.body.password,
    };
    await UserService.create(body);
    res.status(200).json("User created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};
UserController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.findByEmailAndPassword(email, password);

    if (!user) {
      return res.status(404).json({ message: "Usuário e senha Incorrétos." });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      SECRET, 
      { expiresIn: 3600 } 
    );
    res.status(200).json({ message: "Login realizado com sucesso! " + "Token: "+ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

UserController.updateUser = async (req, res) => {
  try {
    const body = {
      id: Number(req.params.id),
      name: req.body.name,
      email: req.body.email,
      cpf: req.body.cpf,
      password: req.body.password,
    };
    console.log(req.body);
    await UserService.update(body);
    res.status(200).json("User updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

UserController.deleteUser = async (req, res) => {
  try {
    const body = {
      id: Number(req.params.id),
    };
    await UserService.delete(body);
    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

export default UserController;
