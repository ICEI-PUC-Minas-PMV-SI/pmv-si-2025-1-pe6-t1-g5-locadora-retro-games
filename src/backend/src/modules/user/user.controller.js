import UserService from "./user.service.js";

const UserController = {};

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
            password: req.body.password
        };
        await UserService.create(body);
        res.status(200).json('User created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
};

export default UserController;