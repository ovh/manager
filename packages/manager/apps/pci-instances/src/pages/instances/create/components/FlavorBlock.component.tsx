import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  SelectGroupItem,
  Text,
} from '@ovhcloud/ods-react';
import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import FlavorHelper from './flavor/FlavorHelper.component';
import FlavorCategory from './flavor/FlavorCategory.component';
import FlavorType from './flavor/flavorType/FlavorType.component';
import RegionSelectionModal, {
  TCustomRegionItemData,
} from './RegionSelectionModal.component';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.page';
import { mockedFlavorAvailableRegions } from '@/__mocks__/instance/constants';

const FlavorBlock: FC = () => {
  const { t } = useTranslation('creation');
  const [unavailableFlavor, setUnavailableFlavor] = useState<string | null>(
    null,
  );
  const { control, setValue } = useFormContext<TInstanceCreationForm>();

  // TODO: will be move to a select view-model
  const items: SelectGroupItem<
    TCustomRegionItemData
  >[] = mockedFlavorAvailableRegions as SelectGroupItem<
    TCustomRegionItemData
  >[];

  const handleCloseSelectRegion = () => setUnavailableFlavor(null);

  const handleSelectRegion = (
    field: ControllerRenderProps<TInstanceCreationForm, 'microRegion'>,
  ) => (region: string) => {
    field.onChange(region);
    setValue('deploymentModes', []);
    setValue('continent', 'all');
    setValue('availabilityZone', null);
  };

  return (
    <section>
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('pci_instance_creation_select_flavor_title')}
        </Text>
        <FlavorHelper />
      </div>
      <Text className="mt-4" preset="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. enim ad. (Not
        mandatory) Si besoin d’un texte explicatif/consigne de section...
      </Text>
      <div className="flex justify-between mt-6 flex-wrap">
        <div className="flex gap-x-4 gap-y-6">
          <FlavorCategory />
          <FlavorType />
        </div>
        <Checkbox className="self-end">
          <CheckboxControl />
          <CheckboxLabel className="text-[var(--ods-color-text)]">
            {t(
              'pci_instance_creation_select_flavor_include_unavailable_action',
            )}
          </CheckboxLabel>
        </Checkbox>
      </div>
      {
        // TODO: remove
        <button onClick={() => setUnavailableFlavor('B2-15')}>select</button>
      }
      {unavailableFlavor && (
        <Controller
          control={control}
          name="microRegion"
          render={({ field }) => (
            <RegionSelectionModal
              regions={items}
              onClose={handleCloseSelectRegion}
              onValidateSelect={handleSelectRegion(field)}
            >
              <Text preset="paragraph">
                <Trans
                  t={t}
                  i18nKey="pci_instance_creation_select_new_region_for_flavor"
                  values={{ flavor: unavailableFlavor }}
                  tOptions={{ interpolation: { escapeValue: true } }}
                />
              </Text>
            </RegionSelectionModal>
          )}
        />
      )}
    </section>
  );
};

export default FlavorBlock;
