import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import Loading from '@/components/Loading/Loading';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { useExportIpToCsv } from '@/data/hooks';
import { ListingContext } from '@/pages/listing/listingContext';

export default function ExportIpToCsv() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.exportIpToCsv,
    NAMESPACES.ACTIONS,
  ]);
  const { apiFilter } = useContext(ListingContext);
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();

  /*
    We need this ref to prevent a double navigation
    when closing the modale before the end of the download.
    A useState or useLocation would have required a rerender 
    that we cannot have upon closing the modale
  */
  const isOpen = useRef<boolean>(true);

  const closeModal = () => {
    if (isOpen.current) {
      isOpen.current = false;
      navigate('..');
    }
  };

  const {
    mutateAsync: handleExportToCsv,
    isPending: isCSVLoading,
  } = useExportIpToCsv({
    apiFilter,
    onSuccess: (data) => {
      if (isOpen.current) {
        data.downloadFn();
        addSuccess(t('exportIpToCsvSuccess'));
        closeModal();
      }
    },
    onError: () => addError(t('exportIpToCsvError')),
  });

  return (
    <Modal
      isOpen
      onDismiss={closeModal}
      heading={t('exportIpToCsvTitle')}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={handleExportToCsv}
      isPrimaryButtonLoading={isCSVLoading}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={closeModal}
    >
      {isCSVLoading ? (
        <>
          <OdsText className="mb-6" preset={ODS_TEXT_PRESET.paragraph}>
            {t('exportIpToCsvDownloadingFile')}
          </OdsText>
          <Loading />
        </>
      ) : (
        <>
          <OdsText className="mb-2" preset={ODS_TEXT_PRESET.paragraph}>
            {t('exportIpToCsvExplanation')}
          </OdsText>
          <OdsText className="mb-6" preset={ODS_TEXT_PRESET.paragraph}>
            {t('exportIpToCsvConfirm')}
          </OdsText>
        </>
      )}
    </Modal>
  );
}
