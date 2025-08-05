import { useParams } from 'react-router-dom';

export const useSafeParam = (param: string): string => {
  const params = useParams();

  const value = params[param];
  if (!value) throw new Error(`Missing parameter ${param}`);

  return value;
};
