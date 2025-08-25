import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsModal, OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import Loading from '@/components/Loading/Loading';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { useExportToCsv } from '@/data/hooks';

export default function ExportIpToCsv() {
  const { isCSVLoading, handleExportToCsv } = useExportToCsv();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.exportIpToCsv,
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();

  const closeModal = () => {
    navigate('..');
  };

  const confirm = async () => {
    await handleExportToCsv();
    navigate('..');
  };

  return (
    <OdsModal
      isOpen
      onOdsClose={closeModal}
      color={ODS_MODAL_COLOR.information}
      isDismissible
    >
      <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading4}>
        {t('exportIpToCsvTitle')}
      </OdsText>
      {!isCSVLoading && (
        <>
          <OdsText className="mb-2" preset={ODS_TEXT_PRESET.paragraph}>
            {t('exportIpToCsvExplanation')}
          </OdsText>
          <OdsText className="mb-6" preset={ODS_TEXT_PRESET.paragraph}>
            {t('exportIpToCsvConfirm')}
          </OdsText>
        </>
      )}
      {isCSVLoading && (
        <>
          <OdsText className="mb-6" preset={ODS_TEXT_PRESET.paragraph}>
            {t('exportIpToCsvDownloadingFile')}
          </OdsText>
          <Loading />
        </>
      )}
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.outline}
        label={t('cancel', { ns: NAMESPACES.ACTIONS })}
        onClick={closeModal}
        data-testid="cancel-button"
      />
      <OdsButton
        slot="actions"
        type="button"
        isDisabled={isCSVLoading}
        label={t('validate', { ns: NAMESPACES.ACTIONS })}
        onClick={confirm}
        data-testid="confirm-button"
      />
    </OdsModal>
  );
}
