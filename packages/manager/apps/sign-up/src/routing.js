import find from 'lodash/find';

import { SANITIZATION, FEATURES } from './constants';

import signupFormComponent from './form/component';

export const state = {
  name: 'sign-up',
  url: '/?lang&ovhSubsidiary&ovhCompany&callback&onsuccess',
  component: signupFormComponent.name,
  resolve: {
    getRedirectLocation: /* @ngInject */ ($location) => (nic) => {
      const { callback, onsuccess } = $location.search();

      if (
        callback &&
        SANITIZATION.regex.test(window.location.href) &&
        !SANITIZATION.regex.test(callback)
      ) {
        return null;
      }

      const accountParam = encodeURIComponent(nic);

      // use callback for redirection if provided
      if (callback) {
        return `${callback}${
          /\?/.test(callback) ? '&' : '?'
        }account=${accountParam}&ovhSessionSuccess=true`;
      }

      // redirect to login page on success
      if (
        onsuccess &&
        (!SANITIZATION.regex.test(window.location.href) ||
          SANITIZATION.regex.test(onsuccess))
      ) {
        return `${onsuccess}${
          /\?/.test(onsuccess) ? '&' : '?'
        }ovhSessionSuccess=true`;
      }

      return '/auth/?action=gotomanager';
    },

    getStepByName: /* @ngInject */ (steps) => (name) =>
      find(steps, {
        name,
      }),

    isActiveStep: /* @ngInject */ ($state, getStepByName) => (name) => {
      const step = getStepByName(name);
      return $state.is(step.state);
    },

    me: /* @ngInject */ (ssoAuthentication) =>
      ssoAuthentication
        .getSsoAuthPendingPromise()
        .then(() => ssoAuthentication.user),

    cancelStep: /* @ngInject */ ($location, ssoAuthentication) => () => {
      ssoAuthentication.logout($location.search().onsuccess);
    },

    isKycFeatureAvailable: /* @ngInject */ ($http) => {
      return $http
        .get(`/feature/identity-documents/availability`, {
          serviceType: 'aapi',
        })
        .then(
          ({ data: featureAvailability }) =>
            featureAvailability['identity-documents'],
        );
    },

    kycStatus: /* @ngInject */ ($http, isKycFeatureAvailable) => {
      if (isKycFeatureAvailable) {
        return $http.get(`/me/procedure/identity`).then(({ data }) => data);
      }
      return false;
    },

    needkyc: /* @ngInject */ (isKycFeatureAvailable, kycStatus) => {
      if (isKycFeatureAvailable) {
        return ['required', 'open'].includes(kycStatus.status);
      }
      return false;
    },

    goToKycDocumentUploadPage: /* @ngInject */ (
      $window,
      coreURLBuilder,
    ) => () => {
      // eslint-disable-next-line no-param-reassign
      $window.location.href = coreURLBuilder.buildURL(
        'dedicated',
        '#/identity-documents',
      );
    },
    onStepFocus: /* @ngInject */ ($state, getStepByName) => (stepName) => {
      const focusedStep = getStepByName(stepName);
      if ($state.current.name !== focusedStep.state) {
        $state.transitionTo(focusedStep.state, $state.params, {
          location: false,
        });
      }
    },

    isSmsConsentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
      ovhFeatureFlipping
        .checkFeatureAvailability(FEATURES.smsConsent)
        .then((featureAvailability) =>
          featureAvailability.isFeatureAvailable(FEATURES.smsConsent),
        ),

    finishSignUp: /* @ngInject */ (
      $window,
      $q,
      getRedirectLocation,
      me,
      signUp,
      isSmsConsentAvailable,
    ) => (smsConsent) =>
      signUp.saveNic(me.model).then(() => {
        const promise = isSmsConsentAvailable
          ? signUp.sendSmsConsent(smsConsent)
          : $q.resolve();
        return promise.then(() => {
          // for tracking purposes
          if ($window.sessionStorage) {
            $window.sessionStorage.setItem('ovhSessionSuccess', true);
          }
          // manage redirection
          const redirectUrl = getRedirectLocation(me.nichandle);
          if (redirectUrl) {
            $window.location.assign(redirectUrl);
          }
        });
      }),

    steps: () => [
      {
        name: 'identity',
        state: 'sign-up.identity',
      },
      {
        name: 'details',
        state: 'sign-up.details',
      },
      {
        name: 'activity',
        state: 'sign-up.activity',
      },
    ],
    trackError: /* @ngInject */ (atInternet, me) => (step, field) => {
      atInternet.trackPage({
        name: `accountcreation-${step}-error${field}-${me.legalform}`,
        customObject: { event: 'ACCOUNT_CREATION_VALIDATION' },
      });
    },

    subsidiary: /* @ngInject */ ($location, coreConfig) =>
      $location.search().ovhSubsidiary || coreConfig.getUser().ovhSubsidiary,
  },
  atInternet: {
    ignore: true,
  },
};

export const registerState = /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(state.name, state);
};

export default {
  registerState,
  state,
};
