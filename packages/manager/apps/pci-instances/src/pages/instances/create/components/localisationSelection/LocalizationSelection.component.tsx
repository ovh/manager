import { Link, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { useGuideLink } from '@/hooks/url/useGuideLink';
import LocationField from './LocationField.component';
import { ContinentSelection } from '../continentSelection/ContinentSelection.component';

export const LocalizationSelection = () => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation']);
  const { control } = useFormContext<TInstanceCreationForm>();
  const guide = useGuideLink('LOCATION');

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
              href={guide}
              target="_blank"
            >
              {t('find_out_more')}
            </Link>
          </HelpDrawer>
        </div>

        <Text preset="paragraph">
          {t('creation:pci_instance_creation_select_localization_informations')}
        </Text>
        <div className="pt-7 pb-5">
          <ContinentSelection />
        </div>
      </div>
      <Controller
        name="macroRegion"
        control={control}
        render={({ field }) => <LocationField onChange={field.onChange} />}
      />
    </section>
  );
};
