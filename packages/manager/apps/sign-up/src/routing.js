import find from 'lodash/find';

import { SANITIZATION, FEATURES } from './constants';

import signupFormComponent from './form/component';
import { TRACKING_DETAILS } from './at-internet.constants';

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
    onStepFocus: /* @ngInject */ (
      $state,
      atInternet,
      getStepByName,
      isActiveStep,
      me,
    ) => (stepName) => {
      const focusedStep = getStepByName(stepName);
      if ($state.current.name !== focusedStep.state) {
        const { chapter1, chapter2, chapter3 } = TRACKING_DETAILS;
        const trackingHits = [chapter1, chapter2, chapter3, 'page', 'button'];
        if (stepName === 'details' && isActiveStep('activity')) {
          const additionalHits = [
            'create_account_step4',
            'edit-step3',
            `${me.model.legalform}_${me.ovhSubsidiary}`,
          ];
          trackingHits.push(...additionalHits);
          atInternet.trackPage({
            name: trackingHits.join('::'),
            page_category: chapter1,
          });
        }
        if (stepName === 'activity') {
          const additionalHits = [
            'create_account_step3',
            'next',
            `${me.model.legalform}_${me.ovhSubsidiary}`,
          ];
          trackingHits.push(...additionalHits);
          atInternet.trackPage({
            name: trackingHits.join('::'),
            page_category: chapter1,
          });
        }
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
    trackError: /* @ngInject */ (atInternet) => (step, field) => {
      const { chapter1, chapter2, chapter3 } = TRACKING_DETAILS;
      const errorTrackingHits = [
        chapter1,
        chapter2,
        chapter3,
        'create_account_step',
        'banner-error',
        `error_${field}`,
      ];
      atInternet.trackPage({
        name: errorTrackingHits.join('::'),
        page_category: 'banner',
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
