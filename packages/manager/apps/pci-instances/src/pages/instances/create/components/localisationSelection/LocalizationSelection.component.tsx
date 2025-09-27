import {
  PageLocation,
  ButtonType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  Drawer,
  DRAWER_POSITION,
  DrawerBody,
  DrawerContent,
  DrawerTrigger,
  Link,
  RadioGroup,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { useFormContext, useWatch } from 'react-hook-form';
import { LocalizationCard } from '@/components/localizationCard/LocalizationCard.component';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { mockedLocalizations } from '@/__mocks__/instance/constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const localizationSelectionSchema = z.string();
export const localizationDefaultValue = 'eu-west-par';

export const LocalizationSelection = () => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation']);
  const { trackClick } = useOvhTracking();
  const { control } = useFormContext<TInstanceCreationForm>();
  const selectedRegion = useWatch({ control, name: 'region' });

  const handleSelect = (region: string) => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_localisation', region],
    });
  };

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="mt-8 flex items-center space-x-4">
          <Text preset="heading-4">
            {t('creation:pci_instance_creation_choose_localization_title')}
          </Text>
          <div className="w-px bg-[var(--ods-color-information-800)] h-[25px]"></div>
          <div>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm">
                  {t('common:pci_instances_common_help')}
                </Button>
              </DrawerTrigger>
              <DrawerContent position={DRAWER_POSITION.right}>
                <DrawerBody className="pb-10">
                  <Text preset="paragraph" className="mb-4">
                    {t(
                      'creation:pci_instance_creation_select_localization_help',
                    )}
                  </Text>
                  <Link
                    className="visited:text-[var(--ods-color-primary-500)]"
                    href="https://help.ovhcloud.com/csm/fr-public-cloud-deployments-modes?id=kb_article_view&sysparm_article=KB0066031"
                  >
                    {t('find_out_more')}
                  </Link>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <Text preset="paragraph">
          {t('creation:pci_instance_creation_select_localization_informations')}
        </Text>
      </div>
      <RadioGroup value={selectedRegion}>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(225px,_1fr))] gap-6">
          {mockedLocalizations.map(
            ({ countryCode, title, region, deploymentMode }) => (
              <LocalizationCard
                key={region}
                title={title}
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
