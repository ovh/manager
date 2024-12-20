import { TilesInputComponent } from '@ovh-ux/manager-react-components';
import { useState } from 'react';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Step } from '@/pages/new/hooks/useStep';
import { TRegion } from '@/api/data/regions';

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

  const [selectedZone, setSelectedZone] = useState<string | undefined>(
    undefined,
  );

  return (
    <div>
      <TilesInputComponent<string>
        items={
          step.isLocked && selectedZone
            ? [selectedZone]
            : region.availabilityZones
        }
        value={selectedZone}
        onInput={setSelectedZone}
        label={(z) => (
          <div className="w-full">
            <div className="border-solid border-0 py-3">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {z}
              </OsdsText>
            </div>
          </div>
        )}
      />
      {!!selectedZone && !step.isLocked && (
        <div className="mt-6">
          <OsdsButton
            size={ODS_BUTTON_SIZE.md}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => onSubmit(selectedZone)}
            className="w-fit"
          >
            {t('common_stepper_next_button_label')}
          </OsdsButton>
        </div>
      )}
    </div>
  );
}
