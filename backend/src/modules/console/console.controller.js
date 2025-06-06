import ConsoleService from "./console.service.js";

const ConsoleController = {};

// get, post, put, patch, etc ...
ConsoleController.getConsole = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const field = req.query?.field || "name";
    const order = req.query?.order || "asc";
    const search = req.query?.search;
    const { consoles, total, consoleWithMoreGames } = await ConsoleService.list(
      limit,
      offset,
      field,
      order,
      search
    );
    res.status(200).json({
      consoles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      consoleWithMoreGames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

ConsoleController.insertConsole = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
    };
    await ConsoleService.create(body);
    res.status(200).json("Console created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};
ConsoleController.updateConsole = async (req, res) => {
  try {
    const body = {
      id: Number(req.params.id),
      name: req.body.name,
    };
    await ConsoleService.update(body);
    res.status(200).json("Console updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

ConsoleController.deleteConsole = async (req, res) => {
  try {
    const body = {
      id: Number(req.params.id),
    };
    await ConsoleService.delete(body);
    res.status(200).json("Console deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

export default ConsoleController;
