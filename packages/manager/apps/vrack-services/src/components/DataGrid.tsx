/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Locale } from '@ovhcloud/msc-utils';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { IcebergFetchResult } from '@ovh-ux/manager-core-api';
import {
  ProductStatus,
  ResoureceStatus,
  VrackServices,
  getListingIcebergQueryKey,
  updateVrackServices,
  updateVrackServicesQueryKey,
} from '@/api';
import { EditableText } from '@/components/EditableText';

export type DatagridProps = {
  data: VrackServices[];
};

export const Datagrid: React.FC<DatagridProps> = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services/listing');
  const environment = useEnvironment();
  const locale = environment.getUserLocale() as Locale;
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateVS,
    isLoading: isUpdateLoading,
    isError: isUpdateFailed,
  } = useMutation({
    // @ts-ignore
    mutationFn: updateVrackServices,
    queryKey: updateVrackServicesQueryKey,
    onSuccess: (result) => {
      queryClient.setQueryData(
        getListingIcebergQueryKey,
        ({
          data: listingData,
          status,
          totalCount,
        }: IcebergFetchResult<VrackServices>) => ({
          status,
          totalCount,
          data: listingData.map((vrackServices) =>
            vrackServices.id === result.data.id ? result.data : vrackServices,
          ),
        }),
      );
    },
  });

  const colorByProductStatus = {
    [ProductStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.primary,
    [ProductStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [ProductStatus.DRAFT]: ODS_THEME_COLOR_INTENT.info,
  };

  return (
    <>
      {isUpdateFailed && (
        <OsdsMessage className="mb-5" type={ODS_MESSAGE_TYPE.error}>
          {t('updateError')}
        </OsdsMessage>
      )}
      <table className="w-full border-2 border-solid border-collapse table-auto border-ods-primary-100">
        <thead>
          <tr>
            {[
              'displayName',
              'productStatus',
              'zone',
              'vrackId',
              'createdAt',
              'actions',
            ].map((headerProp) => (
              <th
                key={`th-${headerProp}`}
                className="p-6 text-center background-ods-primary-100"
              >
                <OsdsText
                  level={ODS_TEXT_LEVEL.subheading}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(headerProp)}
                </OsdsText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((currentVs: VrackServices) => (
            <tr
              key={`tr-${currentVs.id}`}
              className="bg-white border-2 border-solid border-ods-primary-100 background-ods-primary-000"
            >
              <td className="p-6 text-center">
                <EditableText
                  disabled={currentVs.resourceStatus !== ResoureceStatus.READY}
                  defaultValue={currentVs.currentState.displayName}
                  onEditSubmitted={async (value) => {
                    await updateVS({
                      vrackServicesId: currentVs.id,
                      checksum: currentVs.checksum,
                      targetSpec: {
                        displayName: value || null,
                        subnets: currentVs.currentState.subnets || [],
                      },
                    });
                    queryClient.invalidateQueries({
                      queryKey: updateVrackServicesQueryKey({
                        vrackServicesId: currentVs.id,
                        checksum: currentVs.checksum,
                        targetSpec: currentVs.targetSpec,
                      }),
                    });
                  }}
                >
                  <OsdsLink
                    color={ODS_THEME_COLOR_INTENT.primary}
                    onClick={() => navigate(`/${currentVs.id}`)}
                  >
                    {currentVs.currentState.displayName || currentVs.id}
                  </OsdsLink>
                </EditableText>
              </td>
              <td className="p-6 text-center">
                <OsdsChip
                  inline
                  color={
                    colorByProductStatus[currentVs.currentState.productStatus]
                  }
                >
                  {t(currentVs.currentState.productStatus)}
                </OsdsChip>
              </td>
              <td className="p-6 text-center">
                {t(currentVs.currentState.zone)}
              </td>
              <td className="p-6 text-center">
                {currentVs.currentState.vrackId}
              </td>
              <td className="p-6 text-center">
                {currentVs.createdAt
                  ? new Date(currentVs.createdAt).toLocaleDateString(
                      locale.replace('_', '-'),
                    )
                  : '-'}
              </td>
              <td className="p-6 text-center">
                <OsdsButton
                  inline
                  color={ODS_THEME_COLOR_INTENT.error}
                  variant={ODS_BUTTON_VARIANT.stroked}
                  type={ODS_BUTTON_TYPE.button}
                  size={ODS_BUTTON_SIZE.sm}
                  disabled={isUpdateLoading || undefined}
                  onClick={() => console.log('delete ', currentVs.id)}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if ([' ', 'Enter'].includes(event.key)) {
                      console.log('delete ', currentVs.id);
                    }
                  }}
                >
                  <OsdsIcon
                    color={ODS_THEME_COLOR_INTENT.error}
                    name={ODS_ICON_NAME.TRASH}
                    size={ODS_ICON_SIZE.xs}
                  />
                </OsdsButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
