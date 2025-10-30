import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

import { ExportCsvStateEnum, SetStateType } from '../types';

export default function ExportCompleted({
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
          id="server-export-csv-back"
          variant="outline"
          label={t('server_export_csv_buttons_back')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.initial)}
        />
      </div>
    </>
  );
}
