import { useContext, useEffect, useState } from 'react';
import { usePrevious } from 'react-use';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  useAddProjectRegion,
  useRefreshProductAvailability,
} from '@ovh-ux/manager-pci-common';
import { useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';

import { OdsMessage, OdsSpinner } from '@ovhcloud/ods-components/react';
import { useContainerCreationStore } from '../useContainerCreationStore';
import { OBJECT_CONTAINER_OFFER_SWIFT } from '@/constants';
import { ContainerRegionSelector } from './ContainerRegionSelector.component';

export function RegionStep() {
  const { t } = useTranslation(['containers/add', 'pci-common', 'regions']);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const {
    form,
    stepper,
    setRegion,
    editRegion,
    submitRegion,
  } = useContainerCreationStore();
  const [addRegionMessage, setAddRegionMessage] = useState<JSX.Element>();
  const { projectId } = useParams();
  const { refresh } = useRefreshProductAvailability(projectId, ovhSubsidiary);
  const { addRegion, isPending } = useAddProjectRegion({
    projectId,
    onSuccess: () => {
      refresh();
      setRegion({
        ...form.region,
        enabled: true,
      });
      submitRegion();
      setAddRegionMessage(
        <OdsMessage className="mt-8" color="success">
          {t(
            'pci_projects_project_storages_containers_add_add_region_success',
            {
              code: form.region.name,
            },
          )}
        </OdsMessage>,
      );
    },
    onError: (error: ApiError) => {
      setAddRegionMessage(
        <OdsMessage className="mt-8" color="danger">
          {t('pci_projects_project_storages_containers_add_add_region_error', {
            message: error?.response?.data?.message || error?.message || null,
            requestId: error?.config?.headers['X-OVH-MANAGER-REQUEST-ID'],
          })}
        </OdsMessage>,
      );
    },
  });

  const submitRegionHandler = () => {
    if (!form.region.enabled) {
      addRegion(form.region.name);
    } else {
      submitRegion();
    }
  };

  const wasLocked = usePrevious(stepper.region.isLocked);
  useEffect(() => {
    const { isLocked } = stepper.region;
    if (wasLocked === true && isLocked === false) {
      setAddRegionMessage(undefined);
    }
  }, [stepper.region.isLocked]);

  return (
    <StepComponent
      title={t('pci_projects_project_storages_containers_add_region_title')}
      isOpen={stepper.region.isOpen || stepper.region.isLocked}
      isChecked={stepper.region.isChecked}
      isLocked={stepper.region.isLocked}
      order={form.offer === OBJECT_CONTAINER_OFFER_SWIFT ? 2 : 3}
      next={{
        action: submitRegionHandler,
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !form.region || isPending,
      }}
      edit={{
        action: editRegion,
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <>
        {isPending && <OdsSpinner />}
        {!isPending && (
          <ContainerRegionSelector
            offer={form.offer}
            deploymentMode={form.deploymentMode || 'region'}
            region={form.region}
            onSelectRegion={setRegion}
            isSubmitted={stepper.region.isLocked}
          />
        )}
        {addRegionMessage}
      </>
    </StepComponent>
  );
}
