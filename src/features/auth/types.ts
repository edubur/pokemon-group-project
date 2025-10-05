export type RegisterFormState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    username?: string[];
    _form?: string[];
  };
};

export type LoginFormState = {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};
