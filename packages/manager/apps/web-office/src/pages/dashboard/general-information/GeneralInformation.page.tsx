import { useMemo } from 'react';

import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DashboardTile, ManagerButton } from '@ovh-ux/manager-react-components';

import { OfficeServiceState } from '@/components/office-service-state/OfficeServiceState.component';
import { LicenseEnum } from '@/data/api/ApiType';
import { useLicenseDetail } from '@/data/hooks/license-details/useLicenseDetails';
import { useParentTenant } from '@/data/hooks/parent-tenant/useParentTenant';
import { useServiceInfos } from '@/data/hooks/service-infos/useServiceInfos';
import { useUsers } from '@/data/hooks/users/useUsers';
import { useDateFnsLocale } from '@/hooks/date-fns-locale/useDateFnsLocale';
import { IAM_ACTIONS } from '@/utils/IamAction.constants';
import { ServiceType } from '@/utils/ServiceType.utils';

export default function GeneralInformation() {
  const { t } = useTranslation([
    'dashboard/general-information',
    'common',
    NAMESPACES.STATUS,
    NAMESPACES.DASHBOARD,
  ]);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const locale = useDateFnsLocale();
  const serviceType = ServiceType(serviceName);

  const { data: licenseDetail, isLoading: isLoadingLicenseDetail } = useLicenseDetail();
  const { data: serviceInfos, isLoading: isLoadingServiceInfos } = useServiceInfos();
  const { data: dataUsers, isLoading: isLoadingUsers } = useUsers();
  const { data: dataParentTenant, isLoading: isLoadingParentTenant } = useParentTenant();

  const itemsGeneralInfos = useMemo(() => {
    return [
      {
        id: 'displayName',
        label: t('common:displayName'),
        value: (
          <>
            {!isLoadingParentTenant && (
              <div className="flex justify-between items-center gap-2">
                <OdsText preset={ODS_TEXT_PRESET.paragraph} className="break-all">
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
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>{dataParentTenant?.serviceName}</OdsText>
            )}
            {isLoadingParentTenant && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
      {
        id: 'servicetype',
        label: t(`${NAMESPACES.DASHBOARD}:service_type`),
        value: (
          <>
            {!isLoadingLicenseDetail && (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t(`common:${serviceType}`)}</OdsText>
            )}
            {isLoadingLicenseDetail && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
    ];
  }, [
    licenseDetail,
    serviceType,
    dataParentTenant,
    isLoadingLicenseDetail,
    isLoadingParentTenant,
    navigate,
    t,
  ]);

  const itemsStatistics = useMemo(() => {
    return [
      {
        id: 'license_number',
        label: t(`${NAMESPACES.DASHBOARD}:license_number`),
        value: (
          <div className="flex flex-col">
            {!isLoadingUsers &&
              dataUsers?.length > 0 &&
              dataUsers
                .reduce(
                  (accumulator: { licences: LicenseEnum; number: number }[], currentValue) => {
                    const findIndex = accumulator.findIndex(
                      (elm) => elm.licences === currentValue.licences[0],
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
                  },
                  [],
                )
                ?.map((stats: { licences: LicenseEnum; number: number }) => (
                  <OdsText key={stats.licences} preset={ODS_TEXT_PRESET.paragraph}>
                    <strong>{stats.licences} : </strong>
                    {stats.number}
                  </OdsText>
                ))}
            {!isLoadingUsers && dataUsers?.length === 0 && (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>{t('common:noAccountOffer')}</OdsText>
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
  }, [dataUsers, isLoadingUsers, t]);

  const itemsBillingInfos = useMemo(() => {
    return [
      {
        id: 'creation_date',
        label: t(`${NAMESPACES.DASHBOARD}:creation_date`),
        value: (
          <>
            {!isLoadingServiceInfos && (
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {serviceInfos?.creation ? format(serviceInfos?.creation, 'PPP', { locale }) : ''}
              </OdsText>
            )}
            {isLoadingServiceInfos && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
      {
        id: 'status',
        label: t(`${NAMESPACES.STATUS}:status`),
        value: (
          <>
            {!isLoadingServiceInfos && <OfficeServiceState state={serviceInfos?.status} />}
            {isLoadingServiceInfos && <OdsSkeleton></OdsSkeleton>}
          </>
        ),
      },
      ...(serviceType === 'prepaid'
        ? [
            {
              id: 'renew_date',
              label: t(`${NAMESPACES.DASHBOARD}:renew_date`),
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
  }, [serviceInfos, isLoadingServiceInfos, locale, serviceType, t]);

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-3">
        <DashboardTile
          data-testid="general_informations"
          title={t(`${NAMESPACES.DASHBOARD}:general_information`)}
          items={itemsGeneralInfos}
        />
        <Outlet />
      </div>
      <div className="p-3">
        <DashboardTile
          data-testid="statistics"
          title={t(`${NAMESPACES.DASHBOARD}:statistics`)}
          items={itemsStatistics}
        />
      </div>
      <div className="p-3">
        <DashboardTile
          data-testid="my_offer"
          title={t(`${NAMESPACES.DASHBOARD}:my_offer`)}
          items={itemsBillingInfos}
        />
      </div>
    </div>
  );
}
