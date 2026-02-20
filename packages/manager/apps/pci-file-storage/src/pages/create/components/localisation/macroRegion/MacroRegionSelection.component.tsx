import { useCallback, useEffect, useMemo } from 'react';

import clsx from 'clsx';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RadioGroup, Text } from '@ovhcloud/ods-react';

import { LocalizationCard } from '@/components/new-lib/localizationCard/LocalizationCard.component';
import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { ContinentSelection } from '@/pages/create/components/localisation/macroRegion/ContinentSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { TRegionData } from '@/pages/create/view-model/shareCatalog.view-model';
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

  const updateSelection = useCallback(
    (macroRegion: string, firstAvailableMicroRegion: string | undefined) => {
      setValue('macroRegion', macroRegion);
      if (firstAvailableMicroRegion) setValue('shareData.microRegion', firstAvailableMicroRegion);
    },
    [setValue],
  );

  useEffect(() => {
    const availablePreviousSelectedLocalization = (localizations ?? []).find(
      (localization) => localization.macroRegion === selectedMacroRegion,
    );

    const firstAvailableLocation = localizations.find((loc) => loc.available);

    if (!availablePreviousSelectedLocalization && firstAvailableLocation?.macroRegion) {
      updateSelection(
        firstAvailableLocation.macroRegion,
        firstAvailableLocation.firstAvailableMicroRegion,
      );
    } else if (!firstAvailableLocation) {
      setValue('macroRegion', undefined);
      setValue('shareData.microRegion', '');
    }
  }, [localizations, selectedMacroRegion, updateSelection]);

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 py-5">
        <Text preset="heading-4">{t('create:localisation.macroRegion.title')}</Text>
        <ContinentSelection />
      </div>
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
                      firstAvailableMicroRegion,
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
                          onSelect={() => updateSelection(macroRegion, firstAvailableMicroRegion)}
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
    </section>
  );
};
