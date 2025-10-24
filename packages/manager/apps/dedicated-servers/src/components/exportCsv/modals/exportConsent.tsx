import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { SetStateType } from '@/components/exportCsv/types';
import { ExportCsvStateEnum } from '../constants';

export default function ExportConsent({
  setExportCsvState,
}: {
  setExportCsvState: SetStateType<ExportCsvStateEnum>;
}) {
  const { t } = useTranslation('dedicated-servers');

  return (
    <>
      <OdsText className="my-8">
        {t('server_export_csv_consent_disclaimer')}
      </OdsText>
      <div className="flex justify-end">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          id="server-export-csv-consent-cancel"
          className="mr-3"
          variant="outline"
          label={t('server_export_csv_button_cancel')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.INITIAL)}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          icon={ODS_ICON_NAME.download}
          id="server-export-csv-consent-export"
          label={t('server_export_csv_button_export')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.ON_EXPORT_CSV)}
        />
      </div>
    </>
  );
}
