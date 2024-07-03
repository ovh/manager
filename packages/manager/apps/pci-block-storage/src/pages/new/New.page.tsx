import { useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  Headers,
  useProject,
  useProjectUrl,
  useStepper,
  PciDiscoveryBanner,
  useIsDiscoveryProject,
  PciFreeLocalzonesBanner,
  useMe,
} from '@ovhcloud/manager-components';
import { useHref, useParams } from 'react-router-dom';
import { useTypeStep } from '@/pages/new/hooks/steps/type';
import { useCapacityStep } from '@/pages/new/hooks/steps/capacity';
import { useNameStep } from '@/pages/new/hooks/steps/name';
import { useValidationStep } from '@/pages/new/hooks/steps/validation';
import { StepsEnum } from '@/pages/new/steps.enum';
import { useLocationStep } from '@/pages/new/hooks/steps/location';
import { TFormState } from '@/pages/new/form.type';

export const DEFAULT_FORM_STATE: TFormState = {
  step: StepsEnum.LOCATION_STEP,
  region: undefined,
  volumeType: undefined,
  volumeName: '',
  volumeCapacity: 10,
};

export default function NewPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { t: tAdd } = useTranslation('add');
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const { me } = useMe();
  const LocationStep = useLocationStep(projectId);
  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');

  const { Component: Stepper } = useStepper<StepsEnum, TFormState>({
    steps: new Map([
      [StepsEnum.LOCATION_STEP, LocationStep],
      [StepsEnum.VOLUME_TYPE_STEP, useTypeStep(projectId)],
      [StepsEnum.VOLUME_CAPACITY_STEP, useCapacityStep(projectId)],
      [StepsEnum.VOLUME_NAME_STEP, useNameStep()],
      [StepsEnum.VALIDATION_STEP, useValidationStep(projectId)],
    ]),
    state: DEFAULT_FORM_STATE,
  });

  return (
    <>
      <div className="mb-5">
        {useIsDiscoveryProject(projectId) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
      </div>
      {project && (
        <OsdsBreadcrumb
          className="mb-8"
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: backHref,
              label: t('pci_projects_project_storages_blocks_title'),
            },
            {
              label: tAdd('pci_projects_project_storages_blocks_add_title'),
            },
          ]}
        />
      )}
      <Headers title={tAdd('pci_projects_project_storages_blocks_add_title')} />
      {me && (
        <PciFreeLocalzonesBanner
          ovhSubsidiary={me.ovhSubsidiary}
          showConfirm={false}
        />
      )}
      <div className="mt-8">
        <Stepper />
      </div>
    </>
  );
}
