import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import snakeCase from 'lodash/snakeCase';

import EnvironmentService from '@ovh-ux/manager-config';

import { PCI_REDIRECT_URLS } from '../../../constants';
import { IMAGE_ASSETS, PAY_DEBT_URL } from './error.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.new.error', {
    url: '/error',
    views: {
      '@pci': {
        component: 'managerErrorPage',
      },
    },
    params: {
      code: {
        type: 'any',
      },
      context: {
        type: 'any',
      },
      detail: null,
      message: {
        type: 'any',
      },
    },
    resolve: {
      breadcrumb: () => null,
      cancelLink: /* @ngInject */ ($state) => $state.href('pci'),
      error: /* @ngInject */ ($transition$, atInternet) => {
        const page = `public-cloud::${$transition$
          .to()
          .name.replace(/\./g, '::')}`;
        const stateParams = $transition$.params();
        const error = {
          ...stateParams,
          code: snakeCase(stateParams.code),
        };

        atInternet.trackEvent({
          page,
          event: `PCI_ERROR_${
            !isEmpty(error.code) ? error.code.toUpperCase() : 'UNKNOWN'
          }`,
        });
        return error;
      },
      image: /* @ngInject */ (error) => {
        const errorCodeAssets = get(IMAGE_ASSETS, error.code);

        if (errorCodeAssets) {
          return get(errorCodeAssets, 'src');
        }

        return get(IMAGE_ASSETS, 'oops.src');
      },
      message: /* @ngInject */ ($translate, error) => {
        switch (error.code) {
          case 'invalid_payment_mean':
          case 'paypal_account_not_verified':
            return $translate.instant(`pci_error_${error.code}`, {
              href: get(
                PCI_REDIRECT_URLS,
                `${EnvironmentService.Environment.region}.paymentMethods`,
              ),
            });
          default:
            return null;
        }
      },
      submitLabel: /* @ngInject */ ($translate, error) => {
        switch (error.code) {
          case 'unpaid_debts':
            return $translate.instant('pci_error_button_action_pay_debt');
          case 'max_projects_limit_reached':
          case 'account_not_eligible':
            return $translate.instant(
              'pci_error_button_action_contact_support',
            );
          default:
            return null;
        }
      },
      submitLink: /* @ngInject */ (error) => {
        switch (error.code) {
          case 'unpaid_debts':
            return get(
              PAY_DEBT_URL,
              `${EnvironmentService.Environment.region}`,
            );
          case 'max_projects_limit_reached':
          case 'account_not_eligible':
            return get(
              PCI_REDIRECT_URLS,
              `${EnvironmentService.Environment.region}.support`,
            );
          default:
            return '';
        }
      },
    },
  });
};
