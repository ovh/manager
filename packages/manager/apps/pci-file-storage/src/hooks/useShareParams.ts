import { useParams, useSearchParams } from 'react-router-dom';

export type TShareParams = {
  region: string;
  shareId: string;
};

export const useShareParams = (): TShareParams => {
  const { region: paramRegion, shareId: shareIdParam } = useParams<{
    region: string;
    shareId: string;
  }>();

  const [searchParams] = useSearchParams();

  const shareId = shareIdParam ?? searchParams.get('shareId');
  const region = paramRegion ?? searchParams.get('region');

  if (!region || !shareId) {
    throw new Error('Missing region or shareId');
  }

  return { region, shareId };
};
