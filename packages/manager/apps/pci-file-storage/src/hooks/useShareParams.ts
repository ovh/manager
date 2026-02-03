import { useParams } from 'react-router-dom';

export type TShareParams = {
  region: string;
  shareId: string;
};

export const useShareParams = (): TShareParams => {
  const { region, shareId } = useParams<{ region: string; shareId: string }>();

  if (!region || !shareId) {
    throw new Error('Missing region or shareId');
  }

  return { region, shareId };
};
