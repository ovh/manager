import { TilesInputComponent } from '@ovh-ux/manager-react-components';
import { useMemo, useState } from 'react';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Step } from '@/pages/new/hooks/useStep';

type Props = {
  regionName: string;
  step: Step;
  onSubmit: (zone: string) => void;
};

export function AvailabilityZoneStep({ regionName, step, onSubmit }: Props) {
  const { t } = useTranslation('stepper');

  // TODO: use real informations
  const zones = useMemo(
    () =>
      ['a', 'b', 'c'].map((suffix) => `${regionName.toLowerCase()}-${suffix}`),
    [regionName],
  );
  const [selectedZone, setSelectedZone] = useState<string | undefined>(
    undefined,
  );
  const displayedZones = useMemo(
    () => (!!selectedZone && step.isLocked ? [selectedZone] : zones),
    [zones, selectedZone, step],
  );

  return (
    <div>
      <TilesInputComponent<string>
        items={displayedZones}
        value={selectedZone}
        onInput={(z) => setSelectedZone(z)}
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
