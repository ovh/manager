import find from 'lodash/find';

import { SANITIZATION } from './constants';

import signupFormComponent from './form/component';

export const state = {
  name: 'sign-up',
  url: '/?lang&ovhSubsidiary&ovhCompany&callback&onsuccess',
  component: signupFormComponent.name,
  resolve: {
    getRedirectLocation: /* @ngInject */ $location => (nic) => {
      const { callback, onsuccess } = $location.search();

      if (callback && !SANITIZATION.regex.test(callback)) {
        return null;
      }

      const accountParam = encodeURIComponent(nic);

      // use callback for redirection if provided
      if (callback) {
        return `${callback}${/\?/.test(callback) ? '&' : '?'}account=${accountParam}`;
      }


      // redirect to login page on success
      if (onsuccess && SANITIZATION.regex.test(onsuccess)) {
        return onsuccess;
      }

      return '/auth/?action=gotomanager';
    },

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
    onStepCancel: /* @ngInject */ ($location, ssoAuthentication) => () => {
      ssoAuthentication.logout($location.search().onsuccess);
    },

    onStepFocus: /* @ngInject */ ($state, getStepByName) => (stepName) => {
      const focusedStep = getStepByName(stepName);
      if ($state.current.name !== focusedStep.state) {
        $state.transitionTo(focusedStep.state, $state.params, {
          location: false,
        });
      }
    },

    finishSignUp: /* @ngInject */ ($window, getRedirectLocation, me, signUp) => () => signUp
      .saveNic(me.model)
      .then(() => {
        // for tracking purposes
        if ($window.sessionStorage) {
          $window.sessionStorage.setItem('ovhSessionSuccess', true);
        }
        // manage redirection
        const redirectUrl = getRedirectLocation(me.nichandle);
        if (redirectUrl) {
          $window.location.assign(redirectUrl);
        }
      }),

    postParams: /* @ngInject */ signUp => signUp.getCreationRulesParams(),

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
