import UserService from "../user/user.service.js";
import jwt from 'jsonwebtoken';

const AuthController = {};

AuthController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.findByEmailAndPassword(email, password);
    if (!user) {
      return res.status(404).json({ message: "Usuário e senha incorretos." });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, roleId: user.roleId }, 
      process.env.JWT_SECRET,
      { expiresIn: 3600 } 
    );
    delete user.password;
    res.status(200).json({ message: "Login realizado com sucesso!", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

export default AuthController;
