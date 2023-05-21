import { env } from './env';

export const environment = {
  production: false,
  apiHost: env.dev.apiHost,
};
