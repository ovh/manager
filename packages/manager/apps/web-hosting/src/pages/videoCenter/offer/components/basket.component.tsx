import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  Button,
  Card,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

type BasketProps = {
  offer: boolean;
};
export const Basket: React.FC<BasketProps> = ({ offer }: BasketProps) => {
  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.DASHBOARD]);

  if (!offer) {
    return (
      <Card className="w-full p-6">
        <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_tips')}</Text>
        <Button color={BUTTON_COLOR.primary} disabled>
          {t('video_manager_service_access_video_center')}
          <Icon name={ICON_NAME.arrowRight}></Icon>
        </Button>
      </Card>
    );
  }
  return (
    <Card className="p-6">
      <Card className="mb-4 w-full p-6">
        <Text preset={TEXT_PRESET.heading5}>{t('video_manager_service_current_offer')}</Text>
        <Text>{offer}</Text>
      </Card>
      <Button color={BUTTON_COLOR.primary} className="w-full">
        {t('video_manager_service_access_video_center')}
        <Icon name={ICON_NAME.arrowRight}></Icon>
      </Button>
    </Card>
  );
};
