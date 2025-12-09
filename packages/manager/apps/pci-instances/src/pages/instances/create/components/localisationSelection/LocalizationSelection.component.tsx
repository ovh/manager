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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  isMicroRegionAvailable,
  selectMicroRegions,
} from '../../view-models/microRegionsViewModel';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ContinentSelection } from '../continentSelection/ContinentSelection.component';
import { TInstanceCreationForm } from '../../CreateInstance.schema';

export const LocalizationSelection = () => {
  const projectId = useProjectId();
  const { trackClick } = useOvhTracking();
  const [seeAll, setSeeAll] = useState(false);
  const { t } = useTranslation(['creation', 'regions']);

  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [deploymentModes, selectedContinent, selectedMacroRegion] = useWatch({
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
        selectedMacroRegion,
      ),
    [
      deploymentModes,
      projectId,
      seeAll,
      selectedContinent,
      selectedMacroRegion,
    ],
  );

  const translatedLocalizations = useMemo(
    () =>
      localizations.map(({ cityKey, ...rest }) => ({
        city: t(`regions:${cityKey}`),
        ...rest,
      })),
    [localizations, t],
  );

  const macroRegionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isRegionAvailable = useCallback(
    (region: string) => isMicroRegionAvailable(deps)(projectId, region),
    [projectId],
  );

  const updateSelection = (macroRegion: string, microRegion: string) => {
    setValue('availabilityZone', null);
    setValue('macroRegion', macroRegion);
    setValue('microRegion', microRegion);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_localisation', microRegion],
    });
  };

  const handleSelectRegion = (macroRegion: string | null) => {
    if (!macroRegion) return;
    const microRegions = selectMicroRegions(deps)(projectId, macroRegion);
    if (microRegions?.[0]) {
      updateSelection(macroRegion, microRegions[0].value);
    }
  };

  const handleDisplayChange = () => setSeeAll(!seeAll);

  useEffect(() => {
    const availablePreviousSelectedLocalization = localizations.find(
      (localization) => localization.macroRegion === selectedMacroRegion,
    );

    if (
      !availablePreviousSelectedLocalization &&
      localizations[0]?.macroRegion &&
      localizations[0].microRegion
    ) {
      setValue('macroRegion', localizations[0].macroRegion);
      setValue('microRegion', localizations[0].microRegion);
    }
  }, [localizations, selectedMacroRegion, setValue]);

  const assignMacroRegionRef = (macroRegion: string) => (
    el: HTMLDivElement | null,
  ) => {
    macroRegionRefs.current[macroRegion] = el;
  };

  useEffect(() => {
    if (!selectedMacroRegion || !seeAll) return;

    const selectedElt = macroRegionRefs.current[selectedMacroRegion];

    if (!selectedElt) return;

    selectedElt.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeAll]);

  return (
    <section>
      <div className="flex justify-between py-5">
        <ContinentSelection />
        {hasMoreLocalizations && (
          <Checkbox className="self-end" onCheckedChange={handleDisplayChange}>
            <CheckboxControl />
            <CheckboxLabel className="text-[--ods-color-text]">
              {t('creation:pci_instance_creation_show_all_localizations')}
            </CheckboxLabel>
          </Checkbox>
        )}
      </div>
      {selectedMacroRegion && (
        <Controller
          name="macroRegion"
          control={control}
          render={() => (
            <div className="flex flex-col">
              <div className={clsx(seeAll && 'max-h-[450px] overflow-auto')}>
                <RadioGroup
                  value={selectedMacroRegion}
                  onValueChange={({ value }) => handleSelectRegion(value)}
                >
                  <div className="grid grid-cols-3 gap-6">
                    {translatedLocalizations.map(
                      ({
                        city,
                        datacenterDetails,
                        macroRegion,
                        microRegion,
                        countryCode,
                        deploymentMode,
                      }) => {
                        const displayCard =
                          macroRegion && microRegion && datacenterDetails;

                        return displayCard ? (
                          <div
                            ref={assignMacroRegionRef(macroRegion)}
                            key={microRegion}
                          >
                            <LocalizationCard
                              city={city}
                              datacenterDetails={datacenterDetails}
                              macroRegion={macroRegion}
                              countryCode={countryCode}
                              deploymentMode={deploymentMode}
                              onSelect={() =>
                                updateSelection(macroRegion, microRegion)
                              }
                              isSelected={selectedMacroRegion === macroRegion}
                              disabled={!isRegionAvailable(macroRegion)}
                            />
                          </div>
                        ) : null;
                      },
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
