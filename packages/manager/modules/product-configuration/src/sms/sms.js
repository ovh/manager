import i18next from 'i18next';
import loadTranslations from '../i18n-utils';

/* translationsInject 'sms' */

const getConfig = () =>
  loadTranslations('sms').then(() => {
    return {
      data: [
        {
          label: i18next.t('sms:sms_name_label'),
          property: 'name',
          serviceLink: true,
        },
        {
          label: i18next.t('sms:sms_name_description'),
          property: 'description',
        },
        {
          label: i18next.t('sms:sms_status'),
          property: 'status',
          format: (value) => i18next.t(`sms:sms_status_${value}`),
          map: (value) => (value === 'enable' ? 'success' : 'error'),
        },
      ],
    };
  });

export default {
  getConfig,
};
