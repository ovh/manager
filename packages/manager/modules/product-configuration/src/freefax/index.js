import i18next from 'i18next';
import loadTranslations from '../i18n-utils';

/* translationsInject 'freefax' */

const getConfig = () =>
  loadTranslations('freefax').then(() => {
    return {
      data: [
        {
          label: i18next.t('freefax:freefaxes_number_label'),
          property: 'number',
          serviceLink: true,
        },
        {
          label: i18next.t('freefax:freefaxes_from_name_label'),
          property: 'fromName',
        },
        {
          label: i18next.t('freefax:freefaxes_from_email_label'),
          property: 'fromEmail',
        },
      ],
    };
  });

export default {
  getConfig,
};
