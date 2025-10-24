import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import TileWrapper from './TileWrapper.components';
import LinkIcon from '@/components/LinkIcon/LinkIcon.component';
import StatusChip from '@/components/StatusChip/StatusChip.component';

const UpgradePlanTile: React.FC<{
  t: (key: string) => string;
  isReadyStatus: boolean;
  hrefUpdateOffer: string;
}> = ({ t, isReadyStatus, hrefUpdateOffer }) => (
  <TileWrapper
    title={t('upgradePlanTitle')}
    className="w-full flex-col bg-[--ods-color-blue-100] border-none"
  >
    <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="my-5">
      {t('upgradePlanDescription')}
    </OsdsText>
    <LinkIcon
      iconName={ODS_ICON_NAME.ARROW_RIGHT}
      href={hrefUpdateOffer}
      text={t('upgradePlanButton')}
      isDisabled={!isReadyStatus}
    />
  </TileWrapper>
);

export default UpgradePlanTile;
