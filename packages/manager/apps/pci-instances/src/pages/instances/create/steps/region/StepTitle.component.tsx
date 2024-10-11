import { FC, useMemo } from 'react';
import { OsdsDivider } from '@ovhcloud/ods-components/react';
import {
  Notifications,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { DeepReadonly } from '@/types/utils.type';
import { useAppStore } from '@/store/hooks/useAppStore';
import { TStep } from '@/store/slices/stepper.slice';

type TStepTitleProps = DeepReadonly<{
  isNotificationOpen: boolean;
  regionStepState?: TStep;
}>;

export const StepTitle: FC<TStepTitleProps> = ({
  isNotificationOpen,
  regionStepState,
}) => {
  const { t } = useTranslation('regions');
  const { translateMacroRegion } = useTranslatedMicroRegions();

  const { selectedRegion } = useAppStore(
    useShallow((state) => ({
      selectedRegion: state.region(),
    })),
  );

  const regionStepTitle = useMemo(
    () =>
      selectedRegion && !regionStepState?.isOpen
        ? t('pci_instances_regions_chosen_region_message', {
            region: translateMacroRegion(selectedRegion.name),
          })
        : t('pci_instances_regions_select_localization'),
    [regionStepState?.isOpen, selectedRegion, t, translateMacroRegion],
  );

  return (
    <>
      {regionStepTitle}
      {isNotificationOpen && (
        <>
          <OsdsDivider />
          <Notifications />
          <OsdsDivider />
        </>
      )}
    </>
  );
};
