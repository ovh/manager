import React, { useState } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsInput,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { isValidSavingsPlanName } from '@/utils/savingsPlan';

type TEditNameModal = {
  oldName: string;
  onClose: () => void;
  onConfirm: (newName: string) => void;
};

export default function EditNameModal({
  oldName,
  onClose,
  onConfirm,
}: Readonly<TEditNameModal>) {
  const { t } = useTranslation('edit-name');
  const [newName, setNewName] = useState(oldName);

  const isValidName = isValidSavingsPlanName(newName);
  const isButtonValid = newName !== '' && isValidName;

  const handleOdsValueChange = (
    e: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
  ) => setNewName(e.target.value as string);

  const onClick = () => onConfirm(newName);

  return (
    <OsdsModal headline={t('title')} onOdsModalClose={onClose}>
      <div className="my-4">
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t('description')}
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
        onOdsValueChange={handleOdsValueChange}
      />
      <OsdsButton
        slot="actions"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onClose}
      >
        {t('cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={!isButtonValid || undefined}
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onClick}
      >
        {t('update')}
      </OsdsButton>
    </OsdsModal>
  );
}
