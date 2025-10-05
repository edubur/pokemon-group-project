export type ProfilePictureFormState = {
  success: boolean;
  message: string | null;
  url?: string;
};

export type FormState = {
  error?: string;
  success?: boolean;
  url?: string;
};
