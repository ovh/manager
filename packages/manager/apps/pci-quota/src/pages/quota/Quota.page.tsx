import {
  Datagrid,
  Notifications,
  useDataGrid,
  useMe,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsLink,
  OdsMessage,
  OdsSpinner,
  OdsText,
  OdsToggle,
} from '@ovhcloud/ods-components/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  PciAnnouncementBanner,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { useMedia } from 'react-use';
import { useQuotas } from '@/api/hooks/useQuotas';
import { sortQuotas, useDatagridColumn } from './components/useDatagridColumn';
import {
  IAM_LINK,
  RESTRICTED_CORES,
  RESTRICTED_INSTANCES,
  RESTRICTED_RAM,
  SUPPORT_LINK,
} from '@/constants';
import { toggleManualQuota, unleash } from '@/api/data/project';
import { useGetFilteredServiceOptions } from '@/api/hooks/useServiceOptions';
import { useGetValidPaymentMethodIds } from '@/api/hooks/usePaymentmethods';
import { useGetProjectService } from '@/api/hooks/useService';
import { Quota } from '@/api/data/quota';
import LabelComponent from '@/components/Label.component';
import { paginateResults } from '@/helpers';
import { useLocations } from '@/api/hooks/useRegions';

export default function QuotaPage(): JSX.Element {
  const isMobile: boolean = useMedia(`(max-width: 760px)`);
  const { t } = useTranslation(['regions', 'quotas']);
  const { projectId } = useParams();
  const columns = useDatagridColumn();

  const { data: project } = useProject(projectId);

  const { data: service, isPending: isServicePending } = useGetProjectService(
    projectId,
  );

  const [manualQuotaIsActive, setManualQuotaIsActive] = useState<boolean>(
    false,
  );
  const [manualQuotaIsToggling, setManualQuotaIsToggling] = useState<boolean>(
    false,
  );

  const navigate = useNavigate();

  const { addError } = useNotifications();

  const { me } = useMe();

  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    id: 'name',
    desc: false,
  });

  const { quotas, isPending: isQuotasPending } = useQuotas(projectId);
  const { data: locations, isPending: isLocationsPending } = useLocations(
    projectId,
  );
  const isPending = isQuotasPending || isLocationsPending;

  const quotasListing = useMemo(
    () =>
      paginateResults<Quota>(
        sortQuotas(
          quotas?.map((quota) => {
            const targetLocation = locations.find((location) =>
              location.regions.some((region) => region === quota.region),
            );
            return {
              ...quota,
              fullRegionName: targetLocation?.name
                ? `${targetLocation?.name} (${quota.region})`
                : quota.region,
            };
          }) || [],
          sorting,
        ),
        pagination,
      ),
    [quotas, locations, sorting, pagination],
  );

  const { isValid } = useGetValidPaymentMethodIds();

  const is = {
    quotaRestricted:
      Array.isArray(quotas) && quotas.length > 0
        ? quotas[0].instance.maxInstances === RESTRICTED_INSTANCES &&
          quotas[0].instance.maxCores === RESTRICTED_CORES &&
          quotas[0].instance.maxRam === RESTRICTED_RAM
        : false,
    defaultPaymentMethodAvailable: isValid,
  };

  const { data: serviceOptions } = useGetFilteredServiceOptions(projectId);

  const Do = {
    unleash: async () => {
      try {
        await unleash(projectId);
      } catch (e) {
        const error = e as ApiError;
        if (error.response.status === 403) {
          addError(
            <Translation ns="quotas">
              {(_t) => (
                <OdsText>
                  {_t('pci_projects_project_quota_already_unleashed')},
                </OdsText>
              )}
            </Translation>,
          );
        } else {
          addError(
            <Translation ns="quotas">
              {(_t) => (
                <OdsText>
                  {_t('pci_projects_project_quota_unleash_error')},
                </OdsText>
              )}
            </Translation>,
          );
        }
      }
    },
    toggleManualQuota: async () => {
      try {
        await toggleManualQuota(projectId, manualQuotaIsActive);
        setManualQuotaIsActive((isActive) => !isActive);
      } catch (e) {
        addError(
          <Translation ns="quotas">
            {(_t) => (
              <OdsText>
                {_t('pci_projects_project_quota_autoscaling_error')},
              </OdsText>
            )}
          </Translation>,
        );
      }
    },
  };

  useEffect(() => {
    if (project) {
      setManualQuotaIsActive(!project.manualQuota);
    }
  }, [project]);

  if (isPending) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <>
      {!isServicePending && !service && !serviceOptions && (
        <div className="mt-10">
          <OdsMessage color="danger" className="w-full" isDismissible={false}>
            <div className="p-2">
              <OdsText preset="paragraph">
                {t('quotas:pci_projects_project_quota_error_forbidden')}
              </OdsText>
              <div className="mt-4">
                <OdsLink href={IAM_LINK} label={IAM_LINK}></OdsLink>
              </div>
            </div>
          </OdsMessage>
        </div>
      )}

      <div className={isMobile ? 'mb-5 sticky top-0 z-50' : ''}>
        <PciDiscoveryBanner project={project} />
      </div>
      <PciAnnouncementBanner projectId={projectId} />
      <Notifications />
      {is.quotaRestricted && is.defaultPaymentMethodAvailable && (
        <div className="mt-8 p-8 rounded-md border border-solid border-[#bef1ff] bg-[#f5feff]">
          <div>
            <OdsText preset="heading-6">
              {t(
                'quotas:pci_projects_project_quota_restricted_paymentmean_active',
              )}
            </OdsText>
          </div>
          <OdsButton
            className="mt-4"
            size="sm"
            label={t(
              'quotas:pci_projects_project_quota_restricted_unlock_button',
            )}
            onClick={Do.unleash}
          />
        </div>
      )}
      {!is.quotaRestricted && (
        <div className="p-8 rounded-md border border-solid border-[#bef1ff] bg-[#f5feff] mt-4">
          <div>
            <OdsText preset="heading-6">
              {t('quotas:pci_projects_project_quota_protect_explain')}
            </OdsText>
            <div className="mt-6">
              <OdsText preset="paragraph">
                {t('pci_projects_project_quota_protect_more', { ns: 'quotas' })}
              </OdsText>
            </div>
          </div>
          {me?.ovhSubsidiary !== 'US' ? (
            <div className="mt-4">
              {quotas?.length > 0 && (
                <OdsButton
                  size="sm"
                  label={`${t(
                    'quotas:pci_projects_project_quota_protect_contact_support',
                  )}`}
                  onClick={() => navigate('./increase/contact-support')}
                />
              )}
              {quotas?.length > 0 && serviceOptions?.length > 0 && (
                <OdsButton
                  className="ml-4"
                  size="sm"
                  onClick={() => navigate('./increase/buy-credit')}
                  label={`${t(
                    'quotas:pci_projects_project_quota_protect_more_btn',
                  )}`}
                />
              )}
              {(!quotas || quotas.length === 0) && (
                <OdsButton
                  className="ml-4"
                  size="sm"
                  icon="external-link"
                  iconAlignment="right"
                  label={`${t(
                    'quotas:pci_projects_project_quota_protect_more_btn',
                  )}`}
                />
              )}
            </div>
          ) : (
            <div className="mt-4">
              {(!quotas || quotas.length === 0) && (
                <OdsButton
                  size="sm"
                  label={`${t(
                    'quotas:pci_projects_project_quota_protect_more_btn',
                  )}`}
                  isDisabled={true}
                />
              )}
              {quotas?.length > 0 && (
                <OdsButton
                  className="ml-4"
                  size="sm"
                  label={`${t(
                    'quotas:pci_projects_project_quota_protect_more_btn',
                  )}`}
                  onClick={() => {
                    window.open(SUPPORT_LINK, '_top');
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
      <div className="flex justify-end mt-6 pr-2">
        <LabelComponent
          text={t('quotas:pci_projects_project_quota_autoscaling')}
          helpText={t('quotas:pci_projects_project_quota_autoscaling_help')}
          triggerId="quota-autoscaling-help"
          className="pr-4"
        />
        <OdsToggle
          name="auto-scaling"
          value={manualQuotaIsActive}
          isDisabled={manualQuotaIsToggling}
          onClick={(event) => {
            event.preventDefault();
            setManualQuotaIsToggling(true);

            Do.toggleManualQuota().finally(() => {
              setManualQuotaIsToggling(false);
            });
          }}
        />
        <LabelComponent
          text={t(
            `quotas:pci_projects_project_quota_autoscaling_${
              manualQuotaIsActive ? 'on' : 'off'
            }`,
          )}
          className="pl-4"
        />
      </div>

      <div className="mt-8">
        <OdsText preset="heading-6">
          {t('pci_projects_project_quota_current_limit', { ns: 'quotas' })}
        </OdsText>
      </div>
      <div className="mt-4">
        <Datagrid
          columns={columns}
          items={quotasListing?.rows || []}
          totalItems={quotas?.length || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
          className="overflow-x-visible"
        />
      </div>
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
