import React, { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ExportConsent, OnExportCsv, ExportCompleted } from './modals';
import { ExportCsvStateEnum, SetStateType } from './types';

const MODALS: {
  [key in ExportCsvStateEnum]?: (props: {
    setExportCsvState: SetStateType<ExportCsvStateEnum>;
    flattenData: any;
  }) => ReactElement;
} = {
  exportConsent: ({ setExportCsvState }) => (
    <ExportConsent setExportCsvState={setExportCsvState} />
  ),
  onExport: ({ setExportCsvState, flattenData }) => (
    <OnExportCsv
      setExportCsvState={setExportCsvState}
      flattenData={flattenData}
    />
  ),
  exportCompleted: ({ setExportCsvState }) => (
    <ExportCompleted setExportCsvState={setExportCsvState} />
  ),
};

export default function ExportCsv({ flattenData }: { flattenData: any }) {
  const [exportCsvState, setExportCsvState] = useState<ExportCsvStateEnum>(
    ExportCsvStateEnum.initial,
  );
  const { t } = useTranslation('dedicated-servers');

  console.info('coucou', { flattenData });

  return (
    <>
      <OdsButton
        size={ODS_BUTTON_SIZE.sm}
        icon={ODS_ICON_NAME.download}
        id="server-export-csv-action"
        className="whitespace-nowrap"
        variant="outline"
        label={t('server_export_csv_buttons_import')}
        onClick={() => setExportCsvState(ExportCsvStateEnum.exportConsent)}
      />
      <OdsModal
        isOpen={exportCsvState !== ExportCsvStateEnum.initial}
        isDismissible={false}
      >
        <OdsText preset={ODS_TEXT_PRESET.heading3}>
          {t('server_export_csv_title')}
        </OdsText>
        {MODALS?.[exportCsvState]?.({ setExportCsvState, flattenData })}
      </OdsModal>
    </>
  );
}
