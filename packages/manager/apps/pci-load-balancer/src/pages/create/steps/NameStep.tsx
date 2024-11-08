import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LOAD_BALANCER_NAME_REGEX } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useCreateActions } from '@/pages/create/hooks/useCreateActions';

export const NameStep = (): JSX.Element => {
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tCreate } = useTranslation('load-balancer/create');

  const [didTryCreate, setDidTryCreate] = useState(false);

  const store = useCreateStore();

  const { create, cancel } = useCreateActions();

  const [hasLengthError, hasMatchError] = [
    store.name.length > 70,
    store.name.length && !store.name.match(LOAD_BALANCER_NAME_REGEX),
  ];

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_name_field_label')}
      isOpen={store.steps.get(StepsEnum.NAME).isOpen}
      isChecked={store.steps.get(StepsEnum.NAME).isChecked}
      isLocked={store.steps.get(StepsEnum.NAME).isLocked}
      order={6}
    >
      <OsdsFormField
        className="mt-8 w-[20rem]"
        inline
        error={(() => {
          if (hasLengthError)
            return tCommon('common_field_error_maxlength', {
              maxlength: 70,
            });
          if (hasMatchError) return tCommon('common_field_error_pattern');

          return '';
        })()}
      >
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.subheading}
          slot="label"
        >
          {tCreate('octavia_load_balancer_create_name_field_label')}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._100}
          level={ODS_TEXT_LEVEL.subheading}
          slot="helper"
        >
          {tCreate('octavia_load_balancer_create_name_field_help')}
        </OsdsText>
        <OsdsInput
          value={store.name}
          type={ODS_INPUT_TYPE.text}
          onOdsValueChange={(event) => {
            store.set.name(event.detail.value as string);
          }}
          className={
            hasLengthError || hasMatchError
              ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
              : 'border-color-[var(--ods-color-default-200)] bg-white'
          }
        />
      </OsdsFormField>
      {!didTryCreate && (
        <div className="mt-8">
          <OsdsButton
            inline
            color={ODS_THEME_COLOR_INTENT.info}
            onClick={() => {
              create();
              setDidTryCreate(true);
            }}
            {...(hasLengthError || hasMatchError ? { disabled: true } : {})}
          >
            {tCreate('octavia_load_balancer_create_title')}
          </OsdsButton>
          <OsdsButton
            inline
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.info}
            onClick={cancel}
          >
            {tCommon('common_cancel')}
          </OsdsButton>
        </div>
      )}
    </StepComponent>
  );
};
