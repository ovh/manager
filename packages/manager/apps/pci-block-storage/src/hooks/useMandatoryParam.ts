import { useParams } from 'react-router-dom';

export const useMandatoryParam = (paramName: string): string => {
  const params = useParams();
  const requiredParam = params[paramName];

  if (!requiredParam) {
    throw new Error(`Missing params ${paramName}`);
  }

  return requiredParam;
};
