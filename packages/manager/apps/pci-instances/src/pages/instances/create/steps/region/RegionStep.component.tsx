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
import { TStepId } from '@/store/slices/stepper.slice';
import { useActivateRegion } from '@/data/hooks/region/useActivateRegion';
import queryClient from '@/queryClient';
import { StepTitle } from './StepTitle.component';
import { StepContent } from './StepContent.component';

type TgetRegionActivatedStatus = 'loading' | 'success' | 'error';

const regionStepId: TStepId = 'region';

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
    stepById,
    selectedRegion,
    setRegion,
    editStep,
    validateStep,
  } = useAppStore(
    useShallow((state) => ({
      modelName: state.modelName(),
      stepById: state.stepById(),
      selectedRegion: state.region(),
      setRegion: state.setRegion,
      editStep: state.editStep,
      validateStep: state.validateStep,
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
      addSuccess(getRegionActivationdMessage('success'), true);
      validateStep(regionStepId);
    },
    [
      addSuccess,
      clearNotifications,
      getRegionActivationdMessage,
      projectId,
      validateStep,
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

  const regionStep = useMemo(() => stepById(regionStepId), [stepById]);

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
        validateStep(regionStepId);
      }
    }
  }, [
    activateRegion,
    clearNotifications,
    isSelectedRegionActivated,
    selectedRegion,
    validateStep,
  ]);

  const handleEditStep = useCallback(
    (id: string) => {
      editStep(id as TStepId);
    },
    [editStep],
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

  useEffect(() => {
    if (regionStep?.isOpen) {
      clearNotifications();
    }
  }, [regionStep?.isOpen, clearNotifications]);

  return (
    <div>
      <StepComponent
        id={regionStepId}
        isOpen={!!regionStep?.isOpen}
        isChecked={!!regionStep?.isChecked}
        isLocked={!!regionStep?.isLocked}
        order={regionStep?.order ?? 2}
        title={
          <StepTitle
            isNotificationOpen={!!(isSuccess && notifications.length)}
            regionStep={regionStep}
          />
        }
        {...(!isPending && {
          next: {
            action: handleNextStep,
            label: t('stepper:pci_instances_stepper_next_button_label'),
            isDisabled: !selectedRegion,
          },
        })}
        {...(regionStep?.isChecked && {
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
          isPending={isPending}
        />
      </StepComponent>
    </div>
  );
};
