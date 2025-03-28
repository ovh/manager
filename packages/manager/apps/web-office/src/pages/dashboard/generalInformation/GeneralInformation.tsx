import { useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DashboardTile, ManagerButton } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { UserNativeType } from '@/api/users/type';
import {
  useOfficeLicenseDetail,
  useOfficeUsers,
  useOfficeServiceInfos,
  useOfficeServiceType,
  useDateFnsLocale,
  useOfficeParentTenant,
} from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import { OfficeServiceState } from '@/components/layout-helpers/Dashboard/OfficeServiceState.component';

export default function GeneralInformation() {
  const { t } = useTranslation(['dashboard/general-information', 'common']);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const locale = useDateFnsLocale();
  const serviceType = useOfficeServiceType(serviceName);

  const {
    data: licenseDetail,
    isLoading: isLoadingLicenseDetail,
  } = useOfficeLicenseDetail();
  const {
    data: serviceInfos,
    isLoading: isLoadingServiceInfos,
  } = useOfficeServiceInfos();
  const { data: dataUsers, isLoading: isLoadingUsers } = useOfficeUsers();
  const {
    data: dataParentTenant,
    isLoading: isLoadingParentTenant,
  } = useOfficeParentTenant();

  const itemsGeneralInfos = useMemo(() => {
    return [
      {
        id: 'displayName',
        label: t('common:displayName'),
        value: (
          <>
            {!isLoadingParentTenant && (
              <div className="flex justify-between items-center gap-2">
                <OdsText
                  preset={ODS_TEXT_PRESET.paragraph}
                  className="break-all"
                >
                  {dataParentTenant?.displayName}
                </OdsText>
                <div className="min-w-fit">
                  {licenseDetail && licenseDetail && (
                    <ManagerButton
                      id="edit-name"
                      size={ODS_BUTTON_SIZE.sm}
                      label=""
                      variant={ODS_BUTTON_VARIANT.ghost}
                      color={ODS_BUTTON_COLOR.primary}
                      onClick={() => navigate('./edit-name')}
                      icon={ODS_ICON_NAME.pen}
                      urn={licenseDetail?.iam?.urn}
                      iamActions={[
                        ...(licenseDetail?.tenantServiceName
                          ? [IAM_ACTIONS.licencePrepaid.putParentTenant]
                          : [IAM_ACTIONS.licencePostPaid.edit]),
                      ]}
                    />
                  )}
                </div>
              </div>
            )}
            {isLoadingParentTenant && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
      {
        id: 'serviceName',
        label: t('common:serviceName'),
        value: (
          <>
            {!isLoadingParentTenant && (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {dataParentTenant?.serviceName}
              </OdsText>
            )}
            {isLoadingParentTenant && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
      {
        id: 'servicetype',
        label: t('common:serviceType'),
        value: (
          <>
            {!isLoadingLicenseDetail && (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t(`common:${serviceType}`)}
              </OdsText>
            )}
            {isLoadingLicenseDetail && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
    ];
  }, [licenseDetail, serviceType, dataParentTenant]);

  const itemsStatistics = useMemo(() => {
    return [
      {
        id: 'license_number',
        label: t('common:license_number'),
        value: (
          <div className="flex flex-col">
            {!isLoadingUsers &&
              dataUsers?.length > 0 &&
              dataUsers
                .reduce((accumulator, currentValue) => {
                  const findIndex = accumulator.findIndex(
                    (elm: UserNativeType) =>
                      elm.licences === currentValue.licences[0],
                  );
                  if (findIndex === -1) {
                    accumulator.push({
                      licences: currentValue.licences[0],
                      number: 1,
                    });
                  } else {
                    accumulator[findIndex].number += 1;
                  }
                  return accumulator;
                }, [])
                ?.map((stats: { licences: string; number: number }) => (
                  <OdsText
                    key={stats.licences}
                    preset={ODS_TEXT_PRESET.paragraph}
                  >
                    <strong>{stats.licences} : </strong>
                    {stats.number}
                  </OdsText>
                ))}
            {!isLoadingUsers && dataUsers?.length === 0 && (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('common:noAccountOffer')}
              </OdsText>
            )}
            {isLoadingUsers && (
              <div className="flex flex-col gap-2">
                <OdsSkeleton></OdsSkeleton>
                <OdsSkeleton></OdsSkeleton>
              </div>
            )}
          </div>
        ),
      },
    ];
  }, [dataUsers]);

  const itemsBillingInfos = useMemo(() => {
    return [
      {
        id: 'creation_date',
        label: t('common:creation_date'),
        value: (
          <>
            {!isLoadingServiceInfos && (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {serviceInfos?.creation
                  ? format(serviceInfos?.creation, 'PPP', { locale })
                  : ''}
              </OdsText>
            )}
            {isLoadingServiceInfos && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
      {
        id: 'status',
        label: t('common:status'),
        value: (
          <>
            {!isLoadingServiceInfos && (
              <OfficeServiceState state={serviceInfos?.status} />
            )}
            {isLoadingServiceInfos && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
      ...(serviceType === 'prepaid'
        ? [
            {
              id: 'renew_date',
              label: t('common:renew_date'),
              value: (
                <>
                  {!isLoadingServiceInfos && (
                    <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                      {serviceInfos?.expiration
                        ? format(serviceInfos?.expiration, 'PPP', { locale })
                        : ''}
                    </OdsText>
                  )}
                  {isLoadingServiceInfos && <OdsSkeleton></OdsSkeleton>}
                </>
              ),
            },
          ]
        : []),
    ];
  }, [serviceInfos]);

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-3">
        <DashboardTile
          data-testid="general_informations"
          title={t('common:general_informations')}
          items={itemsGeneralInfos}
        />
        <Outlet />
      </div>
      <div className="p-3">
        <DashboardTile
          data-testid="statistics"
          title={t('common:statistics')}
          items={itemsStatistics}
        />
      </div>
      <div className="p-3">
        <DashboardTile
          data-testid="my_offer"
          title={t('common:my_offer')}
          items={itemsBillingInfos}
        />
      </div>
    </div>
  );
}
