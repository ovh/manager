import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';

import { SetStateType } from '@/components/exportCsv/types';
import { TITLE, ExportCsvStateEnum } from '../constants';

export default function ExportCompleted({
  setExportCsvState,
  setModalTitle,
}: {
  setExportCsvState: SetStateType<ExportCsvStateEnum>;
  setModalTitle: SetStateType<string>;
}) {
  const { t } = useTranslation('dedicated-servers');

  useEffect(() => {
    setModalTitle(TITLE.COMPLETED);
    return () => {
      setModalTitle(TITLE.MAIN);
    };
  }, []);

  return (
    <>
      <OdsText className="my-8">
        {t('server_export_csv_export_completed_content')}
      </OdsText>
      <div className="flex justify-end">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          id="server-export-csv-close"
          variant="outline"
          label={t('server_export_csv_button_close')}
          onClick={() => setExportCsvState(ExportCsvStateEnum.INITIAL)}
        />
      </div>
    </>
  );
}
