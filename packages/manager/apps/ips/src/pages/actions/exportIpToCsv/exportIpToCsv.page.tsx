import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import Loading from '@/components/Loading/Loading';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { useExportIpToCsv } from '@/data/hooks';
import { ListingContext } from '@/pages/listing/listingContext';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';

export default function ExportIpToCsv() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.exportIpToCsv,
    NAMESPACES.ACTIONS,
  ]);
  const { apiFilter } = useContext(ListingContext);
  const { addSuccess } = useNotifications();
  const navigate = useNavigate();
  const [search] = useSearchParams();

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
      navigate(`..?${search.toString()}`);
    }
  };

  const {
    mutate: handleExportToCsv,
    isPending: isCSVLoading,
    error,
  } = useExportIpToCsv({
    apiFilter,
    onSuccess: (data) => {
      if (isOpen.current) {
        data.downloadFn();
        addSuccess(t('exportIpToCsvSuccess'));
        closeModal();
      }
    },
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
      <ApiErrorMessage error={error} />
    </Modal>
  );
}
