import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TilesInput } from '@ovh-ux/manager-pci-common';
import { Step } from '@/pages/new/hooks/useStep';
import { TRegion } from '@/api/data/regions';
import { Button } from '@/components/button/Button';

interface AvailabilityZoneStepProps {
  region: TRegion;
  step: Step;
  onSubmit: (zone: string) => void;
}

export function AvailabilityZoneStep({
  region,
  step,
  onSubmit,
}: Readonly<AvailabilityZoneStepProps>) {
  const { t } = useTranslation('stepper');

  const elements = useMemo(
    () =>
      region.availabilityZones.map((zone) => ({
        label: zone,
      })),
    [region.availabilityZones],
  );
  const [selectedZone, setSelectedZone] = useState<
    typeof elements[number] | null
  >(null);

  return (
    <div>
      <TilesInput
        label=""
        name="availabilityZone"
        elements={elements}
        value={selectedZone}
        onChange={setSelectedZone}
        locked={step.isLocked}
      />
      {!!selectedZone && !step.isLocked && (
        <div className="mt-6">
          <Button
            size="md"
            color="primary"
            actionName="select_location_detailed"
            actionValues={[selectedZone.label, 'manually']}
            onClick={() => onSubmit(selectedZone.label)}
            className="w-fit"
          >
            {t('common_stepper_next_button_label')}
          </Button>
        </div>
      )}
    </div>
  );
}
