import GameService from "./game.service.js";

const GameController = {};

// get, post, put, patch, etc ...
GameController.getGame = async (req, res) => {
  try {
    const data = await GameService.list();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

GameController.insertGame = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      console: req.body.console
    };
    await GameService.create(body);
    res.status(200).json("Game created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};
GameController.updateGame = async (req, res) => {
  try {
    const body = {
      id: Number(req.params.id),
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      console: req.body.console

    };
    console.log(req.body);
    await GameService.update(body);
    res.status(200).json("Game updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};


GameController.updateGame = async (req, res) => {
    try {
      const body = {
        id: Number(req.params.id),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        console: req.body.console
      };
      console.log(req.body);
      await GameService.update(body);
      res.status(200).json("Game updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal server error");
    }
  };
  
GameController.deleteGame = async (req, res) => {
  try {
    const body = {
      id: Number(req.params.id),
    };
    await GameService.delete(body);
    res.status(200).json("Game deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

export default GameController;
