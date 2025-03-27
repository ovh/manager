import apiClient from '@ovh-ux/manager-core-api';

export type FeatureAvailabilityQueryParams = Partial<{
  app: string;
}>;

export type FeatureAvailabilityResponse<T extends string = string> = {
  [Key in T]?: boolean;
} & {
  /* @deprecated */
  feature: string;
  /* @deprecated */
  result: boolean;
};

export const getFeatureAvailability = <T extends string = string>(
  features: T[],
  params?: FeatureAvailabilityQueryParams,
) =>
  apiClient.aapi.get<FeatureAvailabilityResponse<T>>(
    `/feature/${features.join(',')}/availability`,
    {
      params,
    },
  );
