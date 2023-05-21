import { env } from './env';

export const environment = {
  production: true,
  apiHost: env.prod.apiHost,
};
