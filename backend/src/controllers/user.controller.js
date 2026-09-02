const userService = require('../services/user.service');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async exportData(req, res, next) {
    try {
      const clientInfo = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'Mobile App',
      };
      const report = await userService.exportMyData(req.user.id, clientInfo);
      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const clientInfo = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'Mobile App',
      };
      const result = await userService.deleteAccount(req.user.id, clientInfo);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
