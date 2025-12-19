import { Procedures } from '@/types/procedure.type';

export const PROCEDURE_API_PATH_MAP = {
  [Procedures.DIABLE_2FA]: '2FA',
  [Procedures.INDIA]: 'identity',
  [Procedures.FRAUD]: 'fraud',
  [Procedures.GDPR]: 'gdpr',
};
