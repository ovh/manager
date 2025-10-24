import { TileBlock } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_COLOR_HUE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsClipboard, OsdsText } from '@ovhcloud/ods-components/react';
import TileWrapper from './TileWrapper.components';
import LinkIcon from '@/components/LinkIcon/LinkIcon.component';
import StatusChip from '@/components/StatusChip/StatusChip.component';

const GeneralInformationTile: React.FC<{
  t: (key: string) => string;
  name: string;
  rancherId: string;
  version: string;
  computedStatus: string;
  isReadyStatus: boolean;
  shouldDisplayUpdateSoftware: boolean | null;
  hrefEdit: string;
  hrefUpdateSoftware: string;
}> = ({
  t,
  name,
  rancherId,
  version,
  computedStatus,
  isReadyStatus,
  shouldDisplayUpdateSoftware,
  hrefEdit,
  hrefUpdateSoftware,
}) => (
  <TileWrapper title={t('general_informations')}>
    <TileBlock label={t('description')}>
      <LinkIcon
        iconName={ODS_ICON_NAME.PEN}
        href={hrefEdit}
        text={name}
        isDisabled={!isReadyStatus}
      />
    </TileBlock>

    <TileBlock label="ID">
      <OsdsClipboard aria-label="clipboard-id" value={rancherId}>
        <span slot="success-message">{t('copy')}</span>
        <span slot="error-message">{t('error')}</span>
      </OsdsClipboard>
    </TileBlock>

    <TileBlock label={t('rancher_version')}>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{version}</OsdsText>
      {shouldDisplayUpdateSoftware && (
        <LinkIcon
          iconName={ODS_ICON_NAME.ARROW_RIGHT}
          href={hrefUpdateSoftware}
          text={t('updateSoftwareAvailableUpdate')}
        />
      )}
    </TileBlock>

    <TileBlock label={t('status')}>
      <StatusChip label={computedStatus} />
    </TileBlock>
  </TileWrapper>
);

export default GeneralInformationTile;
