import { FC, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import {
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  updateCatalogQueryData,
  useCatalog,
} from '@/data/hooks/catalog/useCatalog';
import { useAppStore } from '@/store/hooks/useAppStore';
import { TStep, TStepId } from '@/store/slices/stepper.slice';
import { useActivateRegion } from '@/data/hooks/region/useActivateRegion';
import queryClient from '@/queryClient';
import { StepTitle } from './StepTitle.component';
import { StepContent } from './StepContent.component';

type TgetRegionActivatedStatus = 'loading' | 'success' | 'error';

const regionStepId: TStepId = 'region';
const validatedRegionStepState: Partial<TStep> = {
  isChecked: true,
  isLocked: true,
  isOpen: false,
};
const editedRegionStepState: Partial<TStep> = {
  isChecked: false,
  isLocked: false,
  isOpen: true,
};

export const RegionStep: FC = () => {
  const { t } = useTranslation(['regions', 'stepper']);
  const { projectId } = useParams() as { projectId: string };
  const {
    clearNotifications,
    addInfo,
    addSuccess,
    addError,
    notifications,
  } = useNotifications();

  const {
    modelName,
    stepStateById,
    selectedRegion,
    setRegion,
    updateStep,
  } = useAppStore(
    useShallow((state) => ({
      modelName: state.modelName(),
      stepStateById: state.stepStateById(),
      updateStep: state.updateStep,
      selectedRegion: state.region(),
      setRegion: state.setRegion,
    })),
  );
  const { data } = useCatalog<'regionSelector'>(projectId, {
    selector: 'regionSelector',
    enabled: modelName !== null,
  });

  const getRegionActivationdMessage = useCallback(
    (status: TgetRegionActivatedStatus): string =>
      t(`pci_instances_regions_activation_${status}_message`, {
        region: selectedRegion?.name,
      }),
    [t, selectedRegion],
  );

  const handleRegionActivationSuccess = useCallback(
    (regionName: string) => {
      clearNotifications();
      updateCatalogQueryData(queryClient, projectId, regionName);
      addSuccess(getRegionActivationdMessage('success'));
      updateStep(regionStepId, validatedRegionStepState);
    },
    [
      addSuccess,
      clearNotifications,
      getRegionActivationdMessage,
      projectId,
      updateStep,
    ],
  );

  const handleRegionActivationError = useCallback(() => {
    clearNotifications();
    addError(getRegionActivationdMessage('error'), true);
  }, [addError, clearNotifications, getRegionActivationdMessage]);

  const { activateRegion, isPending, isSuccess } = useActivateRegion(
    projectId,
    {
      onError: handleRegionActivationError,
      onSuccess: handleRegionActivationSuccess,
    },
  );

  const handleRegionActivationLoading = useCallback(() => {
    if (isPending) addInfo(getRegionActivationdMessage('loading'));
  }, [addInfo, getRegionActivationdMessage, isPending]);

  const regionStepState = useMemo(() => stepStateById(regionStepId), [
    stepStateById,
  ]);

  const isSelectedRegionActivated = useMemo(
    (): boolean =>
      !!selectedRegion &&
      !!data?.regions.data.allAvailableRegions.find(
        (availableRegion) => availableRegion.name === selectedRegion.name,
      )?.isActivated,
    [data?.regions.data.allAvailableRegions, selectedRegion],
  );

  const handleSelectedRegion = useCallback(() => {
    if (data && selectedRegion) {
      const { allAvailableRegions } = data.regions.data;
      const isSelectedRegionAvailable = allAvailableRegions.some(
        (availableRegion) => availableRegion.name === selectedRegion.name,
      );
      if (!isSelectedRegionAvailable) {
        clearNotifications();
        setRegion(null);
      }
    }
  }, [clearNotifications, data, selectedRegion, setRegion]);

  const handleNextStep = useCallback(() => {
    clearNotifications();
    if (selectedRegion) {
      if (!isSelectedRegionActivated) {
        activateRegion(selectedRegion.name);
      } else {
        updateStep(regionStepId, validatedRegionStepState);
      }
    }
  }, [
    activateRegion,
    clearNotifications,
    isSelectedRegionActivated,
    selectedRegion,
    updateStep,
  ]);

  const handleEditStep = useCallback(
    (id: string) => {
      clearNotifications();
      updateStep(id as TStepId, editedRegionStepState);
    },
    [clearNotifications, updateStep],
  );

  useEffect(() => {
    handleSelectedRegion();
  }, [data, handleSelectedRegion, selectedRegion, setRegion]);

  useEffect(() => {
    handleRegionActivationLoading();
  }, [
    clearNotifications,
    isPending,
    addInfo,
    getRegionActivationdMessage,
    handleRegionActivationLoading,
  ]);

  return (
    <div>
      <StepComponent
        id={regionStepId}
        isOpen={!!regionStepState?.isOpen}
        isChecked={!!regionStepState?.isChecked}
        isLocked={!!regionStepState?.isLocked}
        order={2}
        title={
          <StepTitle
            isNotificationOpen={!!(isSuccess && notifications.length)}
            regionStepState={regionStepState}
          />
        }
        {...(!isPending && {
          next: {
            action: handleNextStep,
            label: t('stepper:pci_instances_stepper_next_button_label'),
            isDisabled: !selectedRegion,
          },
        })}
        {...(regionStepState?.isChecked && {
          edit: {
            action: handleEditStep,
            label: t('stepper:pci_instances_stepper_edit_step_label'),
            isDisabled: false,
          },
        })}
      >
        <StepContent
          data={data}
          isSelectedRegionActivated={isSelectedRegionActivated}
          isActivateRegionMutationLoading={isPending}
        />
      </StepComponent>
    </div>
  );
};
