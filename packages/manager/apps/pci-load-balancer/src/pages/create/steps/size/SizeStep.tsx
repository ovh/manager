import {
  OsdsLink,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { PRODUCT_LINK } from '@/constants';
import SizeInputComponent from './input/SizeInput.component';
import { StepsEnum, TAddon, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { useColumnsCount } from '@/pages/create/hooks/useColumnsCount';

export type TSizeStepProps = {
  ovhSubsidiary: string;
  addons: TAddon[];
  isLoading: boolean;
};

export const SizeStep = ({
  ovhSubsidiary,
  addons,
  isLoading,
}: Readonly<TSizeStepProps>): JSX.Element => {
  const { t: tCreate } = useTranslation('load-balancer/create');
  const { t: tCommon } = useTranslation('pci-common');

  const columnsCount = useColumnsCount();

  const { trackStep } = useTracking();

  const store = useCreateStore();

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_size_title')}
      isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
      isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
      isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
      order={1}
      next={{
        action: () => {
          trackStep(1);

          store.check(StepsEnum.SIZE);
          store.lock(StepsEnum.SIZE);

          store.open(StepsEnum.REGION);
        },
        label: tCommon('common_stepper_next_button_label'),
        isDisabled: store.addon === null,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.SIZE);
          store.uncheck(StepsEnum.SIZE);
          store.open(StepsEnum.SIZE);
          store.reset(
            StepsEnum.REGION,
            StepsEnum.IP,
            StepsEnum.NETWORK,
            StepsEnum.INSTANCE,
            StepsEnum.NAME,
          );
        },
        label: tCommon('common_stepper_modify_this_step'),
      }}
    >
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tCreate('octavia_load_balancer_create_size_intro')}{' '}
        <OsdsLink
          href={PRODUCT_LINK[ovhSubsidiary] || PRODUCT_LINK.DEFAULT}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {tCreate('octavia_load_balancer_create_size_intro_link')}
        </OsdsLink>
      </OsdsText>
      {isLoading ? (
        <div className="text-center mt-6">
          <OsdsSpinner inline />
        </div>
      ) : (
        <SizeInputComponent
          addons={addons || []}
          value={store.addon}
          onInput={store.set.addon}
          columnsCount={columnsCount}
        />
      )}
    </StepComponent>
  );
};
