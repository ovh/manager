import { ApiError } from '@ovh-ux/manager-core-api';
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type RestrictedQueryOptions<T> = Omit<
  UseQueryOptions<T, Error>,
  'queryKey' | 'queryFn'
>;

export type RestrictedMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables, unknown>,
  'mutationFn'
>;
