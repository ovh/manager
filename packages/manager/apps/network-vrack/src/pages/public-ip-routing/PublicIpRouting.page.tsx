import { useTranslation } from 'react-i18next';

import { ICON_NAME, Icon, Text } from '@ovhcloud/ods-react';

export default function PublicIpRouting() {
  const { t } = useTranslation(['publicIpRouting']);

  return (
    <>
      <Text className="mb-2" preset="paragraph">
        {t('publicIpRouting_purpose')}
      </Text>
      <Text className="mb-2" preset="paragraph">
        {t('publicIpRouting_explanation')}
      </Text>
      <Text className="mb-2" preset="paragraph">
        <Text className="align-bottom font-semibold" preset="span">
          <Icon name={ICON_NAME.circleInfo} className="align-bottom leading-none" />
        </Text>
        <Text className="align-bottom font-semibold leading-none" preset="span">
          {t('publicIpRouting_note_label')}
        </Text>
        <Text className="ml-2 align-bottom leading-none" preset="span">
          {t('publicIpRouting_note_value')}
        </Text>
      </Text>
    </>
  );
}
