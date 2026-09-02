const { z } = require('zod');

// Schema de validação para Cadastro de Usuário (com conformidade LGPD)
const registerSchema = z.object({
  fullName: z
    .string({ required_error: 'Nome completo é obrigatório.' })
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .max(100, 'O nome não pode ultrapassar 100 caracteres.')
    .trim(),

  email: z
    .string({ required_error: 'E-mail é obrigatório.' })
    .email('Formato de e-mail inválido.')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(6, 'A senha deve conter pelo menos 6 caracteres.')
    .max(100, 'A senha não pode ultrapassar 100 caracteres.'),

  birthDate: z
    .string()
    .optional()
    .nullable(),

  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000-000 ou conter 8 dígitos.')
    .optional()
    .nullable()
    .or(z.literal('')),

  // Exigência estrita da LGPD: consentimento explícito aos Termos de Uso
  lgpdConsent: z
    .boolean({ required_error: 'O consentimento dos Termos e LGPD é obrigatório.' })
    .refine((val) => val === true, {
      message: 'Você deve aceitar os Termos de Uso e Política de Privacidade para prosseguir.',
    }),

  termsVersion: z.string().optional().default('1.0'),
});

// Schema de validação para Login
const loginSchema = z.object({
  email: z
    .string({ required_error: 'E-mail é obrigatório.' })
    .email('Formato de e-mail inválido.')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(1, 'A senha é obrigatória.'),
});

// Schema para Renovação de Token
const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh Token é obrigatório.' })
    .min(10, 'Refresh Token inválido.'),
});

/**
 * Função geradora de middleware que valida o corpo (req.body) com o schema Zod
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Formata os erros do Zod de forma amigável e legível
      const errorMessages = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Dados inválidos enviados na requisição.',
        details: errorMessages,
      });
    }

    // Substitui req.body pelos dados sanitizados pelo Zod
    req.body = result.data;
    next();
  };
}

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  refreshSchema,
};
