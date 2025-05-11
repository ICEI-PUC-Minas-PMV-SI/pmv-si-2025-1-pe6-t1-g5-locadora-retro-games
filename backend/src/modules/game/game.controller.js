import GameService from "./game.service.js";

const GameController = {};

// get, post, put, patch, etc ...
GameController.getGame = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const field = req.query?.field || "name";
    const order = req.query?.order || "asc";
    const search = req.query?.search;
    const { games, total, gameWithMoreOrders } = await GameService.list(
      limit,
      offset,
      field,
      order,
      search
    );
    res.status(200).json({
      games,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      gameWithMoreOrders,
    });
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
      amount: req.body.amount,
      console: req.body.consoleId,
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
      amount: req.body.amount,
      description: req.body.description,
      console: req.body.consoleId,
    };
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
