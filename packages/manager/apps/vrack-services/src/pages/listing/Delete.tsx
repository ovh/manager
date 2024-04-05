import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DeleteModal } from '@/components/DeleteModal';
import { ButtonType, PageLocation, PageName, PageType } from '@/utils/tracking';

export default function DeleteVrackServices() {
  const { t } = useTranslation('vrack-services/listing');
  const { id } = useParams();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };

  return (
    <DeleteModal
      closeModal={onClose}
      deleteInputLabel={t('modalDeleteInputLabel')}
      headline={t('modalDeleteHeadline')}
      trackingParams={{
        pageName: PageName.delete,
        pageType: PageType.popup,
        location: PageLocation.popup,
        buttonType: ButtonType.button,
      }}
      onConfirmDelete={() => {
        // TODO: implement resiliate logic
        onClose();
      }}
      isModalOpen
    />
  );
}
