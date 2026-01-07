import { LocationPathParams } from '@/routes/Routes.constants';

export interface TagsTileProps extends LocationPathParams {
  title: string;
  tags: { [key: string]: string };
  isLoading?: boolean;
}
