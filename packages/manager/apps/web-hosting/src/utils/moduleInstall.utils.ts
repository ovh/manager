import { z } from 'zod';

const MODULE_ADMIN_NAME_REGEX = /^[a-zA-Z0-9._-]+$/;

const baseModulePasswordSchema = z
  .string()
  .max(31)
  .regex(/[A-Z]/)
  .regex(/[a-z]/)
  .regex(/[0-9]/)
  .regex(/^[a-zA-Z0-9]+$/);

/** Database password: 8 to 31 alphanumeric characters */
export const moduleDbPasswordSchema = baseModulePasswordSchema.min(8);

/** Administrator password: 12 to 31 alphanumeric characters */
export const moduleAdminPasswordSchema = baseModulePasswordSchema.min(12);

/** Administrator name: alphanumeric characters plus '.', '_' and '-' (back-end constraint) */
export const moduleAdminNameSchema = z.string().min(1).regex(MODULE_ADMIN_NAME_REGEX);

export type ModuleInstallRule = { key: string; valid: boolean };

export const getModuleDbPasswordRules = (password: string, minLength = 8): ModuleInstallRule[] => [
  {
    key: minLength === 12 ? 'hint_length_admin' : 'hint_length',
    valid: password.length >= minLength && password.length <= 31,
  },
  { key: 'hint_uppercase', valid: /[A-Z]/.test(password) },
  { key: 'hint_lowercase', valid: /[a-z]/.test(password) },
  { key: 'hint_digit', valid: /[0-9]/.test(password) },
  { key: 'hint_alphanumeric', valid: password.length > 0 && /^[a-zA-Z0-9]+$/.test(password) },
];

export const getModuleAdminNameRules = (name: string): ModuleInstallRule[] => [
  { key: 'hint_admin_name_required', valid: name.trim().length > 0 },
  {
    key: 'hint_admin_name_allowed',
    valid: name.length > 0 && MODULE_ADMIN_NAME_REGEX.test(name),
  },
];
