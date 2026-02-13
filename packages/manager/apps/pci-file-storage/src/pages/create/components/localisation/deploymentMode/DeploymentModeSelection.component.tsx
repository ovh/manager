import { KeyboardEvent } from 'react';

import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BADGE_SIZE,
  Checkbox,
  CheckboxControl,
  CheckboxGroup,
  CheckboxLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { DeploymentModeBadge } from '@/components/new-lib/deploymentModeBadge/DeploymentModeBadge.component';
import { PciCard } from '@/components/new-lib/pciCard/PciCard.component';
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
      if (event.code === 'Enter') handleSelect(field, selectedMode)();
    };

  return (
    <section>
      <Controller<TDeploymentModeSelection, 'deploymentModes'>
        name="deploymentModes"
        control={control}
        render={({ field }) => (
          <CheckboxGroup name="deploymentModes" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {deploymentModes?.map(({ mode, labelKey, descriptionKey, Image }) => (
              <PciCard
                selectable
                selected={field.value.includes(mode)}
                compact
                key={mode}
                onClick={handleSelect(field, mode)}
                onKeyDown={handleKeyDown(field, mode)}
              >
                <PciCard.Header>
                  <Checkbox className="flex w-full" checked={field.value.includes(mode)}>
                    <CheckboxControl />
                    <CheckboxLabel className="text-lg font-bold text-[--ods-color-heading]">
                      {t(`create:${labelKey}`)}
                    </CheckboxLabel>
                    <DeploymentModeBadge mode={mode} size={BADGE_SIZE.sm} />
                  </Checkbox>
                </PciCard.Header>

                <PciCard.Content className="h-16">
                  <Text preset={TEXT_PRESET.small}>{t(`create:${descriptionKey}`)}</Text>
                </PciCard.Content>

                <PciCard.Footer className="flex justify-center w-full">
                  <Image className="h-20" />
                </PciCard.Footer>
              </PciCard>
            ))}
          </CheckboxGroup>
        )}
      />
    </section>
  );
};
