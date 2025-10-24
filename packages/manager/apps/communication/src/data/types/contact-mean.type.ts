export enum ContactMeanType {
  EMAIL = 'EMAIL',
  // PHONE = 'PHONE',
}
export type ContactMeanStatus = 'DISABLED' | 'ERROR' | 'VALID' | 'TO_VALIDATE';
export type ContactMeanTaskStatus =
  | 'ERROR'
  | 'PENDING'
  | 'RUNNING'
  | 'SCHEDULED'
  | 'WAITING_USER_INPUT';

export type ContactMeanTask = {
  id: string;
  link: string;
  status: ContactMeanTaskStatus | null;
  type: string;
};

export type ContactMean = {
  createdAt: string;
  currentTasks: ContactMeanTask[];
  default: boolean;
  description: string | null;
  email: string | null;
  error: string | null;
  id: string;
  status: ContactMeanStatus;
  type: ContactMeanType;
};

// currently only email is supported
export type CreateContactMean = {
  description: string | null;
  email: string;
  type: ContactMeanType;
};

export type UpdateContactMean = {
  description: string | null;
  status: ContactMeanStatus;
};

export type ValidateContactMean = {
  otp: string;
};
