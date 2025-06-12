import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import {
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { TRegistry } from '@/api/data/registry';
import ActionComponent from '@/components/listing/Action.component';
import { RegistryPlan } from '@/components/listing/RegistryPlan.component';
import { RegistrySpace } from '@/components/listing/RegistrySpace.component';
import RegistryIAMStatus from '@/components/listing/RegistryIAMStatus.component';
import RegistryStatus from '@/components/listing/RegistryStatus.component';

const IAMColumnLabel = () => {
  const { t } = useTranslation();

  return (
    <span className="inline-flex">
      <OsdsText
        data-testid="registryIamColumnLabel"
        className="text-[--ods-color-primary-800] self-center"
        size={ODS_TEXT_SIZE._500}
      >
        {t('private_registry_iam_authentication_status')}
      </OsdsText>
      <span onClick={(event) => event.stopPropagation()}>
        <OsdsPopover className="whitespace-normal">
          <span slot="popover-trigger">
            <OsdsIcon
              name={ODS_ICON_NAME.HELP}
              size={ODS_ICON_SIZE.xs}
              className="ml-4 cursor-help"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </span>
          <OsdsPopoverContent>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
            >
              {t('private_registry_iam_authentication_infos_tooltip')}
            </OsdsText>
          </OsdsPopoverContent>
        </OsdsPopover>
      </span>
    </span>
  );
};

export const useDatagridColumn = () => {
  const { t } = useTranslation();

  const columns: DatagridColumn<TRegistry>[] = [
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
    {
      id: 'iam',
      label: ((<IAMColumnLabel />) as unknown) as string,
      cell: (props) => <RegistryIAMStatus enabled={props.iamEnabled} />,
    },
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
  ];

  return columns;
};
