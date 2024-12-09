import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TMappedVolume } from './useVolumeListColumns';

export default function VolumeDetailPopover({
  row,
}: Readonly<{ row: TMappedVolume }>) {
  const { t } = useTranslation('consumption/hourly-instance/detail-popover');

  const { translateMicroRegion } = useTranslatedMicroRegions();

  return (
    <div className="flex flex-col gap-3">
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <strong>{t('cpbc_volume_location')} : </strong>
        {translateMicroRegion(row.region)}
      </OsdsText>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <strong>{t('cpbc_volume_type')} : </strong>
        {row.type}
      </OsdsText>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <strong>{t('cpbc_volume_size')} : </strong>
        {row.size}
      </OsdsText>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <strong>{t('cpbc_volume_state')} : </strong>
        {t(`cloud_common_state_${row.status}`)}
      </OsdsText>
    </div>
  );
}
