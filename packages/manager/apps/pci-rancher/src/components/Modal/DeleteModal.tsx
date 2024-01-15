import {
  OsdsButton,
  OsdsInput,
  OsdsMessage,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OsdsInputCustomEvent,
  OdsInputValueChangeEventDetail,
} from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { useState } from 'react';

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
    <OsdsModal color={ODS_THEME_COLOR_INTENT.warning} dismissible>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.primary}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="my-3"
      >
        {t('deleteModalTitle')}
      </OsdsText>
      <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
        {t('deleteModalDescription', {
          rancherName: selectedRancher.currentState?.name,
        })}
      </OsdsText>
      <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="my-4 p-3">
        {t('deleteModalWarning')}
      </OsdsMessage>
      <OsdsText color={ODS_THEME_COLOR_INTENT.info} className="my-3">
        {t('deleteModalTerminateMessage')}
      </OsdsText>
      <OsdsInput
        type={ODS_INPUT_TYPE.text}
        className="p-3"
        value={terminateText}
        onOdsValueChange={(
          e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
        ) => setTerminateText(e.target.value as string)}
        aria-label="delete-input"
      />
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.default}
        onClick={() => toggleModal(false)}
      >
        {t('cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={isButtonDisabled || null}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onDelete}
      >
        {t('deleteRancher')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default DeleteModal;
