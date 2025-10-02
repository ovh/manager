import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { RadioGroup } from '@ovhcloud/ods-react';
import { LocalizationCard } from '@/components/localizationCard/LocalizationCard.component';
import { deps } from '@/deps/deps';
import { selectLocalizations } from '../../view-models/selectLocalizations';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { useEffect } from 'react';

type TLocationFieldProps = {
  onChange: (region: string) => void;
};

const LocationField = ({ onChange }: TLocationFieldProps) => {
  const projectId = useProjectId();
  const { trackClick } = useOvhTracking();
  const { control } = useFormContext<TInstanceCreationForm>();
  const [deploymentModes, selectedContinent, selectedRegion] = useWatch({
    control,
    name: ['deploymentModes', 'continent', 'region'],
  });

  const localizations = selectLocalizations(deps)(
    projectId,
    deploymentModes,
    selectedContinent,
  );

  const handleSelectRegion = (region: string | null) => {
    if (!region) return;
    onChange(region);
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_localisation', region],
    });
  };

  useEffect(() => {
    const availablePreviousSelectedLocalization = localizations.find(
      (localization) => localization.region === selectedRegion,
    );

    if (!availablePreviousSelectedLocalization && localizations[0]) {
      onChange(localizations[0].region);
    }
  }, [localizations, onChange, selectedRegion]);

  return (
    <RadioGroup
      value={selectedRegion}
      onValueChange={({ value }) => handleSelectRegion(value)}
    >
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(225px,_1fr))] gap-6">
        {localizations.map(({ city, region, countryCode, deploymentMode }) => (
          <LocalizationCard
            key={region}
            title={city}
            region={region}
            countryCode={countryCode}
            deploymentMode={deploymentMode}
            onSelect={handleSelectRegion}
            isSelected={selectedRegion === region}
          />
        ))}
      </div>
    </RadioGroup>
  );
};

export default LocationField;
