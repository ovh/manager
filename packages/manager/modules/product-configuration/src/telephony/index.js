import i18next from 'i18next';
import loadTranslations from '../i18n-utils';

/* translationsInject 'telephony' */

const getConfig = () =>
  loadTranslations('telephony').then(() => {
    return {
      data: [
        {
          label: i18next.t('telephony:telephony_billing_account_label'),
          property: 'billingAccount',
          serviceLink: true,
        },
        {
          label: i18next.t('telephony:telephony_description_label'),
          property: 'description',
        },
        {
          label: i18next.t('telephony:telephony_num_service_label'),
          property: 'numServices',
          type: 'number',
        },
        {
          label: i18next.t('telephony:telephony_current_outplan_label'),
          property: 'currentOutplan.value',
          type: 'number',
          format: (value) => value.currentOutplan.text,
        },
        {
          label: i18next.t('telephony:telephony_security_deposit_label'),
          property: 'securityDeposit.value',
          type: 'number',
          format: (value) => value.securityDeposit.text,
        },
        {
          label: i18next.t('telephony:telephony_status_label'),
          property: 'status',
          format: (value) =>
            i18next.t(`telephony:telephony_status_label_${value.status}`),
          map: (value) => (value.status === 'enabled' ? 'success' : 'error'),
        },
      ],
    };
  });

export default {
  getConfig,
};
