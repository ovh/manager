import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import Modal from '@/components/Modals/Modal';
import { useGenerateUrl } from '@/hooks';

export default function ModalDeleteRedirections() {
  const { t } = useTranslation('redirections/delete');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  delete params.deleteRedirectionId;

  const goBackUrl = useGenerateUrl('..', 'path', params);
  const goBack = () => navigate(goBackUrl);

  return (
    <Modal
      isOpen
      color={ODS_MODAL_COLOR.critical}
      title={t('zimbra_redirections_delete_modal_title')}
      onClose={goBack}
      secondaryButton={{
        testid: 'cancel-btn',
        label: t('zimbra_redirections_delete_button_cancel'),
        action: goBack,
      }}
      primaryButton={{
        testid: 'delete-btn',
        variant: ODS_BUTTON_VARIANT.default,
        label: t('zimbra_redirections_delete_button_delete'),
        action: goBack,
      }}
      isDismissible
    >
      <>
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          className="mt-5 mb-5"
          data-testid="modal-content"
        >
          {t('zimbra_redirections_delete_modal_content')}
        </OdsText>

        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
          {t('zimbra_redirections_delete_modal_from')}
        </OdsText>

        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="font-bold">
          {t('zimbra_redirections_delete_modal_to')}
        </OdsText>
      </>
    </Modal>
  );
}
