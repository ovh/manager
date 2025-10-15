import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  RadioGroup,
} from '@ovhcloud/ods-react';
import { LocalizationCard } from '@/components/localizationCard/LocalizationCard.component';
import { deps } from '@/deps/deps';
import { selectLocalizations } from '../../view-models/localizationsViewModel';
import { useProjectId } from '@/hooks/project/useProjectId';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isMicroRegionAvailable } from '../../view-models/microRegionsViewModel';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ContinentSelection } from '../continentSelection/ContinentSelection.component';

export const LocalizationSelection = () => {
  const projectId = useProjectId();
  const { trackClick } = useOvhTracking();
  const [seeAll, setSeeAll] = useState(false);
  const { t } = useTranslation('creation');

  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [deploymentModes, selectedContinent, selectedRegion] = useWatch({
    control,
    name: ['deploymentModes', 'continent', 'macroRegion'],
  });

  const { localizations, hasMoreLocalizations } = useMemo(
    () =>
      selectLocalizations(deps)(
        projectId,
        deploymentModes,
        selectedContinent,
        seeAll ? 'total' : 'partial',
      ),
    [deploymentModes, projectId, seeAll, selectedContinent],
  );

  const isRegionAvailable = useCallback(
    (region: string) => isMicroRegionAvailable(deps)(projectId, region),
    [projectId],
  );

  const handleSelectRegion = (region: string | null) => {
    if (!region) return;
    setValue('macroRegion', region);
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_localisation', region],
    });
  };

  const handleDisplayChange = () => setSeeAll(!seeAll);

  useEffect(() => {
    const availablePreviousSelectedLocalization = localizations.find(
      (localization) => localization.region === selectedRegion,
    );

    if (!availablePreviousSelectedLocalization && localizations[0]?.region) {
      setValue('macroRegion', localizations[0].region);
    }
  }, [localizations, selectedRegion, setValue]);

  return (
    <section>
      <div className="flex justify-between pt-5 pb-5">
        <ContinentSelection />
        <Checkbox
          className="self-end"
          disabled={!hasMoreLocalizations}
          onCheckedChange={handleDisplayChange}
        >
          <CheckboxControl />
          <CheckboxLabel className="text-[--ods-color-text]">
            {t('creation:pci_instance_creation_show_all_localizations')}
          </CheckboxLabel>
        </Checkbox>
      </div>
      {selectedRegion && (
        <Controller
          name="macroRegion"
          control={control}
          render={() => (
            <div className="flex flex-col">
              <div className={clsx(seeAll && 'max-h-[450px] overflow-auto')}>
                <RadioGroup
                  value={selectedRegion}
                  onValueChange={({ value }) => handleSelectRegion(value)}
                >
                  <div className="grid grid-cols-3 gap-6">
                    {localizations.map(
                      ({ city, region, countryCode, deploymentMode }) =>
                        region && (
                          <LocalizationCard
                            key={region}
                            title={city}
                            region={region}
                            countryCode={countryCode}
                            deploymentMode={deploymentMode}
                            onSelect={handleSelectRegion}
                            isSelected={selectedRegion === region}
                            disabled={!isRegionAvailable(region)}
                          />
                        ),
                    )}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        />
      )}
    </section>
  );
};
