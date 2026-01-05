import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/muk';

export default function DeleteSiteModal() {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);

  const onClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      heading={t('common:delete_my_website')}
      onOpenChange={onClose}
      open={true}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:close`),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col space-y-4">
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite_delete_site_modal_description_part1')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite_delete_site_modal_description_part2')}
        </Text>
        <Text preset={TEXT_PRESET.paragraph}>
          {t('multisite_delete_site_modal_description_part3')}
        </Text>
      </div>
    </Modal>
  );
}
