import { User } from '@/types/user.type';

// const token = ???;
// const user = decodeJWT(token);
export const getCurrentUser = (): User => ({
  legalform: 'other',
  email: 'monsieur.madame@ovhcloud.com',
  language: 'fr_FR',
  subsidiary: 'FR',
});
