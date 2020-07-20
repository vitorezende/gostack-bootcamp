import { Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

// SoC: Separation of Concerns (Separação de Preocupação)
// A Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  // Chamando serviço de autenticação de usuário
  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  // Caso tenha autenticado retorna o usuário e o token
  return response.json({ user, token });
});

export default sessionsRouter;
