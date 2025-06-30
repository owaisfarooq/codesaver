import { User } from '../src/User';

declare module 'express-serve-static-core' {
  interface Request {
    metadata: {
      user?: User;
    };
  }
}