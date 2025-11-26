import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

import useExportCsv from '@/hooks/useExportCsv';
import useGetFormatedExportCsvData from '@/hooks/useGetFormatedExportCsvData';
import { SetStateType, ExportCsvDataType } from '@/components/exportCsv/types';
import { ExportCsvStateEnum } from '../constants';

const UseExportCsvComponent = ({
  csvColumns,
  setExportCsvState,
}: {
  csvColumns: string[][];
  setExportCsvState: SetStateType<ExportCsvStateEnum>;
}) => {
  useExportCsv({
    dataToExport: csvColumns,
    autoExport: true,
    fileName: 'dedicated-servers-list',
  });

  useEffect(() => {
    setExportCsvState(ExportCsvStateEnum.EXPORT_COMPLETED);
  }, []);

  return <></>;
};

export default function OnExportCsv({
  setExportCsvState,
  exportCsvData,
}: {
  setExportCsvState: SetStateType<ExportCsvStateEnum>;
  exportCsvData: ExportCsvDataType;
}) {
  const { t } = useTranslation('dedicated-servers');

  const csvColumns = useGetFormatedExportCsvData(exportCsvData);

  return (
    <>
      <OdsText className="text-center my-8">
        {t('server_export_csv_on_load_disclaimer')}
      </OdsText>
      <div className="flex justify-center">
        <OdsSpinner size={ODS_SPINNER_SIZE.md} />
      </div>
      <div className="flex justify-end">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          id="server-export-csv-cancel"
          variant="outline"
          label={t('server_export_csv_button_cancel')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.INITIAL)}
        />
      </div>
      {csvColumns && (
        <UseExportCsvComponent
          csvColumns={csvColumns}
          setExportCsvState={setExportCsvState}
        />
      )}
    </>
  );
}
