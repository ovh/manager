import { z } from 'zod';

export const taskMeDomain = ['me', 'task', 'domain'];
export const taskMeDns = ['me', 'task', 'dns'];

export const domainCreate = 'DomainCreate';
export const domainIncomingTransfer = 'DomainIncomingTransfer';
export const domainResourceDelete = 'DomainResourceDelete';

export const editableArgument: Record<string, z.ZodString> = {
  authInfo: z
    .string()
    .min(5)
    .max(50),
  legitimacyAfnic: z.string(),
  processId: z
    .string()
    .min(5)
    .max(20),
  NIF: z.string().min(5),
  ownerLegalName: z.string(),
  identificationNumber: z.string().min(5),
  firstname: z.string(),
  name: z.string(),
  action: z.string(),
  memberContactXXX: z.string(),
  ukLegalForm: z.string(),
  UIN: z.string(),
  validationToken: z.string(),
  default: z.string(),
};
