import {
  UndefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { User } from '@ovh-ux/manager-config';
import { getMe } from '@/data/api/me';

export const useMe = (
  options: Omit<
    UndefinedInitialDataOptions<User, ApiError>,
    'queryKey' | 'queryFn'
  > = {},
): UseQueryResult<User, ApiError> =>
  useQuery({
    queryKey: [`me`],
    queryFn: getMe,
    ...options,
  });
