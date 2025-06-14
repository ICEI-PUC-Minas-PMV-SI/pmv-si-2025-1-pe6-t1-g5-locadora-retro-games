import UserService from "../user/user.service.js";
import jwt from 'jsonwebtoken';

const AuthController = {};

AuthController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.findByEmailAndPassword(email, password);
    if (!user) {
      return res.status(400).json({ message: "Usuário e senha incorretos." });
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

AuthController.register = async (req, res) => {
  try {
    const { name, email, password, cpf, phone } = req.body;
    
    // Validação básica
    if (!name || !email || !password || !cpf || !phone) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Criar usuário com role de usuário comum (roleId: 2)
    const userData = {
      name,
      email,
      password,
      telephone: phone,
      cpf,
      roleId: 2
    };

    await UserService.create(userData, 1); // roleId 1 (admin) para permitir criação

    // Buscar o usuário criado
    const newUser = await UserService.findByEmail(email);
    if (!newUser) {
      return res.status(500).json({ message: "Erro ao criar usuário." });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, roleId: newUser.roleId }, 
      process.env.JWT_SECRET,
      { expiresIn: 3600 } 
    );

    delete newUser.password;
    res.status(201).json({ 
      message: "Usuário criado com sucesso!", 
      token, 
      user: newUser 
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.message && error.message.includes('email')) {
      res.status(400).json({ message: "Email já está em uso." });
    } else {
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
};

export default AuthController;
