import i18next from 'i18next';
import loadTranslations from '../i18n-utils';

/* translationsInject 'pack' */

const getConfig = () =>
  loadTranslations('pack').then(() => {
    return {
      data: [
        {
          label: i18next.t('pack:packs_pack_name_label'),
          property: 'packName',
          serviceLink: true,
        },
        {
          label: i18next.t('pack:packs_description_label'),
          property: 'description',
        },
        {
          label: i18next.t('pack:packs_num_service_label'),
          property: 'numServices',
          type: 'number',
        },
      ],
    };
  });

export default {
  getConfig,
};
