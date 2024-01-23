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
} from '@ovhcloud/ods-components';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { RancherService } from '@/api/api.type';

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
  const [newName, setNewName] = useState(rancher.currentState?.name || '');

  const isValidName = /^[a-z0-9.-]{3,64}$/i.test(newName);

  const isButtonValid = rancher.currentState?.name !== newName && isValidName;

  const onEdit = () => {
    if (isButtonValid) {
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
    <OsdsModal color={ODS_THEME_COLOR_INTENT.info} dismissible>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="my-3"
      >
        {t('editNameModalTitle')}
      </OsdsText>
      <div className="mt-3">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('editNameModalInfo')}
        </OsdsText>
      </div>
      <OsdsInput
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
        aria-label="edit-input"
      />
      <OsdsText
        className="my-3"
        color={
          isValidName
            ? ODS_THEME_COLOR_INTENT.primary
            : ODS_THEME_COLOR_INTENT.error
        }
      >
        {t('editNameModaleHelperInput')}
      </OsdsText>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.default}
        onClick={() => toggleModal(false)}
      >
        {t('cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={isButtonValid}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onEdit}
        aria-label="edit-name-rancher"
      >
        {t('editNameRancherCta')}
      </OsdsButton>
    </OsdsModal>
  );
};

export default EditNameModal;
