import {
  OsdsButton,
  OsdsInput,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
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
import { isValidRancherName } from '@/utils/rancher';
import Modal from './Modal';
import { useTrackingAction, useTrackingPage } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

interface DeleteModalProps {
  rancher: RancherService;
  toggleModal: (showModal: boolean) => void;
  onEditRancher: (rancher: RancherService) => void;
}

const EditNameModal = ({
  rancher,
  toggleModal,
  onEditRancher,
}: DeleteModalProps) => {
  const { t } = useTranslation('pci-rancher/listing');
  const trackAction = useTrackingAction();
  useTrackingPage(TrackingPageView.EditNameModal);
  const [newName, setNewName] = useState(rancher.currentState?.name || '');
  const isValidName = isValidRancherName(newName);
  const isButtonValid = rancher.currentState?.name !== newName && isValidName;

  const onEdit = () => {
    if (isButtonValid) {
      trackAction(TrackingPageView.EditNameModal, TrackingEvent.confirm);
      onEditRancher({
        ...rancher,
        currentState: {
          ...rancher.currentState,
          name: newName,
        } as RancherService['currentState'],
      } as RancherService);
      toggleModal(false);
    }
  };
  return (
    <Modal
      color={ODS_THEME_COLOR_INTENT.info}
      onClose={() => toggleModal(false)}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="my-4"
      >
        {t('editNameModalTitle')}
      </OsdsText>
      <div className="my-4">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('editNameModalInfo')}
        </OsdsText>
      </div>
      <OsdsInput
        aria-label="edit-input"
        type={ODS_INPUT_TYPE.text}
        color={
          isValidName
            ? ODS_THEME_COLOR_INTENT.info
            : ODS_THEME_COLOR_INTENT.error
        }
        className="p-3"
        value={newName}
        onOdsValueChange={(
          e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
        ) => setNewName(e.target.value as string)}
      />
      <div className="mt-5">
        <OsdsText
          color={
            isValidName
              ? ODS_THEME_COLOR_INTENT.text
              : ODS_THEME_COLOR_INTENT.error
          }
        >
          {t('editNameModaleHelperInput')}
        </OsdsText>
      </div>
      <OsdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          trackAction(TrackingPageView.EditNameModal, TrackingEvent.cancel);
          toggleModal(false);
        }}
      >
        {t('cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={!isButtonValid || undefined}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onEdit}
        aria-label="edit-name-rancher"
      >
        {t('editNameRancherCta')}
      </OsdsButton>
    </Modal>
  );
};

export default EditNameModal;
