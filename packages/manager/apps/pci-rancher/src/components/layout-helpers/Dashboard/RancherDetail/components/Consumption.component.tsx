import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { TileBlock } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import TileWrapper from './TileWrapper.components';
import LinkIcon from '@/components/LinkIcon/LinkIcon.component';

const ConsumptionTile: React.FC<{
  t: (key: string, params?: any) => string;
  plan: string;
  orchestratedVcpus?: number;
  usageDateTime?: string;
  isReadyStatus: boolean;
  hrefUpdateOffer: string;
  displayDate: (format: string) => string | null;
}> = ({
  t,
  plan,
  orchestratedVcpus,
  usageDateTime,
  isReadyStatus,
  hrefUpdateOffer,
  displayDate,
}) => (
  <TileWrapper title={t('consumption')}>
    <TileBlock label={t('service_level')}>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{t(plan)}</OsdsText>
      <LinkIcon
        iconName={ODS_ICON_NAME.ARROW_RIGHT}
        href={hrefUpdateOffer}
        text={t('updateOfferModaleTitle')}
        isDisabled={!isReadyStatus}
      />
    </TileBlock>

    <TileBlock label={t('count_cpu_orchestrated')}>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
        {orchestratedVcpus}
      </OsdsText>
      {usageDateTime && (
        <div className="mt-3">
          <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
            {t('last_update_date', {
              date: displayDate('PPPP'),
              hour: displayDate('HH:mm:ss'),
            })}
          </OsdsText>
        </div>
      )}
    </TileBlock>
  </TileWrapper>
);

export default ConsumptionTile;
