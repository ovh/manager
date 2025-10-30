import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { ExportCsvStateEnum, SetStateType } from '../types';

export default function ExportConsent({
  setExportCsvState,
}: {
  setExportCsvState: SetStateType<ExportCsvStateEnum>;
}) {
  const { t } = useTranslation('dedicated-servers');
  return (
    <>
      <div className="flex justify-end">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          id="server-export-csv-consent-ok"
          className="mr-3"
          variant="outline"
          label={t('server_export_csv_buttons_cancel')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.initial)}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          icon={ODS_ICON_NAME.download}
          id="server-export-csv-cancel"
          label={t('server_export_csv_buttons_download')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.onExport)}
        />
      </div>
    </>
  );
}
