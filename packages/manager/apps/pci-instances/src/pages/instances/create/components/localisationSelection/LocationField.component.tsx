import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { RadioGroup } from '@ovhcloud/ods-react';
import { LocalizationCard } from '@/components/localizationCard/LocalizationCard.component';
import { mockedLocalizations } from '@/__mocks__/instance/constants';

type TLocationFieldProps = {
  value: string;
  onChange: (region: string) => void;
};

const LocationField = ({
  value: selectedRegion,
  onChange,
}: TLocationFieldProps) => {
  const { trackClick } = useOvhTracking();

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

  return (
    <RadioGroup
      value={selectedRegion}
      onValueChange={({ value }) => handleSelectRegion(value)}
    >
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(225px,_1fr))] gap-6">
        {mockedLocalizations.map(
          ({ countryCode, title, region, deploymentMode }) => (
            <LocalizationCard
              key={region}
              title={title}
              region={region}
              countryCode={countryCode}
              deploymentMode={deploymentMode}
              onSelect={handleSelectRegion}
              isSelected={selectedRegion === region}
            />
          ),
        )}
      </div>
    </RadioGroup>
  );
};

export default LocationField;
