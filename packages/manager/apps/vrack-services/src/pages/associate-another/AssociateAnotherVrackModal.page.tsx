import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsModal,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useVrackList } from '@ovh-ux/manager-network-common';
import { AssociateAnotherVrack } from './AssociateAnotherVrack.component';
import { CreateVrack } from '@/components/CreateVrack.component';
import { LoadingText } from '@/components/LoadingText.component';

export default function AssociateAnotherVrackModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('vrack-services/associate');
  const { vrackList, isError, isLoading, error } = useVrackList();
  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['associate-another-vrack', 'cancel'],
    });
    navigate('..');
  };

  if (!id) {
    return closeModal();
  }

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeModal}>
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
        {t('modalAssociateAnotherVrackTitle')}
      </OdsText>
      {isError && (
        <OdsMessage
          isDismissible={false}
          className="block mb-4"
          color={ODS_MESSAGE_COLOR.critical}
        >
          {t('modalVrackAssociationError', {
            error: error?.response?.data?.message,
          })}
        </OdsMessage>
      )}
      {isLoading && <LoadingText title={t('modalLoadingVrackList')} />}
      {!isLoading && !isError && vrackList.length > 0 && (
        <AssociateAnotherVrack closeModal={closeModal} vrackList={vrackList} />
      )}
      {!isLoading && !isError && vrackList.length === 0 && (
        <CreateVrack closeModal={closeModal} />
      )}
      {(isLoading || isError) && (
        <OdsButton
          slot="actions"
          type="button"
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={closeModal}
          label={t('modalAssociateCancelButton')}
        />
      )}
    </OdsModal>
  );
}
