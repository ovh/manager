import {
  Datagrid,
  Headers,
  Notifications,
  PciGuidesHeader,
  useDataGrid,
  useMe,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { Suspense, useEffect, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsIcon,
  OdsLink,
  OdsMessage,
  OdsPopover,
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
import { useDatagridColumn } from './components/useDatagridColumn';
import {
  iamLink,
  RESTRICTED_CORES,
  RESTRICTED_INSTANCES,
  RESTRICTED_RAM,
  supportLink,
} from '@/constants';
import { toggleManualQuota, unleash } from '@/api/data/project';
import { useGetServiceOptions } from '@/api/hooks/useServiceOptions';
import { TabsComponent } from '@/components/tabs/Tabs.component';
import { useGetValidPaymentMethodIds } from '@/api/hooks/usePaymentmethods';
import { useGetProjectService } from '@/api/hooks/useService';

type TState = {
  manualQuota: {
    isActive: boolean;
    isToggling: boolean;
  };
};

export default function QuotaPage(): JSX.Element {
  const isMobile: boolean = useMedia(`(max-width: 760px)`);
  const { t: tQuota } = useTranslation('quotas');
  const { projectId } = useParams();
  const columns = useDatagridColumn();

  const { data: project } = useProject(projectId);

  const { data: service, isPending: isServicePending } = useGetProjectService(
    projectId,
  );

  const hrefProject = useProjectUrl('public-cloud');

  const [state, setState] = useState<TState>({
    manualQuota: { isActive: false, isToggling: false },
  });

  const navigate = useNavigate();

  const { addError } = useNotifications();

  const { me } = useMe();

  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    id: 'name',
    desc: false,
  });

  const { data: quotas, paginatedData: paginatedQuotas, isPending } = useQuotas(
    projectId,
    pagination,
    sorting,
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

  const { data: serviceOptions } = useGetServiceOptions(projectId);

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
        await toggleManualQuota(projectId, state.manualQuota.isActive);
        setState((prev) => ({
          ...prev,
          manualQuota: {
            ...prev.manualQuota,
            isActive: !prev.manualQuota.isActive,
          },
        }));
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
      setState((prev) => ({
        ...prev,
        manualQuota: {
          ...prev.manualQuota,
          isActive: !project.manualQuota,
        },
      }));
    }
  }, [project]);

  if (isPending) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }
  return (
    <div>
      {project && (
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project.description} />
          <OdsBreadcrumbItem
            label={tQuota('pci_projects_project_quota')}
            href={''}
          />
        </OdsBreadcrumb>
      )}
      {!isServicePending && !service && !serviceOptions && (
        <div className="mt-10">
          <OdsMessage color="danger" className="w-full" isDismissible={false}>
            <div className="p-2">
              <OdsText preset="paragraph">
                {tQuota('pci_projects_project_quota_error_forbidden')}
              </OdsText>
              <div className="mt-4">
                <OdsLink href={iamLink} label={iamLink}></OdsLink>
              </div>
            </div>
          </OdsMessage>
        </div>
      )}
      <div className="header mt-8">
        <Headers
          headerButton={
            <div className="min-w-[7rem]">
              <PciGuidesHeader category="instances" />
            </div>
          }
        />
      </div>
      <div className={isMobile ? 'mb-5 sticky top-0 z-50' : ''}>
        <PciDiscoveryBanner project={project} />
      </div>
      <PciAnnouncementBanner projectId={projectId} />
      <div className="my-10 mt-8">
        <TabsComponent activeTab={'quota'} />
      </div>
      <Notifications />
      {is.quotaRestricted && is.defaultPaymentMethodAvailable && (
        <div className="mt-8 p-8 rounded-md border border-solid border-[#bef1ff] bg-[#f5feff]">
          <div>
            <OdsText preset="heading-6">
              {tQuota(
                'pci_projects_project_quota_restricted_paymentmean_active',
              )}
            </OdsText>
          </div>
          <OdsButton
            className="mt-4"
            size="sm"
            label={tQuota(
              'pci_projects_project_quota_restricted_unlock_button',
            )}
            onClick={Do.unleash}
          />
        </div>
      )}
      {!is.quotaRestricted && (
        <div className="p-8 rounded-md border border-solid border-[#bef1ff] bg-[#f5feff] mt-4">
          <div>
            <OdsText preset="heading-6">
              {tQuota('pci_projects_project_quota_protect_explain')}
            </OdsText>
            <div className="mt-6">
              <OdsText preset="paragraph">
                {tQuota('pci_projects_project_quota_protect_more')}
              </OdsText>
            </div>
          </div>
          {me?.ovhSubsidiary !== 'US' ? (
            <div className="mt-4">
              {quotas?.length > 0 && (
                <OdsButton
                  className=""
                  size="sm"
                  label={`${tQuota(
                    'pci_projects_project_quota_protect_contact_support',
                  )}`}
                  onClick={() => {
                    navigate('./increase/contact-support');
                  }}
                />
              )}
              {quotas?.length > 0 && serviceOptions?.length > 0 && (
                <OdsButton
                  className="ml-4"
                  size="sm"
                  onClick={() => {
                    navigate('./increase/buy-credit');
                  }}
                  label={`${tQuota(
                    'pci_projects_project_quota_protect_more_btn',
                  )}`}
                />
              )}
              {(!quotas || (quotas && quotas.length === 0)) && (
                <OdsButton
                  className="ml-4"
                  size="sm"
                  icon="external-link"
                  iconAlignment="right"
                  label={`${tQuota(
                    'pci_projects_project_quota_protect_more_btn',
                  )}`}
                />
              )}
            </div>
          ) : (
            <div className="mt-4">
              {!quotas ||
                (quotas && quotas.length === 0 && (
                  <OdsButton
                    className=""
                    size="sm"
                    label={`${tQuota(
                      'pci_projects_project_quota_protect_more_btn',
                    )}`}
                    isDisabled={true}
                  />
                ))}
              {quotas?.length && (
                <OdsButton
                  className="ml-4"
                  size="sm"
                  label={`${tQuota(
                    'pci_projects_project_quota_protect_more_btn',
                  )}`}
                  onClick={() => {
                    window.open(supportLink, '_top');
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
      <div className="text-right mt-6 pr-2">
        <OdsText>{tQuota('pci_projects_project_quota_autoscaling')}</OdsText>
        <OdsIcon name="circle-question" className="text-xs px-4" id="trigger" />
        <OdsPopover triggerId="trigger">
          {tQuota('pci_projects_project_quota_autoscaling_help')}
        </OdsPopover>
        <OdsToggle
          name="auto-scaling"
          value={state.manualQuota.isActive}
          isDisabled={state.manualQuota.isToggling}
          onClick={(event) => {
            event.preventDefault();
            setState((prev) => ({
              ...prev,
              manualQuota: {
                ...prev.manualQuota,
                isToggling: true,
              },
            }));

            Do.toggleManualQuota().finally(() => {
              setState((prev) => ({
                ...prev,
                manualQuota: {
                  ...prev.manualQuota,
                  isToggling: false,
                },
              }));
            });
          }}
        />
        <OdsText className="pl-4">
          {tQuota(
            state.manualQuota.isActive
              ? 'pci_projects_project_quota_autoscaling_on'
              : 'pci_projects_project_quota_autoscaling_off',
          )}
        </OdsText>
      </div>

      <div className="mt-8">
        <OdsText preset="heading-6">
          {tQuota('pci_projects_project_quota_current_limit')}
        </OdsText>
      </div>
      <div className="mt-4">
        <Datagrid
          columns={columns}
          items={paginatedQuotas?.rows || []}
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
    </div>
  );
}
