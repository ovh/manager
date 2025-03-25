import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsMessage,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { handleClick } from '@ovh-ux/manager-react-components';
import { useAllowedVrackList } from '@ovh-ux/manager-network-common';
import { AssociateVrack } from './AssociateVrack.component';
import { CreateVrack } from '@/components/CreateVrack.component';
import { LoadingText } from '@/components/LoadingText.component';

export default function AssociateVrackModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('vrack-services/associate');
  const {
    allowedVrackList,
    isError,
    isLoading,
    error,
    vrackListInError,
  } = useAllowedVrackList(id);
  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['associate-vrack', 'cancel'],
    });
    navigate('..');
  };

  if (!id) {
    return closeModal();
  }

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeModal}>
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('modalVrackAssociationTitle')}
      </OdsText>
      {isError && (
        <OdsMessage className="mb-4" color={ODS_MESSAGE_COLOR.critical}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalVrackAssociationError', {
              error: error?.response?.data?.message,
            })}
          </OdsText>
        </OdsMessage>
      )}
      {vrackListInError.length > 0 && (
        <OdsMessage className="mb-4" color={ODS_MESSAGE_COLOR.warning}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t('modalVrackListInError', { list: vrackListInError.join(', ') })}
          </OdsText>
        </OdsMessage>
      )}
      {isLoading && <LoadingText title={t('modalLoadingVrackList')} />}
      {!isLoading && !isError && allowedVrackList.length > 0 && (
        <AssociateVrack closeModal={closeModal} vrackList={allowedVrackList} />
      )}
      {!isLoading && !isError && allowedVrackList.length === 0 && (
        <CreateVrack closeModal={closeModal} />
      )}
      {(isLoading || isError) && (
        <OdsButton
          slot="actions"
          type="button"
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_BUTTON_COLOR.primary}
          {...handleClick(closeModal)}
          label={t('modalAssociateCancelButton')}
        />
      )}
    </OdsModal>
  );
}
