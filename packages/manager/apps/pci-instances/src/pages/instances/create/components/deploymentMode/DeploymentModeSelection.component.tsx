import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxLabel,
  Text,
} from '@ovhcloud/ods-react';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { PciCard } from '@/components/pciCard/PciCard.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import { selectDeploymentModes } from '../../view-models/deploymentModeViewModel';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type TDeploymentModeSelection = {
  deploymentModes: TDeploymentMode[];
};

export const DeploymentModeSelection = () => {
  const projectId = useProjectId();
  const { t } = useTranslation('common');
  const { control } = useFormContext<TDeploymentModeSelection>();
  const deploymentModes = useMemo(
    () => selectDeploymentModes(deps)(projectId),
    [projectId],
  );
  const { trackClick } = useOvhTracking();

  const handleSelect = (
    field: ControllerRenderProps<TDeploymentModeSelection, 'deploymentModes'>,
    selectedMode: TDeploymentMode,
  ) => () => {
    const isSelected = field.value.includes(selectedMode);

    const selection = isSelected
      ? field.value.filter((value) => value !== selectedMode)
      : [...field.value, selectedMode];

    field.onChange(selection);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_location_mode', selectedMode],
    });
  };

  return (
    <section className="mt-6">
      <Controller<TDeploymentModeSelection, 'deploymentModes'>
        name="deploymentModes"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            name="deploymentModes"
            className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
            defaultValue={field.value}
            onValueChange={(value) => {
              field.onChange(value);
            }}
          >
            {deploymentModes.map(
              ({ mode, titleKey, descriptionKey, Image }) => (
                <PciCard
                  selectable
                  selected={field.value.includes(mode)}
                  className="h-full"
                  key={mode}
                  onClick={handleSelect(field, mode)}
                >
                  <PciCard.Header>
                    <Checkbox
                      className="w-full"
                      checked={field.value.includes(mode)}
                    >
                      <CheckboxControl />
                      <CheckboxLabel className="text-lg font-bold text-[--ods-color-heading]">
                        {t(`common:${titleKey}`)}
                      </CheckboxLabel>
                    </Checkbox>
                    <DeploymentModeBadge mode={mode} />
                  </PciCard.Header>

                  <PciCard.Content className="justify-between">
                    <Text>{t(`common:${descriptionKey}`)}</Text>
                    <div className="mt-4 flex justify-center">
                      <Image />
                    </div>
                  </PciCard.Content>
                </PciCard>
              ),
            )}
          </CheckboxGroup>
        )}
      />
    </section>
  );
};
