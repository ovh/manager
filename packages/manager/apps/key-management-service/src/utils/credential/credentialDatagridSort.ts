import { OkmsCredential } from '@/types/okmsCredential.type';

export const sortCredentials = (key: keyof OkmsCredential) => (
  a: OkmsCredential,
  b: OkmsCredential,
) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return (aValue as string).localeCompare(bValue as string);
};
