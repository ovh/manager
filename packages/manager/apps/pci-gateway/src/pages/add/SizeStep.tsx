import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  StepComponent,
  TilesInputComponent,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { useRegionGatewayAddons } from '@/api/hooks/useGateways/useGateways';
import { TProductAddonDetail } from '@/types/addon.type';
import SizeLabel from '@/components/size/SizeLabel.component';

export const SizeStep = (): JSX.Element => {
  const { projectId } = useParams();

  const {
    environment,
    shell: { tracking },
  } = useContext(ShellContext);

  const { ovhSubsidiary } = environment.getUser();

  const { t } = useTranslation(['add', 'stepper', 'catalog-selector']);

  const store = useNewGatewayStore();

  const addons = useRegionGatewayAddons(
    ovhSubsidiary,
    projectId,
    store.form.regionName,
  );

  return (
    <StepComponent
      id={StepsEnum.SIZE}
      order={2}
      isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
      isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
      isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
      title={t('pci_projects_project_public_gateways_add_size_sub_title')}
      subtitle={
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_public_gateways_add_size_info')}
        </OsdsText>
      }
      next={{
        action: (id) => {
          store.updateStep.check(id as StepsEnum);
          store.updateStep.lock(id as StepsEnum);
          store.updateStep.open(StepsEnum.NETWORK);
          tracking.trackClick({
            name: 'public-gateway_add_select-type',
            type: 'action',
          });
        },
        label: t('stepper:common_stepper_next_button_label'),
        isDisabled: !store.form.size,
      }}
      edit={{
        action: (id) => {
          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateStep.close(StepsEnum.NETWORK);

          store.updateForm.size(undefined);
          store.updateForm.network(undefined, undefined);
        },
        label: t('stepper:common_stepper_modify_this_step'),
        isDisabled: false,
      }}
    >
      <TilesInputComponent<TProductAddonDetail, string, string>
        id="gateway-size-input"
        value={addons.find((addon) => addon.size === store.form.size)}
        items={addons}
        label={(props) => <SizeLabel {...props} />}
        onInput={(item) => store.updateForm.size(item.size)}
      />
    </StepComponent>
  );
};
