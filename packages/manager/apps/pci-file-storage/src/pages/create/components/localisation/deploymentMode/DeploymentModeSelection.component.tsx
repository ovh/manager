import { KeyboardEvent } from 'react';

import clsx from 'clsx';
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BADGE_SIZE,
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxLabel,
  Text,
  Tile,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { DeploymentModeBadge } from '@/components/new-lib/deploymentModeBadge/DeploymentModeBadge.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { TDeploymentMode } from '@/domain/entities/catalog.entity';
import { selectDeploymentModes } from '@/pages/create/view-model/shareCatalog.view-model';

type TDeploymentModeSelection = {
  deploymentModes: TDeploymentMode[];
};

export const DeploymentModeSelection = () => {
  const { t } = useTranslation('create');
  const { control } = useFormContext<TDeploymentModeSelection>();
  const { data: deploymentModes } = useShareCatalog({ select: selectDeploymentModes });
  const { trackClick } = useOvhTracking();

  const handleSelect =
    (
      field: ControllerRenderProps<TDeploymentModeSelection, 'deploymentModes'>,
      selectedMode: TDeploymentMode,
    ) =>
    () => {
      const isSelected = field.value.includes(selectedMode);

      const selection = isSelected
        ? field.value.filter((value) => value !== selectedMode)
        : [...field.value, selectedMode];

      field.onChange(selection);

      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.tile,
        actionType: 'action',
        actions: ['add_share', 'select_location_mode', selectedMode],
      });
    };

  const handleKeyDown =
    (
      field: ControllerRenderProps<TDeploymentModeSelection, 'deploymentModes'>,
      selectedMode: TDeploymentMode,
    ) =>
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.code === 'Enter') {
        event.preventDefault();
        handleSelect(field, selectedMode)();
      }
    };

  return (
    <section>
      <Controller<TDeploymentModeSelection, 'deploymentModes'>
        name="deploymentModes"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            name="deploymentModes"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {deploymentModes?.map(({ mode, labelKey, descriptionKey, Image }) => {
              const isSelected = field.value.includes(mode);
              return (
                <Tile
                  key={mode}
                  selected={isSelected}
                  onClick={handleSelect(field, mode)}
                  onKeyDown={handleKeyDown(field, mode)}
                  className={clsx(
                    'flex h-full flex-col p-4 !shadow-none',
                    isSelected && '!border !border-[--ods-color-primary-600]',
                  )}
                >
                  <div className="mb-4 flex flex-wrap items-center">
                    <Checkbox className="flex w-full" checked={field.value.includes(mode)}>
                      <CheckboxControl />
                      <CheckboxLabel className="text-lg font-bold text-[--ods-color-heading]">
                        {t(`create:${labelKey}`)}
                      </CheckboxLabel>
                      <DeploymentModeBadge mode={mode} size={BADGE_SIZE.sm} />
                    </Checkbox>
                  </div>

                  <Text className="mb-4">{t(`create:${descriptionKey}`)}</Text>

                  <div className="mt-auto flex w-full justify-center">
                    <Image className="h-28" />
                  </div>
                </Tile>
              );
            })}
          </CheckboxGroup>
        )}
      />
    </section>
  );
};
