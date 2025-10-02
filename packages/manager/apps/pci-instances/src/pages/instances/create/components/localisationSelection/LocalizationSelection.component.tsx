import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Link, RadioGroup, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { LocalizationCard } from '@/components/localizationCard/LocalizationCard.component';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { selectLocalizations } from '../../view-models/selectLocalizations';
import { deps } from '@/deps/deps';
import { ContinentSelection } from '../continentSelection/ContinentSelection.component';
import { useEffect } from 'react';
import { useProjectId } from '@/hooks/project/useProjectId';

export const LocalizationSelection = () => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation']);
  const projectId = useProjectId();
  const { trackClick } = useOvhTracking();
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [deploymentModes, selectedContinent, selectedRegion] = useWatch({
    control,
    name: ['deploymentModes', 'continent', 'region'],
  });

  const localizations = selectLocalizations(deps)(
    projectId,
    deploymentModes,
    selectedContinent,
  );

  const handleSelect = (region: string) => {
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
      setValue('region', localizations[0].region);
    }
  }, [localizations, selectedRegion, setValue]);

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="mt-8 flex items-center space-x-4">
          <Text preset="heading-4">
            {t('creation:pci_instance_creation_choose_localization_title')}
          </Text>
          <HelpDrawer>
            <Text preset="paragraph" className="mb-4">
              {t('creation:pci_instance_creation_select_localization_help')}
            </Text>
            <Link
              className="visited:text-[var(--ods-color-primary-500)]"
              href="https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031"
            >
              {t('find_out_more')}
            </Link>
          </HelpDrawer>
        </div>

        <Text preset="paragraph">
          {t('creation:pci_instance_creation_select_localization_informations')}
        </Text>
      </div>
      <div className="mb-5 mt-7 w-[255px]">
        <ContinentSelection />
      </div>
      <RadioGroup value={selectedRegion}>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(225px,_1fr))] gap-6">
          {localizations.map(
            ({ city, region, countryCode, deploymentMode }) => (
              <LocalizationCard
                key={region}
                title={city}
                region={region}
                countryCode={countryCode}
                deploymentMode={deploymentMode}
                onSelect={handleSelect}
              />
            ),
          )}
        </div>
      </RadioGroup>
    </section>
  );
};
