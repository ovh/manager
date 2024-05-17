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
import { getCurrentUser } from '@/utils/userUtil';
import { FormDocumentFieldList } from './FormDocumentFields/FormDocumentFieldList';

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

  const [selectedByFRLegalForm, setSelectedByFRLegalForm] = useState<string>(
    null,
  );

  const files = flatFiles(watch());
  const isAnyFileSelected = files.length > 0;

  const handleLegalFormChange = (
    e: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => {
    reset();
    setSelectedByFRLegalForm(e.target.value as string);
  };

  const isFROtherLegalForm =
    user.legalform === 'other' && user.subsidiary === 'FR';
  const legalForm = isFROtherLegalForm ? selectedByFRLegalForm : user.legalform;

  return (
    <form onSubmit={handleSubmit((data) => console.log(flatFiles(data)))}>
      {isFROtherLegalForm ? (
        <div className="my-6">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_TEXT_SIZE._500}
          >
            {tdoc('field-1')}
          </OsdsText>
          <OsdsSelect
            onOdsValueChange={handleLegalFormChange}
            value={selectedByFRLegalForm}
          >
            <span slot="placeholder">
              {t('account-disable-2fa-create-form-select-legalform-type')}
            </span>
            <OsdsSelectOption value="association">
              {t('account-disable-2fa-create-form-legalform-association')}
            </OsdsSelectOption>
            <OsdsSelectOption value="other">
              {t('account-disable-2fa-create-form-legalform-other')}
            </OsdsSelectOption>
          </OsdsSelect>
        </div>
      ) : (
        <></>
      )}

      {legalForm && (
        <>
          <FormDocumentFieldList
            control={control}
            legalForm={legalForm}
            subsidiary={user.subsidiary}
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
