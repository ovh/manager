import { useTranslation } from 'react-i18next';

import { Card, Divider, ICON_NAME, Icon, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Link } from '@ovh-ux/muk';

export default function TipsAndSupport() {
  const { t } = useTranslation('videoManagerCenter');

  return (
    <>
      <Card className="p-6">
        <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_tips')}</Text>
        <div className="mt-2 flex flex-col space-y-2">
          <Text>{t('video_manager_ga')}</Text>
          <Link target="_blank" rel="noopener noreferrer" disabled>
            <>
              {t('video_manager_service_tips_tutorial')}
              <Icon name={ICON_NAME.arrowRight}></Icon>
            </>
          </Link>
          <Link target="_blank" rel="noopener noreferrer" disabled>
            <>
              {t('video_manager_service_tips_tutorial')}
              <Icon name={ICON_NAME.arrowRight}></Icon>
            </>
          </Link>
        </div>
      </Card>
      <Card className="p-6">
        <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_support')}</Text>
        <Divider />
        <div className="flex flex-col space-y-2">
          <Text>{t('video_manager_ga')}</Text>
          <Text preset={TEXT_PRESET.caption}>{t('video_manager_service_support_standard')}</Text>
          <Link target="_blank" rel="noopener noreferrer" disabled>
            <>
              {t('video_manager_service_support_ticket')}
              <Icon name={ICON_NAME.externalLink}></Icon>
            </>
          </Link>
        </div>
      </Card>
    </>
  );
}
