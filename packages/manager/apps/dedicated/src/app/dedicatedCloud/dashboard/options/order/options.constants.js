import { step as requiredConfiguration } from './steps/requiredConfiguration';
import { step as selection } from './steps/selection';
import { step as smsActivation } from './steps/smsActivation';
import { step as summary } from './steps/summary';

export const ACTIVATION_TYPES = {
  basic: [
    selection,
  ],
  certification: [
    selection,
    requiredConfiguration,
    smsActivation,
    summary,
  ],
};

ACTIVATION_TYPES.all = _.uniq(
  _.flatten(
    _.values(ACTIVATION_TYPES),
  ).map(step => step.moduleName),
);

export default {
  ACTIVATION_TYPES,
};
