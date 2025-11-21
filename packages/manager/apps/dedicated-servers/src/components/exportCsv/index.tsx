import React, { useState, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';

import { SetStateType, ExportCsvDataType } from '@/components/exportCsv/types';
import { ExportConsent, OnExportCsv, ExportCompleted } from './modals';
import { TITLE, ExportCsvStateEnum } from './constants';

const MODALS: {
  [key in ExportCsvStateEnum]?: (props: {
    setExportCsvState: SetStateType<ExportCsvStateEnum>;
    setModalTitle: SetStateType<string>;
    exportCsvData: ExportCsvDataType;
  }) => ReactElement;
} = {
  exportConsent: ({ setExportCsvState }) => (
    <ExportConsent setExportCsvState={setExportCsvState} />
  ),
  onExportCsv: ({ setExportCsvState, exportCsvData }) => (
    <OnExportCsv
      setExportCsvState={setExportCsvState}
      exportCsvData={exportCsvData}
    />
  ),
  exportCompleted: ({ setExportCsvState, setModalTitle }) => (
    <ExportCompleted
      setExportCsvState={setExportCsvState}
      setModalTitle={setModalTitle}
    />
  ),
};

export default function ExportCsv({
  exportCsvData,
}: {
  exportCsvData: ExportCsvDataType;
}) {
  const { t } = useTranslation('dedicated-servers');
  const [exportCsvState, setExportCsvState] = useState<ExportCsvStateEnum>(
    ExportCsvStateEnum.INITIAL,
  );
  const [modalTitle, setModalTitle] = useState(TITLE.MAIN);

  return (
    <>
      <OdsButton
        size={ODS_BUTTON_SIZE.sm}
        icon={ODS_ICON_NAME.download}
        id="server-export-csv-action"
        className="whitespace-nowrap"
        variant="outline"
        label={t('server_export_csv_button_import')}
        onClick={() => setExportCsvState(ExportCsvStateEnum.EXPORT_CONSENT)}
      />
      <OdsModal
        isOpen={exportCsvState !== ExportCsvStateEnum.INITIAL}
        isDismissible
        onOdsClose={() => setExportCsvState(ExportCsvStateEnum.INITIAL)}
      >
        <OdsText preset={ODS_TEXT_PRESET.heading3}>{t(modalTitle)}</OdsText>
        {MODALS?.[exportCsvState]?.({
          setExportCsvState,
          exportCsvData,
          setModalTitle,
        })}
      </OdsModal>
    </>
  );
}
