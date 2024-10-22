import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getBanner } from '@/data/api/banner';
import { Banner } from '@/types/banner.type';

export const useFetchHubBanner = (locale: string) =>
  useQuery<Banner, AxiosError>({
    queryKey: ['getHubBanner'],
    queryFn: () => getBanner(locale),
    retry: 0,
  });
