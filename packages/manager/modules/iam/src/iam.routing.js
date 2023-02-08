import resolve from './iam.routing.resolve';
import template from './iam.template.html';

export default /* @ngInject */ ($stateProvider, IAM) => {
  const unavailableState = {
    state: IAM.UNAVAILABLE_STATE_NAME,
  };

  $stateProvider.state(IAM.STATE.ROOT.NAME, {
    url: IAM.STATE.ROOT.URL,
    template,
    resolve,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('features')
        .then((features) =>
          features?.isFeatureAvailable(IAM.FEATURE.MAIN)
            ? false
            : unavailableState,
        )
        .catch(() => unavailableState),
  });
};
