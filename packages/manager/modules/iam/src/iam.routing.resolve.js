export const features = /* @ngInject */ (ovhFeatureFlipping, IAM) =>
  ovhFeatureFlipping
    .checkFeatureAvailability(Object.values(IAM.FEATURE))
    .catch(() => null);

export default {
  features,
};
