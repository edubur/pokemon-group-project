// Register form state type for server actions
export type RegisterFormState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    username?: string[];
    _form?: string[];
  };
};
import { z } from "zod";
// Login form state type for server actions
export type LoginFormState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};
