import i18next from 'i18next';
import loadTranslations from '../i18n-utils';

/* translationsInject 'overthebox' */

const getConfig = () =>
  loadTranslations('overthebox').then(() => {
    return {
      data: [
        {
          label: i18next.t('overthebox:overtheboxes_name_label'),
          property: 'serviceName',
          serviceLink: true,
        },
        {
          label: i18next.t('overthebox:overtheboxes_description_label'),
          property: 'customerDescription',
        },
        {
          label: i18next.t('overthebox:overtheboxes_status_label'),
          property: 'status',
          format: (value) =>
            i18next.t(`overthebox:overtheboxes_status_label_${value.status}`),
          map: (value) => {
            if (['active'].includes(value.status)) return 'success';
            if (['creating', 'toCreate', 'toDelete'].includes(value.status))
              return 'warning';
            if (['deleted', 'suspended'].includes(value.status)) return 'error';

            return 'info';
          },
        },
      ],
    };
  });

export default {
  getConfig,
};
