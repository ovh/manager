import apiClient from '@/api/client';

export type FeaturesAvailability = {
  [key: string]: boolean;
}

/**
 * Call feature availability 2API in order to detect availability for a feature
 * or a set of features.
 *
 * @param  {String|Array} featureNameOrFeaturesList The name of the feature or a list of
 *                                                  feature names.
 *
 * @return {Promise}  Which returns an object representing features availabilities.
 */
export async function checkFeaturesAvailability(features: string[], applicationName: string): Promise<FeaturesAvailability> {
  if (features.length === 0) {
    return Promise.resolve({});
  }

  const response = await apiClient.aapi.get(
    `/feature/${features.join(',')}/availability?app=${applicationName}`,
    {
      data: {
         serviceType: 'aapi'
      },
      params: {
        app: applicationName,
      },
    },
  );
  return response.data;
 }

export async function checkFeatureAvailability(featureName: string, applicationName: string): Promise<boolean> {
  const res = await checkFeaturesAvailability([featureName], applicationName);
  return res[featureName];
}
