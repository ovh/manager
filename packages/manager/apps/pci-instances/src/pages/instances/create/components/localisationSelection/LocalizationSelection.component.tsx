import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { LocalizationCard } from '@/components/localizationCard/LocalizationCard.component';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { localizations } from './fakeData';

export const LocalizationSelection = () => {
  const { t } = useTranslation(['creation']);
  const { trackClick } = useOvhTracking();

  const handleSelect = (countryCode: TCountryIsoCode) =>
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_localisation', countryCode],
    });

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
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(225px,_1fr))] gap-6">
        {localizations.map(
          ({ countryCode, title, subtitle, deploymentMode }) => (
            <LocalizationCard
              key={countryCode}
              title={title}
              subtitle={subtitle}
              countryCode={countryCode}
              deploymentMode={deploymentMode}
              onSelect={handleSelect}
            />
          ),
        )}
      </div>
    </section>
  );
};
