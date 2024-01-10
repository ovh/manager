import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsInput } from '@ovhcloud/ods-components/input/react';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import React, { useState } from 'react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { useTranslation } from 'react-i18next';
import { RancherService } from '@/api/api.type';

interface DeleteModalProps {
  toggleModal: (showModal: boolean) => void;
  onDeleteRancher: (rancherId: string) => void;
  selectedRancher: RancherService;
}
export const TERMINATE_TEXT = 'TERMINATE';

const DeleteModal = ({
  toggleModal,
  onDeleteRancher,
  selectedRancher,
}: DeleteModalProps) => {
  const { t } = useTranslation('pci-rancher/listing');
  const [terminateText, setTerminateText] = useState('');

  const isButtonDisabled = TERMINATE_TEXT !== terminateText;

  const onDelete = () => {
    onDeleteRancher(selectedRancher.id);
    toggleModal(false);
  };
  return (
    <OsdsModal size="sm" color={ODS_THEME_COLOR_INTENT.warning} dismissible>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.primary}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="my-3"
      >
        {t('deleteModalTitle')}
      </OsdsText>
      <OsdsText color="text">
        {t('deleteModalDescription', {
          rancherName: selectedRancher.currentState?.name,
        })}
      </OsdsText>
      <OsdsMessage type="warning" className="my-4 p-3">
        {t('deleteModalWarning')}
      </OsdsMessage>
      <OsdsText color={ODS_THEME_COLOR_INTENT.info} className="my-3">
        {t('deleteModalTerminateMessage')}
      </OsdsText>
      <OsdsInput
        type="text"
        className="p-3"
        value={terminateText}
        onOdsValueChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTerminateText(e.target.value)
        }
        aria-label="delete-input"
      />
      <OsdsButton
        slot="actions"
        color="default"
        target="_blank"
        onClick={() => toggleModal(false)}
      >
        {t('cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={isButtonDisabled || null}
        slot="actions"
        color="primary"
        target="_blank"
        onClick={onDelete}
      >
        {t('deleteRancher')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default DeleteModal;
