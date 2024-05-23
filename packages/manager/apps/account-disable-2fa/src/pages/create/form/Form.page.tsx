import {
  ODS_BUTTON_TYPE,
  ODS_TEXT_SIZE,
  OdsSelectValueChangeEventDetail,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { FieldValues, useForm } from 'react-hook-form';
import { getCurrentUser } from '@/utils/user.util';
import { FormDocumentFieldList } from './FormDocumentFields/FormDocumentFieldList';
import { LegalFrom } from '@/types/user.type';

const user = getCurrentUser();
const flatFiles = (files: FieldValues) =>
  Object.values(files)
    .flat()
    .filter((f) => f);

const FormCreateRequest = () => {
  const { handleSubmit, control, reset, formState, watch } = useForm({
    mode: 'onChange',
  });

  const { t } = useTranslation('account-disable-2fa');
  const { t: tdoc } = useTranslation('account-disable-2fa-documents');

  const [selectedByFRLegalForm, setSelectedByFRLegalForm] = useState<LegalFrom>(
    null,
  );

  const files = flatFiles(watch());
  const isAnyFileSelected = files.length > 0;

  const handleLegalFormChange = (
    e: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => {
    reset();
    setSelectedByFRLegalForm(e.target.value as LegalFrom);
  };

  const isFROtherLegalForm =
    user.legalform === 'other' && user.subsidiary === 'FR';
  const legalForm = isFROtherLegalForm ? selectedByFRLegalForm : user.legalform;
  const { subsidiary } = user;

  return (
    <form onSubmit={handleSubmit((data) => {})}>
      {isFROtherLegalForm && (
        <div className="my-6">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_TEXT_SIZE._500}
          >
            {tdoc('account-disable-2fa-create-form-field-select-type-account')}
          </OsdsText>
          <OsdsSelect
            onOdsValueChange={handleLegalFormChange}
            value={selectedByFRLegalForm}
          >
            <span slot="placeholder">
              {t('account-disable-2fa-create-form-select-legalform-type')}
            </span>
            <OsdsSelectOption value="administration">
              {t('account-disable-2fa-create-form-legalform-administration')}
            </OsdsSelectOption>
            <OsdsSelectOption value="other">
              {t('account-disable-2fa-create-form-legalform-other')}
            </OsdsSelectOption>
          </OsdsSelect>
        </div>
      )}

      {legalForm && (
        <>
          <FormDocumentFieldList
            control={control}
            legalForm={legalForm}
            subsidiary={subsidiary}
          />

          <OsdsButton
            type={ODS_BUTTON_TYPE.submit}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="w-1/3 mt-10"
            disabled={!(formState.isValid && isAnyFileSelected) || undefined}
          >
            {t('account-disable-2fa-create-form-submit')}
          </OsdsButton>
        </>
      )}
    </form>
  );
};

export default FormCreateRequest;
