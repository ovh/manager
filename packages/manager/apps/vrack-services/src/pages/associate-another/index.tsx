import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsSpinner,
  OsdsModal,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useVrackList } from '@/api';
import { AssociateAnotherVrack } from './components/AssociateAnotherVrack';
import { handleClick } from '@/utils/ods-utils';
import { CreateVrack } from '../associate/components/CreateVrack';

export default function AssociateAnother() {
  const { id, vrackId } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('vrack-services/dashboard');
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
    <OsdsModal
      dismissible
      headline={t('modalAssociateAnotherVrackTitle')}
      onOdsModalClose={closeModal}
    >
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      {!isLoading && !isError && vrackList.length > 0 && (
        <AssociateAnotherVrack
          vrackServicesId={id}
          closeModal={closeModal}
          vrackList={vrackList}
          currentVrack={vrackId}
        />
      )}
      {!isLoading && !isError && vrackList.length === 0 && (
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
