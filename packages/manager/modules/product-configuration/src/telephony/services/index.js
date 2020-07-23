import i18next from 'i18next';
import loadTranslations from '../../i18n-utils';

/* translationsInject 'telephony_services' */

const getConfig = () =>
  loadTranslations('telephony_services').then(() => {
    return {
      data: [
        {
          label: i18next.t(
            'telephony_services:telephony_billing_account_line_number',
          ),
          property: 'serviceName',
          serviceLink: true,
        },
        {
          label: i18next.t(
            'telephony_services:telephony_billing_account_services_description_title',
          ),
          property: 'description',
          format: (value) =>
            value.serviceName === value.description ? '' : value.description,
        },
        {
          label: i18next.t(
            'telephony_services:telephony_billing_account_line_service',
          ),
          property: 'serviceType',
          format: (value) =>
            i18next.t(
              `telephony_services:telephony_billing_account_line_service_${value.serviceType}`,
            ),
        },
        {
          label: i18next.t(
            'telephony_services:telephony_billing_account_line_feature',
          ),
          property: 'featureType',
          format: (value) =>
            ['empty'].includes(value.featureType)
              ? i18next.t(
                  'telephony_services:telephony_billing_account_line_feature_no_configuration',
                )
              : value.featureType,
        },
      ],
    };
  });

export default {
  getConfig,
};
