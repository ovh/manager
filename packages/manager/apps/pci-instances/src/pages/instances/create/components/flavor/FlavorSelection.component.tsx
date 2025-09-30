import { RadioGroup, Text } from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { FlavorsTable } from '@/components/flavorsTable/FlavorsTable.component';
import { mockedFlavors } from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { FlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/FlavorColumnsBuilder';
import { FlavorRowsBuilder } from '@/pages/instances/create/components/flavor/FlavorRowsBuilder';

export const FlavorSelection: FC = () => {
  const { t } = useTranslation('creation');
  const { control } = useFormContext<TInstanceCreationForm>();

  const columns = FlavorColumnsBuilder();
  const rows = FlavorRowsBuilder(mockedFlavors);

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
              onClick={(flavorName) => {
                field.onChange(flavorName);
              }}
            />
            <Text>{t('pci_instance_creation_select_flavor_price_hint')}</Text>
          </RadioGroup>
        )}
      />
    </section>
  );
};
