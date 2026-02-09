import { useParams } from 'react-router-dom';

export const useParam = (paramName: string): string => {
  const { [paramName]: param } = useParams();

  if (!param) {
    throw new Error(`Missing URL parameter : ${paramName}`);
  }

  return param;
};
