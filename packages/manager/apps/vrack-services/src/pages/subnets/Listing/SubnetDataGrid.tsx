/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsMessage,
  OsdsText,
  OsdsClipboard,
  OsdsButton,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PageLocation,
  ButtonType,
  useOvhTracking,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import {
  DatagridColumn,
  Datagrid,
  useDataGrid,
  DataGridTextCell,
  EditableText,
} from '@ovhcloud/manager-components';
import { ErrorPage } from '@/components/Error';
import {
  useVrackService,
  useUpdateVrackServices,
  isEditable,
} from '@/utils/vs-utils';
import { urls } from '@/router/constants';
import { Subnet } from '@/api';
import { PageName } from '@/utils/tracking';
import { handleClick } from '@/utils/ods-utils';

export const SubnetDatagrid: React.FC = () => {
  const { t } = useTranslation('vrack-services/subnets');
  const { id } = useParams();
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();

  const { data: vrackServices, isError, error } = useVrackService();
  const {
    updateVS,
    isPending,
    updateError,
    isErrorVisible,
  } = useUpdateVrackServices({ key: id });

  const { sorting, setSorting } = useDataGrid({
    id: 'displayName',
    desc: false,
  });

  const isVsEditable = isEditable(vrackServices);
  const subnetList = vrackServices?.currentState.subnets || [];

  const columns: DatagridColumn<Subnet>[] = [
    {
      id: 'displayName',
      label: t('displayName'),
      cell: ({ displayName, cidr }) => (
        <EditableText
          disabled={!isVsEditable}
          defaultValue={displayName}
          emptyValueLabel={t('none')}
          onEditSubmitted={async (value) => {
            await updateVS(
              {
                vrackServicesId: vrackServices.id,
                checksum: vrackServices.checksum,
                targetSpec: {
                  displayName: vrackServices.currentState.displayName || null,
                  subnets: vrackServices.currentState.subnets.map((subnet) =>
                    subnet.cidr === cidr
                      ? {
                          ...subnet,
                          displayName: value,
                        }
                      : subnet,
                  ),
                },
              },
              {
                onSuccess: () => {
                  trackPage({
                    pageType: PageType.bannerInfo,
                    pageName: PageName.pendingUpdateSubnet,
                  });
                },
                onError: () => {
                  trackPage({
                    pageType: PageType.bannerError,
                    pageName: PageName.errorUpdateSubnet,
                  });
                },
              },
            );
          }}
        >
          {displayName}
        </EditableText>
      ),
    },
    {
      id: 'cidr',
      label: t('cidr'),
      cell: ({ cidr }) => <OsdsClipboard value={cidr} inline />,
    },
    {
      id: 'serviceRange.cidr',
      label: t('serviceRange'),
      cell: ({ serviceRange }) => (
        <DataGridTextCell>{serviceRange.cidr}</DataGridTextCell>
      ),
    },
    {
      id: 'vlan',
      label: t('vlan'),
      cell: ({ vlan }) => <DataGridTextCell>{vlan}</DataGridTextCell>,
    },
    {
      id: 'actions',
      label: t('actions'),
      cell: ({ cidr }) => (
        <OsdsButton
          inline
          circle
          color={ODS_THEME_COLOR_INTENT.error}
          variant={ODS_BUTTON_VARIANT.ghost}
          type={ODS_BUTTON_TYPE.button}
          size={ODS_BUTTON_SIZE.sm}
          disabled={isPending || !isVsEditable || undefined}
          {...handleClick(() => {
            trackClick({
              location: PageLocation.datagrid,
              buttonType: ButtonType.button,
              actions: ['delete-subnet'],
            });
            navigate(
              urls.subnetsDelete
                .replace(':id', id)
                .replace(':cidr', cidr.replace('/', '_')),
            );
          })}
        >
          <OsdsIcon
            color={ODS_THEME_COLOR_INTENT.error}
            name={ODS_ICON_NAME.TRASH}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
      ),
    },
  ];

  return isError ? (
    <ErrorPage error={error} />
  ) : (
    <>
      {isErrorVisible && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('updateError', { error: updateError?.response.data.message })}
          </OsdsText>
        </OsdsMessage>
      )}
      <Datagrid
        className="overflow-x-hidden px-0"
        columns={columns}
        items={subnetList}
        totalItems={subnetList.length}
        sorting={sorting}
        onSortChange={setSorting}
        noResultLabel={t('emptyDataGridMessage')}
      />
    </>
  );
};
