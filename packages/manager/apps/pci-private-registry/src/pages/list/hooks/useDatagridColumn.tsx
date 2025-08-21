import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useParam as useSafeParams } from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';
import { TRegistry } from '@/api/data/registry';
import ActionComponent from '@/components/listing/Action.component';
import { RegistryPlan } from '@/components/listing/RegistryPlan.component';
import { RegistrySpace } from '@/components/listing/RegistrySpace.component';
import RegistryIAMStatus from '@/components/listing/RegistryIAMStatus.component';
import RegistryStatus from '@/components/listing/RegistryStatus.component';
import { useIAMFeatureAvailability } from '@/hooks/features/useIAMFeatureAvailability';
import DeploymentMode from '../DeploymentMode';
import IAMColumnLabel from '../components/IAMColumnLabel';
import { use3AZFeatureAvailability } from '@/hooks/features/use3AZFeatureAvailability';

export const useDatagridColumn = () => {
  const { t } = useTranslation();
  const { projectId } = useSafeParams('projectId');
  const { isIAMEnabled, isPending: isPendingIAM } = useIAMFeatureAvailability();

  const { is3AZEnabled, isPending: isPending3AZ } = use3AZFeatureAvailability();

  const columns: DatagridColumn<TRegistry>[] = useMemo(
    () => [
      {
        id: 'name',
        label: t('private_registry_name'),
        cell: (props) => <DataGridTextCell>{props.name}</DataGridTextCell>,
      },
      {
        id: 'id',
        label: t('private_registry_id'),
        cell: (props) => <DataGridTextCell>{props.id}</DataGridTextCell>,
      },
      {
        id: 'region',
        label: t('private_registry_region'),
        cell: (props) => <DataGridTextCell>{props.region}</DataGridTextCell>,
      },
      ...(is3AZEnabled && !isPending3AZ
        ? [
            {
              id: 'mode',
              cell: (props: TRegistry) => (
                <DeploymentMode projectId={projectId} region={props.region} />
              ),
              label: t('private_registry_containers_deployment_mode_label'),
            },
          ]
        : []),
      {
        id: 'planSize',
        label: t('private_registry_plan'),
        cell: (props) => <RegistryPlan registry={props} />,
        isSortable: false,
      },
      {
        id: 'version',
        label: t('private_registry_harbor_version'),
        cell: (props) => <DataGridTextCell>{props.version}</DataGridTextCell>,
      },

      ...(isIAMEnabled && !isPendingIAM
        ? [
            {
              id: 'iam',
              label: ((<IAMColumnLabel />) as unknown) as string,
              cell: (props: TRegistry) => (
                <RegistryIAMStatus enabled={props.iamEnabled} />
              ),
            },
          ]
        : []),
      {
        id: 'status',
        label: t('private_registry_status'),
        cell: (props) => <RegistryStatus status={props.status} />,
      },
      {
        id: 'consumption',
        label: t('private_registry_consumption'),
        cell: (props) => <RegistrySpace registry={props} />,
        isSortable: false,
      },
      {
        id: 'actions',
        label: '',
        cell: (props) => <ActionComponent registry={props} />,
      },
    ],
    [isIAMEnabled, isPendingIAM, isPending3AZ, is3AZEnabled, t],
  );

  return columns;
};
