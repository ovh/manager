import {
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxLabel,
  Text,
  Tile,
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
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import { selectDeploymentModes } from '../../view-models/deploymentModeViewModel';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

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
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
            }}
          >
            {deploymentModes.map(
              ({ mode, titleKey, descriptionKey, Image }) => {
                const isSelected = field.value.includes(mode);
                return (
                  <Tile
                    key={mode}
                    selected={isSelected}
                    className={clsx(
                      'flex h-full flex-col p-6 !shadow-none',
                      isSelected && '!border !border-[--ods-color-primary-600]',
                    )}
                    onClick={handleSelect(field, mode)}
                  >
                    <div className="mb-4 flex flex-wrap items-center">
                      <Checkbox
                        value={mode}
                        checked={isSelected}
                        className="pointer-events-none mr-6"
                      >
                        <CheckboxControl />
                        <CheckboxLabel className="text-lg font-bold text-[--ods-color-heading]">
                          {t(`common:${titleKey}`)}
                        </CheckboxLabel>
                      </Checkbox>
                      <DeploymentModeBadge mode={mode} />
                    </div>
                    <Text className="mb-4">
                      {t(`common:${descriptionKey}`)}
                    </Text>
                    <div className="mt-auto flex w-full justify-center">
                      <Image className="h-28" />
                    </div>
                  </Tile>
                );
              },
            )}
          </CheckboxGroup>
        )}
      />
    </section>
  );
};
