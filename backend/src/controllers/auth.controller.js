const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const clientInfo = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'Mobile App',
      };

      const result = await authService.register(req.body, clientInfo);

      return res.status(201).json({
        success: true,
        message: 'Conta criada com sucesso!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const clientInfo = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'Mobile App',
      };

      const result = await authService.login(email, password, clientInfo);

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const clientInfo = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'Mobile App',
      };

      const result = await authService.refresh(refreshToken, clientInfo);

      return res.status(200).json({
        success: true,
        message: 'Sessão renovada com sucesso!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user ? req.user.id : null;

      const result = await authService.logout(refreshToken, userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
