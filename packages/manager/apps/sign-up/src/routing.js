import find from 'lodash/find';

import signupFormComponent from './form/component';

export const state = {
  name: 'sign-up',
  url: '/',
  component: signupFormComponent.name,
  resolve: {
    // creationRules: /* @ngInject */ (signUp) => signUp.initDeferred.promise,
    // getCurrentStepIndex: /* @ngInject */ ($state) => () => find()
    getStepByName: /* @ngInject */ steps => name => find(steps, {
      name,
    }),
    isActiveStep: /* @ngInject */ ($state, getStepByName) => (name) => {
      const step = getStepByName(name);
      return $state.is(step.state);
    },
    me: /* @ngInject */ ssoAuthentication => ssoAuthentication
      .getSsoAuthPendingPromise()
      .then(() => ssoAuthentication.user),
    onStepFocus: /* @ngInject */ ($state, getStepByName) => (stepName) => {
      const focusedStep = getStepByName(stepName);
      if ($state.current.name !== focusedStep.state) {
        $state.transitionTo(focusedStep.state, {}, {
          location: false,
        });
      }
    },
    onStepSubmit: () => () => {
    },
    steps: () => [{
      name: 'identity',
      state: 'sign-up.identity',
    }, {
      name: 'details',
      state: 'sign-up.details',
    }, {
      name: 'activity',
      state: 'sign-up.activity',
    }],
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
