import get from 'lodash/get';
import snakeCase from 'lodash/snakeCase';

import EnvironmentService from '@ovh-ux/manager-config';

import { PCI_REDIRECT_URLS } from '../constants';
import {
  IMAGE_ASSETS,
  PAY_DEBT_URL,
} from './error.constants';


export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.error', {
      url: '/error',
      component: 'pciProjectError',
      params: {
        code: {
          type: 'any',
        },
        context: {
          type: 'any',
        },
        message: {
          type: 'any',
        },
      },
      resolve: {
        breadcrumb: () => null,
        error: /* @ngInject */ ($transition$) => {
          const stateParams = $transition$.params();
          return {
            code: snakeCase(stateParams.code),
            context: stateParams.context,
            message: stateParams.message,
          };
        },
        getActionButtonHref: () => (errorCode) => {
          switch (errorCode) {
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
        getActionButtonText: /* @ngInject */ $translate => (errorCode) => {
          switch (errorCode) {
            case 'unpaid_debts':
              return $translate.instant('pci_error_button_action_pay_debt');
            case 'max_projects_limit_reached':
            case 'account_not_eligible':
              return $translate.instant('pci_error_button_action_contact_support');
            default:
              return '';
          }
        },
        getAssets: () => (errorCode, srcset) => {
          const errorCodeAssets = get(IMAGE_ASSETS, errorCode);

          if (errorCodeAssets) {
            return srcset
              ? `${get(errorCodeAssets, '2x')} 2x, ${get(errorCodeAssets, '3x')} 3x`
              : get(errorCodeAssets, 'src');
          }

          return srcset
            ? `${get(IMAGE_ASSETS, 'oops.2x')} 2x, ${get(IMAGE_ASSETS, 'oops.3x')} 3x`
            : get(IMAGE_ASSETS, 'oops.src');
        },
        getCancelHref: /* @ngInject */ $state => () => $state.href('pci'),
        getErrorTranslationValues: () => (errorCode) => {
          switch (errorCode) {
            case 'invalid_payment_mean':
            case 'paypal_account_not_verified':
              return {
                href: get(
                  PCI_REDIRECT_URLS,
                  `${EnvironmentService.Environment.region}.paymentMethods`,
                ),
              };
            default:
              return {};
          }
        },
      },
    });
};
