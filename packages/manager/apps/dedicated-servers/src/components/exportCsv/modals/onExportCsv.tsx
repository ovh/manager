import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useColumns } from '@/components/dataGridColumns';

import { ExportCsvStateEnum, SetStateType } from '../types';

export default function OnExportCsv({
  setExportCsvState,
  flattenData = [],
}: {
  setExportCsvState: SetStateType<ExportCsvStateEnum>;
  flattenData: any;
}) {
  const { t } = useTranslation('dedicated-servers');
  const columns = useColumns();
  const [csvColumns, setCsvColumns] = useState(
    columns
      .filter(({ id }) => id !== 'actions')
      .map(({ label, id }) => ({
        label,
        id,
      })),
  );

  console.info({ csvColumns, flattenData });

  return (
    <>
      <p className="text-center">Génération du fichier CSV en cours</p>
      <div className="flex justify-center">
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      </div>
      <div className="flex justify-end mt-5">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          id="server-export-csv-cancel"
          variant="outline"
          label={t('server_export_csv_buttons_cancel')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.initial)}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          id="server-export-csv-final-step"
          variant="outline"
          label={t('server_export_csv_buttons_final_step')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.exportCompleted)}
        />
      </div>
    </>
  );
}
