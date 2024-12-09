import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TInstanceConsumptionDetail } from './useInstanceListColumns';

export default function InstanceDetailPopover({
  row,
}: Readonly<{
  row: TInstanceConsumptionDetail;
}>) {
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
        <strong>{t('cpbc_server_details_popover_region')} : </strong>
        {translateMicroRegion(row.region)}
      </OsdsText>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <strong>{t('cpbc_server_details_popover_image_type')} : </strong>
        {row.imageType
          ? t(`cpbc_server_details_popover_imagetype_${row.imageType}`)
          : '-'}
      </OsdsText>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        <strong>{t('cpbc_server_details_popover_vm_type')} : </strong>
        {row.vmType ?? '-'}
      </OsdsText>
    </div>
  );
}
