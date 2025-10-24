import { RadioGroup, Text } from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { FlavorsTable } from '@/components/flavorsTable/FlavorsTable.component';
import {
  mockedFlavors,
  mockedGpuFlavors,
} from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { FlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/FlavorColumnsBuilder';
import { FlavorRowsBuilder } from '@/pages/instances/create/components/flavor/FlavorRowsBuilder';
import { GpuFlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorColumnsBuilder';
import { GpuFlavorRowsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorRowsBuilder';
import { useMemo } from 'react';
import { useFlavorCommon } from '@/pages/instances/create/components/flavor/FlavorRowUtils';

export const FlavorSelection: FC = () => {
  const { t } = useTranslation('creation');
  const { control, getValues } = useFormContext<TInstanceCreationForm>();
  const flavorType = getValues('flavorCategory');
  const { renderName, renderRadio } = useFlavorCommon();

  const { columns, rows } = useMemo(() => {
    if (flavorType === 'Cloud GPU') {
      return {
        columns: GpuFlavorColumnsBuilder(t),
        rows: GpuFlavorRowsBuilder(mockedGpuFlavors, {
          renderName,
          renderRadio,
        }),
      };
    }
    return {
      columns: FlavorColumnsBuilder(t),
      rows: FlavorRowsBuilder(mockedFlavors, { renderName, renderRadio }),
    };
  }, [flavorType, renderName, renderRadio, t]);

  return (
    <section className="mt-8">
      <Controller
        name="flavor"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value ?? undefined}
            onValueChange={(selectedFlavor) => {
              field.onChange(selectedFlavor.value);
            }}
          >
            <FlavorsTable
              columns={columns}
              rows={rows}
              caption={t('pci_instance_creation_select_flavor_title')}
              selectable
              onClick={(flavorName) => field.onChange(flavorName)}
            />
            <Text>{t('pci_instance_creation_select_flavor_price_hint')}</Text>
          </RadioGroup>
        )}
      />
    </section>
  );
};
