import find from 'lodash/find';
import startCase from 'lodash/startCase';

import { SANITIZATION, FEATURES } from './constants';

import signupFormComponent from './form/component';
import {
  BUTTON_TRACKING_PREFIX,
  CHAPTER_1,
  DISPLAY_ROOT_PAGE_TRACKING,
  ERROR_TRACKING_PREFIX,
} from './at-internet.constants';

export const state = {
  name: 'sign-up',
  url: '/?lang&ovhSubsidiary&ovhCompany&callback&onsuccess',
  component: signupFormComponent.name,
  resolve: {
    queryParams: /* @ngInject */ ($location) => $location.search(),
    callback: /* @ngInject */ (queryParams) => queryParams.callback,
    onsuccess: /* @ngInject */ (queryParams) => queryParams.onsuccess,
    getRedirectLocation: /* @ngInject */ (callback, onsuccess) => (nic) => {
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

      return `${window.location.origin}/`;
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

    cancelStep: /* @ngInject */ (ssoAuthentication, onsuccess) => () => {
      ssoAuthentication.logout(onsuccess);
    },

    featureAvailability: /* @ngInject */ ($http) => {
      return $http.get(
        `/feature/identity-documents,account-creation/availability`,
        {
          serviceType: 'aapi',
        },
      );
    },

    isKycFeatureAvailable: /* @ngInject */ (featureAvailability) =>
      featureAvailability.data['identity-documents'],

    isNewAccountCreateAvailable: /* @ngInject */ (featureAvailability) =>
      featureAvailability.data['account-creation'],

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
        if (stepName === 'details' && isActiveStep('activity')) {
          const trackingHits = [
            BUTTON_TRACKING_PREFIX,
            'create_account_step4',
            'edit-step3',
            `${me.model.legalform}_${me.ovhSubsidiary}`,
          ];
          atInternet.trackClick({
            name: trackingHits.join('::'),
            page_category: CHAPTER_1,
            page: {
              name: DISPLAY_ROOT_PAGE_TRACKING,
            },
            type: 'action',
          });
        }
        if (stepName === 'activity') {
          const trackingHits = [
            BUTTON_TRACKING_PREFIX,
            'create_account_step3',
            'next',
            `${me.model.legalform}_${me.ovhSubsidiary}`,
          ];
          atInternet.trackClick({
            name: trackingHits.join('::'),
            page_category: CHAPTER_1,
            page: {
              name: DISPLAY_ROOT_PAGE_TRACKING,
            },
            type: 'action',
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
    trackError: /* @ngInject */ (atInternet) => (field) => {
      const errorTrackingHits = [ERROR_TRACKING_PREFIX, `error_${field}`];
      atInternet.trackPage({
        name: errorTrackingHits.join('::'),
        page_category: 'banner',
      });
    },
    onFieldBlur: /* @ngInject */ (trackError) => (field) => {
      if (field.$invalid) {
        trackError(startCase(field.$name).replaceAll(' ', ''));
      }
    },

    subsidiary: /* @ngInject */ ($location, coreConfig) =>
      $location.search().ovhSubsidiary || coreConfig.getUser().ovhSubsidiary,
  },
  onEnter: /* @ngInject */ (
    $window,
    isNewAccountCreateAvailable,
    coreURLBuilder,
    onsuccess,
  ) => {
    if (isNewAccountCreateAvailable) {
      const url = coreURLBuilder.buildURL('account-creation', '/#/');
      $window.location.assign(
        `${url}?onsuccess=${encodeURIComponent(onsuccess)}`,
      );
    }
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
