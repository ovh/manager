import {
  OsdsFormField,
  OsdsInput,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_INPUT_TYPE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { StepEnum } from '@/pages/create/types';
import { useStore } from '@/pages/create/store';

export default function NameStep() {
  const { t: tCreate } = useTranslation('create');
  const { t: tCommon } = useTranslation('common');
  const { t: tCommonField } = useTranslation('common_field');

  const store = useStore();

  const { act } = store;

  return (
    <StepComponent
      isOpen={store.stepper[StepEnum.NAME].isOpen}
      isLocked={store.stepper[StepEnum.NAME].isLocked}
      isChecked={store.stepper[StepEnum.NAME].isChecked}
      order={2}
      title={tCreate('private_registry_create_name_cluster')}
      next={{
        action: () => {
          act.check(StepEnum.NAME);
          act.lock(StepEnum.NAME);

          act.open(StepEnum.PLAN);
        },
        label: tCommonField('common_stepper_next_button_label'),
        isDisabled: !store.state.name.value.length,
      }}
      edit={{
        action: () => {
          act.close(StepEnum.PLAN);
          act.uncheck(StepEnum.PLAN);
          act.unlock(StepEnum.PLAN);

          act.uncheck(StepEnum.NAME);
          act.unlock(StepEnum.NAME);
        },
        label: tCommonField('common_stepper_modify_this_step'),
      }}
    >
      <OsdsFormField
        className="mt-4"
        inline
        error={
          store.state.name.touched && !store.state.name.value.length
            ? tCommonField('common_field_error_required')
            : ''
        }
      >
        <OsdsText
          slot="label"
          color={
            store.state.name.touched && !store.state.name.value.length
              ? ODS_THEME_COLOR_INTENT.error
              : ODS_THEME_COLOR_INTENT.text
          }
          className="mt-4"
          size={ODS_TEXT_SIZE._100}
        >
          {tCommon('private_registry_create_name_label')}
        </OsdsText>
        <OsdsInput
          value={store.state.name.value}
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          onOdsValueChange={(e) => {
            store.set.name.touched(true);
            store.set.name.value(e.detail.value);
          }}
          type={ODS_INPUT_TYPE.text}
          error={store.state.name.touched && !store.state.name.value.length}
          className="border"
        />
      </OsdsFormField>
    </StepComponent>
  );
}
