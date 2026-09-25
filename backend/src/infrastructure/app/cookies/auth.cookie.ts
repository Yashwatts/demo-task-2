import { Response } from 'express';

export const setCookie = (res: Response, token: string): void => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const clearCookie = (res: Response): void => {
  res.clearCookie('token');
};
