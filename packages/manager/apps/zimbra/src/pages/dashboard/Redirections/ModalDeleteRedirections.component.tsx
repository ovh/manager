import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
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

  const buttonProps = {
    color: ODS_THEME_COLOR_INTENT.primary,
    action: goBack,
  };

  return (
    <Modal
      color={ODS_THEME_COLOR_INTENT.warning}
      title={t('zimbra_redirections_delete_modal_title')}
      onDismissible={goBack}
      secondaryButton={{
        ...buttonProps,
        testid: 'cancel-btn',
        label: t('zimbra_redirections_delete_button_cancel'),
      }}
      primaryButton={{
        ...buttonProps,
        testid: 'delete-btn',
        label: t('zimbra_redirections_delete_button_delete'),
      }}
      dismissible
    >
      <>
        <OsdsText
          className="mt-5 mb-5"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.body}
          data-testid="modal-content"
        >
          {t('zimbra_redirections_delete_modal_content')}
        </OsdsText>

        <OsdsText
          size={ODS_TEXT_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          hue={ODS_TEXT_COLOR_HUE._500}
        >
          {t('zimbra_redirections_delete_modal_from')}
        </OsdsText>

        <OsdsText
          size={ODS_TEXT_SIZE._500}
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          hue={ODS_TEXT_COLOR_HUE._500}
        >
          {t('zimbra_redirections_delete_modal_to')}
        </OsdsText>
      </>
    </Modal>
  );
}
