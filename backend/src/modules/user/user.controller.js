import UserService from "./user.service.js";
import jwt from "jsonwebtoken";

const UserController = {};
// get, post, put, patch, etc ...
UserController.getUser = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10; // default 10 items per page
    const page = Number(req.query.page) || 1; // default first page
    const offset = (page - 1) * limit;
    const search = req.query?.search;
    const { users, total } = await UserService.list(limit, offset, search);
    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

UserController.getUserById = async (req, res) => {
  try {
    const data = await UserService.getUserById(req.userData.id);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

UserController.getUserFromRequest = async (req, res) => {
  try {
    const data = await UserService.getUserById(req.params.id);
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
    if (!body.name || !body.email || !body.cpf || !body.password) {
      res.status(404).json("Missing or wrong data");
    }
    await UserService.create(body);
    res.status(200).json("User created successfully");
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
