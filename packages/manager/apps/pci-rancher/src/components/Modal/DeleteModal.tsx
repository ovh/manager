import {
  OsdsButton,
  OsdsInput,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OsdsInputCustomEvent,
  OdsInputValueChangeEventDetail,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { RancherService } from '@/api/api.type';
import Modal from './Modal';
import { useTrackingAction, useTrackingPage } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

interface DeleteModalProps {
  onClose: () => void;
  onDeleteRancher: () => void;
  selectedRancher: RancherService;
}
export const TERMINATE_TEXT = 'TERMINATE';

const DeleteModal = ({
  onClose,
  onDeleteRancher,
  selectedRancher,
}: DeleteModalProps) => {
  const { t } = useTranslation('pci-rancher/listing');
  const [terminateText, setTerminateText] = useState('');
  useTrackingPage(TrackingPageView.DeleteRancherModal);
  const trackAction = useTrackingAction();
  const isButtonDisabled = TERMINATE_TEXT !== terminateText;

  const onDelete = () => {
    trackAction(TrackingPageView.DeleteRancherModal, TrackingEvent.confirm);
    onDeleteRancher();
    onClose();
  };

  return (
    <Modal color={ODS_THEME_COLOR_INTENT.warning} onClose={onClose}>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="my-3"
      >
        {t('deleteModalTitle')}
      </OsdsText>
      <div className="my-4">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('deleteModalDescription', {
            rancherName: selectedRancher.currentState.name,
          })}
        </OsdsText>
      </div>
      <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="my-5 p-3">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text} className="my-3">
          {t('deleteModalWarning')}
        </OsdsText>
      </OsdsMessage>
      <div className="my-4">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._100}
        >
          {t('deleteModalTerminateMessage')}
        </OsdsText>
      </div>
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
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          trackAction(
            TrackingPageView.DeleteRancherModal,
            TrackingEvent.cancel,
          );
          onClose();
        }}
      >
        {t('cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={isButtonDisabled || undefined}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onDelete}
      >
        {t('deleteRancher')}
      </OsdsButton>
    </Modal>
  );
};

export default DeleteModal;
