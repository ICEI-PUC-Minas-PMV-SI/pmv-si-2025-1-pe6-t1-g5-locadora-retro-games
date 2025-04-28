import DashboardService from './dashboard.service.js';

const DashboardController = {};

DashboardController.getSummary = async (req, res) => {
  try {
    const summary = await DashboardService.getSummary();
    res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar dados do dashboard' });
  }
};

export default DashboardController;
