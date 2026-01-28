import { useEffect, useMemo } from 'react';

import clsx from 'clsx';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RadioGroup } from '@ovhcloud/ods-react';

import { TRegionData } from '@/adapters/catalog/left/shareCatalog.data';
import { LocalizationCard } from '@/components/new-lib/localizationCard/LocalizationCard.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { ContinentSelection } from '@/pages/create/components/localisation/macroRegion/ContinentSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectLocalizations } from '@/pages/create/view-model/shareCatalog.view-model';

export const MacroRegionSelection = () => {
  const { t } = useTranslation(['regions']);

  const { control, setValue } = useFormContext<CreateShareFormValues>();
  const [deploymentModes, selectedContinent, selectedMacroRegion] = useWatch({
    control,
    name: ['deploymentModes', 'continent', 'macroRegion'],
  });

  const { data: localizations = [] } = useShareCatalog<TRegionData[]>({
    select: selectLocalizations({ deploymentModes, continentId: selectedContinent }),
  });

  const translatedLocalizations = useMemo(
    () =>
      localizations.map(({ cityKey, ...rest }) => ({
        city: t(`regions:${cityKey}`),
        ...rest,
      })),
    [localizations, t],
  );

  const updateSelection = (macroRegion: string) => {
    setValue('macroRegion', macroRegion);
  };

  useEffect(() => {
    const availablePreviousSelectedLocalization = (localizations ?? []).find(
      (localization) => localization.macroRegion === selectedMacroRegion,
    );

    const firstAvailableLocation = localizations.find((loc) => loc.available);

    if (!availablePreviousSelectedLocalization && firstAvailableLocation?.macroRegion) {
      setValue('macroRegion', firstAvailableLocation.macroRegion);
    }
  }, [localizations, selectedMacroRegion, setValue]);

  return (
    <section>
      <div className="flex justify-between py-5">
        <ContinentSelection />
      </div>
      {selectedMacroRegion && (
        <Controller
          name="macroRegion"
          control={control}
          render={() => (
            <div className="flex flex-col">
              <div className={clsx('max-h-[450px] overflow-auto')}>
                <RadioGroup value={selectedMacroRegion}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {translatedLocalizations.map(
                      ({
                        city,
                        datacenterDetails,
                        macroRegion,
                        countryCode,
                        deploymentMode,
                        available,
                      }) => {
                        const displayCard = macroRegion && datacenterDetails;

                        return displayCard ? (
                          <LocalizationCard
                            key={`${city}_${macroRegion}`}
                            city={city}
                            datacenterDetails={datacenterDetails}
                            macroRegion={macroRegion}
                            countryCode={countryCode}
                            deploymentMode={deploymentMode}
                            onSelect={() => updateSelection(macroRegion)}
                            disabled={!available}
                            selected={macroRegion === selectedMacroRegion}
                          />
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
