import ConsoleService from "./console.service.js";

const ConsoleController = {};

// get, post, put, patch, etc ...
ConsoleController.getConsole = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const { consoles, total } = await ConsoleService.list(limit, offset);
    res.status(200).json({
      consoles,
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

ConsoleController.insertConsole = async (req, res) => {
  try {
    const body = {
      name: req.body.name

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
      name: req.body.name
    };
    await ConsoleService.update(body);
    res.status(200).json("Console updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};


ConsoleController.updateConsole = async (req, res) => {
    try {
      const body = {
        id: Number(req.params.id),
        name: req.body.name
      };
      console.log(req.body);
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
