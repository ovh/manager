import {
  Link,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useFormContext, useWatch } from 'react-hook-form';
import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { useEffect, useState } from 'react';
import { PciCard } from '@/components/pciCard/PciCard.component';
import { useGuideLink } from '@/hooks/url/useGuideLink';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import {
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

type TAvailabilityZoneSelection = { availabilityZones: string[] };
type TChoice = 'companyChoice' | 'userChoice';

export const AvailabilityZoneSelection = ({
  availabilityZones,
}: TAvailabilityZoneSelection) => {
  const { t } = useTranslation([NAMESPACES.ONBOARDING, 'creation']);
  const [choice, setChoice] = useState<TChoice>('companyChoice');
  const guide = useGuideLink('AVAILABILITY_ZONES');
  const { trackClick } = useOvhTracking();

  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedAvailabilityZone = useWatch({
    control,
    name: 'availabilityZone',
  });

  const handleAvailabilityZoneChange = (zone: string | null) => {
    if (zone) {
      setValue('availabilityZone', zone);
      trackClick({
        location: PageLocation.funnel,
        actionType: 'action',
        actions: [
          'box',
          'add_instance',
          'select_location',
          '3AZ-manually-selected',
          zone,
        ],
      });
    }
  };

  const setDefaultAvailabilityZoneValue = () => {
    if (availabilityZones[0])
      setValue('availabilityZone', availabilityZones[0]);
  };

  const handleChoiceChange = (choice: RadioValueChangeDetail) => {
    if (choice.value) {
      setChoice(choice.value as TChoice);
    }
    if (choice.value === 'companyChoice') {
      setValue('availabilityZone', null);
      trackClick({
        location: PageLocation.funnel,
        actionType: 'action',
        actions: ['box', 'add_instance', 'select_location', '3AZ-automated'],
      });
    }
    if (choice.value === 'userChoice') {
      setDefaultAvailabilityZoneValue();
      trackClick({
        location: PageLocation.funnel,
        actionType: 'action',
        actions: ['box', 'add_instance', 'select_location', '3AZ-manually'],
      });
    }
  };

  useEffect(() => {
    if (!selectedAvailabilityZone) return;

    const availablePreviousAvailabilityZone = availabilityZones.includes(
      selectedAvailabilityZone,
    );

    if (!availablePreviousAvailabilityZone && availabilityZones[0])
      setValue('availabilityZone', availabilityZones[0]);
  }, [availabilityZones, selectedAvailabilityZone, setValue]);

  useEffect(() => {
    setChoice('companyChoice');
    return () => {
      setValue('availabilityZone', null);
    };
  }, [availabilityZones, setValue]);

  return (
    <section className="pb-5 pt-9">
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-4">
          <Text preset="heading-4">
            {t('creation:pci_instance_creation_choose_availabilityZone_title')}
          </Text>
          <HelpDrawer>
            <Text className="mb-4">
              {t(
                'creation:pci_instance_creation_availabilityZone_help_description_p1',
              )}
            </Text>
            <Text className="mb-4">
              {t(
                'creation:pci_instance_creation_availabilityZone_help_description_p2',
              )}
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
          {t(
            'creation:pci_instance_creation_choose_availabilityZone_informations',
          )}
        </Text>
      </div>
      <RadioGroup
        value={choice}
        onValueChange={handleChoiceChange}
        className="pt-6"
      >
        <Radio value="companyChoice">
          <RadioControl />
          <RadioLabel className="text-[--ods-color-text]">
            {t('creation:pci_instance_creation_availabilityZone_choose_for_me')}
          </RadioLabel>
        </Radio>
        <Radio value="userChoice">
          <RadioControl />
          <RadioLabel className="text-[--ods-color-text]">
            {t('creation:pci_instance_creation_availabilityZone_user_choice')}
          </RadioLabel>
        </Radio>
      </RadioGroup>
      {choice === 'userChoice' && (
        <RadioGroup
          value={selectedAvailabilityZone ?? ''}
          onValueChange={({ value }) => handleAvailabilityZoneChange(value)}
        >
          <div className="flex gap-6 pt-6">
            {availabilityZones.map((zone) => (
              <PciCard
                compact
                key={zone}
                selectable
                selected={selectedAvailabilityZone === zone}
                onClick={() => handleAvailabilityZoneChange(zone)}
              >
                <PciCard.Header>
                  <Radio value={zone}>
                    <RadioControl />
                    <RadioLabel>
                      <Text>{zone}</Text>
                    </RadioLabel>
                  </Radio>
                </PciCard.Header>
              </PciCard>
            ))}
          </div>
        </RadioGroup>
      )}
    </section>
  );
};
