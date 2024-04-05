import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsMessage,
  OsdsSpinner,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useAllowedVrackList } from '@/api';
import { AssociateVrack } from './components/AssociateVrack';
import { CreateVrack } from './components/CreateVrack';
import { handleClick } from '@/utils/ods-utils';

export default function Associate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services/listing');
  const {
    allowedVrackList,
    isError,
    isLoading,
    error,
    vrackListInError,
  } = useAllowedVrackList(id);
  const closeModal = () => navigate('..');

  if (!id) {
    return closeModal();
  }

  return (
    <OsdsModal
      dismissible
      headline={t('modalVrackAssociationTitle')}
      masked={!id || undefined}
      onOdsModalClose={closeModal}
    >
      {isError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('genericApiError', { error: error?.response?.data.message })}
          </OsdsText>
        </OsdsMessage>
      )}
      {vrackListInError.length > 0 && (
        <OsdsMessage className="mb-4" type={ODS_MESSAGE_TYPE.warning}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('vrackListInError', { list: vrackListInError.join(', ') })}
          </OsdsText>
        </OsdsMessage>
      )}
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      {!isLoading && !isError && allowedVrackList.length > 0 && (
        <AssociateVrack
          vrackServicesId={id}
          closeModal={closeModal}
          vrackList={allowedVrackList}
        />
      )}
      {!isLoading && !isError && allowedVrackList.length === 0 && (
        <CreateVrack closeModal={closeModal} />
      )}
      {(isLoading || isError) && (
        <OsdsButton
          slot="actions"
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...handleClick(closeModal)}
        >
          {t('modalCancelVrackAssociationButtonLabel')}
        </OsdsButton>
      )}
    </OsdsModal>
  );
}
