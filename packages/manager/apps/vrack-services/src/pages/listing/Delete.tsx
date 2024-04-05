import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@/components/DeleteModal';
import {
  ButtonType,
  PageLocation,
  PageName,
  PageType,
  TrackingClickParams,
  getClickProps,
} from '@/utils/tracking';

const sharedTrackingParams: TrackingClickParams = {
  pageName: PageName.delete,
  pageType: PageType.popup,
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function DeleteVrackServices() {
  const { t } = useTranslation('vrack-services/listing');
  const { shell } = React.useContext(ShellContext);
  const navigate = useNavigate();
  const onClose = () => {
    shell.tracking.trackClick(
      getClickProps({
        ...sharedTrackingParams,
        actionType: 'exit',
        actions: ['cancel'],
      }),
    );
    navigate('..');
  };

  return (
    <DeleteModal
      closeModal={onClose}
      deleteInputLabel={t('modalDeleteInputLabel')}
      headline={t('modalDeleteHeadline')}
      onConfirmDelete={() => {
        shell.tracking.trackClick(
          getClickProps({
            ...sharedTrackingParams,
            actionType: 'action',
            actions: ['confirm'],
          }),
        );
        // TODO: implement resiliate logic
        onClose();
      }}
      isModalOpen
    />
  );
}
