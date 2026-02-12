import { useNavigate } from 'react-router-dom';

import { FormProvider, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button, Divider, Text, toast } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useShareCatalog } from '@/data/hooks/catalog/useShareCatalog';
import { useCreateShare } from '@/data/hooks/shares/useCreateShare';
import { useProjectId } from '@/hooks/useProjectId';
import { AvailabilityZoneSelection } from '@/pages/create/components/localisation/availabilityZone/AvailabilityZoneSelection.component';
import { DeploymentModeSection } from '@/pages/create/components/localisation/deploymentMode/DeploymentModeSection.component';
import { MacroRegionSelection } from '@/pages/create/components/localisation/macroRegion/MacroRegionSelection.component';
import { MicroRegionSelection } from '@/pages/create/components/localisation/microRegion/MicroRegionSelection.component';
import { NameInput } from '@/pages/create/components/name/NameInput.component';
import { PrivateNetworkSelection } from '@/pages/create/components/network/PrivateNetworkSelection.component';
import { ShareSelection } from '@/pages/create/components/share/ShareSelection.component';
import { ShareSizeSelection } from '@/pages/create/components/share/ShareSizeSelection.component';
import { useCreateShareForm } from '@/pages/create/hooks/useCreateShareForm';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import {
  selectAvailabilityZones,
  selectMicroRegions,
} from '@/pages/create/view-model/shareCatalog.view-model';
import { isApiErrorResponse } from '@/utils';

export const CreateShareForm = () => {
  const { t } = useTranslation(['create', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const projectId = useProjectId();

  const formMethods = useCreateShareForm();
  const [selectedMacroRegion, selectedMicroRegion] = useWatch({
    control: formMethods.control,
    name: ['macroRegion', 'shareData.microRegion'],
  });

  const { data: microRegionOptions } = useShareCatalog({
    select: selectMicroRegions(selectedMacroRegion),
  });

  const { data: availabilityZones } = useShareCatalog({
    select: selectAvailabilityZones(selectedMicroRegion),
  });

  const handleCreateShare = {
    onSuccess: () => {
      navigate('..');
    },
    onError: (error: Error) => {
      const errorMessage = isApiErrorResponse(error) ? error.response?.data.message : error.message;

      toast(t('create:submit.error', { error: errorMessage }), {
        color: 'warning',
        duration: Infinity,
      });
    },
  };

  const { createShare, isPending } = useCreateShare({
    projectId,
    ...handleCreateShare,
  });

  const shouldShowMicroRegionSelection = microRegionOptions && microRegionOptions.length > 1;
  const shouldShowAvailabilityZoneSelection = availabilityZones && availabilityZones.length > 0;

  const onSubmit = (data: CreateShareFormValues) => {
    createShare({
      name: data.shareData.name,
      type: data.shareData.specName,
      networkId: data.shareData.privateNetworkId,
      size: data.shareData.size,
      region: data.shareData.microRegion,
    });
  };

  const handleCancel = () => {
    navigate('..');
  };

  const isFormValid = formMethods.formState.isValid;

  return (
    <FormProvider {...formMethods}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="flex w-2/3 flex-col gap-6">
        <section>
          <Text preset="heading-4">{t('create:name.title')}</Text>
          <NameInput />
        </section>
        <Divider className="w-full" />
        <section className="flex flex-col gap-6">
          <Text preset="heading-3">{t('create:localisation.title')}</Text>
          <DeploymentModeSection />
          <MacroRegionSelection />
          {shouldShowMicroRegionSelection && <MicroRegionSelection />}
          {shouldShowAvailabilityZoneSelection && <AvailabilityZoneSelection />}
        </section>
        <Divider className="w-full" />
        <section>
          <ShareSelection />
        </section>
        <Divider className="w-full" />
        <section>
          <ShareSizeSelection />
        </section>
        <Divider className="w-full" />
        <section>
          <PrivateNetworkSelection />
        </section>
        <Divider className="w-full" />
        <section className="mt-8 flex gap-4">
          <Button type="button" variant="ghost" onClick={handleCancel}>
            {t(`${NAMESPACES.ACTIONS}:cancel`)}
          </Button>
          <Button type="submit" variant="default" disabled={!isFormValid} loading={isPending}>
            {t(`${NAMESPACES.ACTIONS}:validate`)}
          </Button>
        </section>
      </form>
    </FormProvider>
  );
};
