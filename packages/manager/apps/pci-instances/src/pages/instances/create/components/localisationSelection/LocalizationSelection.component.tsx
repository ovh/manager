import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { RadioGroup, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { useFormContext, useWatch } from 'react-hook-form';
import { LocalizationCard } from '@/components/localizationCard/LocalizationCard.component';
import { localizations } from './fakeData';
import { TInstanceCreationForm } from '../../CreateInstance.page';

export const localizationSelectionSchema = z.string();
export const localizationDefaultValue = 'eu-west-par';

export const LocalizationSelection = () => {
  const { t } = useTranslation(['creation']);
  const { trackClick } = useOvhTracking();
  const { control } = useFormContext<TInstanceCreationForm>();
  const selectedRegion = useWatch({ control, name: 'region' });

  const handleSelect = (region: string) => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_localisation', region],
    });
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <Text preset="heading-4">
          {t('pci_instance_creation_choose_localization_title')}
        </Text>
        <Text preset="paragraph">
          {t('pci_instance_creation_select_localization_informations')}
        </Text>
      </div>
      <RadioGroup value={selectedRegion}>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(225px,_1fr))] gap-6">
          {localizations.map(
            ({ countryCode, title, region, deploymentMode }) => (
              <LocalizationCard
                key={region}
                title={title}
                region={region}
                countryCode={countryCode}
                deploymentMode={deploymentMode}
                onSelect={handleSelect}
              />
            ),
          )}
        </div>
      </RadioGroup>
    </section>
  );
};
