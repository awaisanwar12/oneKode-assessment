// This file needs to be included in your tsconfig or via types definition
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
