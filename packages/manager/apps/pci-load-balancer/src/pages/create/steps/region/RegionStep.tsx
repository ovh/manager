import {
  OsdsLink,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ShapesInputComponent } from '@ovh-ux/manager-pci-common';
import { TRegion } from '@/api/hook/useRegions';
import { REGION_AVAILABILITY_LINK } from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { LabelComponent } from './components/Label.component';
import { StackLabelComponent } from './components/StackLabel.component';
import { GroupLabelComponent } from './components/GroupLabel.component';
import { StackTitleComponent } from '@/pages/create/steps/region/components/StackTitle.component';
import { useColumnsCount } from '@/pages/create/hooks/useColumnsCount';

export type TRegionStepProps = {
  isLoading: boolean;
  isMobile: boolean;
  regions: Map<string, TRegion[]>;
  ovhSubsidiary: string;
};
export const RegionStep = ({
  isLoading,
  isMobile,
  regions,
  ovhSubsidiary,
}: Readonly<TRegionStepProps>): JSX.Element => {
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tCreate } = useTranslation('load-balancer/create');

  const columnsCount = useColumnsCount();

  const { trackStep } = useTracking();

  const store = useCreateStore();

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_region_title')}
      isOpen={store.steps.get(StepsEnum.REGION).isOpen}
      isChecked={store.steps.get(StepsEnum.REGION).isChecked}
      isLocked={store.steps.get(StepsEnum.REGION).isLocked}
      order={2}
      next={{
        action: () => {
          trackStep(2);

          store.check(StepsEnum.REGION);
          store.lock(StepsEnum.REGION);

          store.open(StepsEnum.IP);
        },
        label: tCommon('common_stepper_next_button_label'),
        isDisabled: store.region === null,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.REGION);
          store.uncheck(StepsEnum.REGION);
          store.open(StepsEnum.REGION);
          store.reset(
            StepsEnum.IP,
            StepsEnum.NETWORK,
            StepsEnum.INSTANCE,
            StepsEnum.NAME,
          );
        },
        label: tCommon('common_stepper_modify_this_step'),
      }}
    >
      <div className="mb-4">
        <OsdsText
          size={ODS_TEXT_SIZE._400}
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tCreate('octavia_load_balancer_create_region_intro')}{' '}
          <OsdsLink
            href={
              REGION_AVAILABILITY_LINK[ovhSubsidiary] ||
              REGION_AVAILABILITY_LINK.DEFAULT
            }
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {tCreate('octavia_load_balancer_create_region_link')}
          </OsdsLink>
        </OsdsText>
      </div>
      {isLoading ? (
        <div className="text-center mt-6">
          <OsdsSpinner inline />
        </div>
      ) : (
        <ShapesInputComponent<TRegion>
          items={regions?.get(store.addon?.code) || []}
          onInput={(region) => store.set.region(region)}
          value={store.region}
          columnsCount={columnsCount}
          item={{
            LabelComponent,
            getId: (item) => item.name,
            isDisabled: (item) => !item.isEnabled,
          }}
          stack={{
            by: (item) => item?.macroName || '',
            LabelComponent: StackLabelComponent,
            TitleComponent: StackTitleComponent,
          }}
          group={{
            by: (item) => item.continent,
            LabelComponent: GroupLabelComponent,
          }}
          isMobile={isMobile}
        />
      )}
    </StepComponent>
  );
};
