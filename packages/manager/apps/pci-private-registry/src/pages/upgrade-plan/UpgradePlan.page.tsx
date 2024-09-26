import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  useHref,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { Translation, useTranslation } from 'react-i18next';
import {
  Headers,
  Notifications,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useContext, useEffect, useState } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import PlanChooser from '@/components/PlanChooser.component';
import {
  useGetRegistryAvailablePlans,
  useGetRegistryPlan,
  useUpdatePlan,
} from '@/api/hooks/useRegistry';
import { TRegistryPlan } from '@/api/data/registry';

export default function UpgradePlanPage(): JSX.Element {
  const { projectId } = useParams();
  const { data: project } = useProject();
  const { t } = useTranslation();
  const { t: tUpgrade } = useTranslation('upgrade');
  const { t: tUpgradePlan } = useTranslation('upgrade-plan');
  const projectHref = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const { tracking } = useContext(ShellContext)?.shell || {};

  const [selectedPlan, setSelectedPlan] = useState<TRegistryPlan>(null);

  const [searchParams] = useSearchParams();

  const { data: plan } = useGetRegistryPlan(
    projectId,
    searchParams.get('registryId'),
  );

  const { data: availablePlans } = useGetRegistryAvailablePlans(
    projectId,
    searchParams.get('registryId'),
  );

  const { updatePlan, isPending: isUpdatingPlan } = useUpdatePlan({
    projectId,
    registryId: searchParams.get('registryId'),
    planId: selectedPlan?.id,
    onSuccess: () => {
      addSuccess(
        <Translation ns="upgrade-plan">
          {(_t) => (
            <OsdsText
              break-spaces="false"
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            >
              {_t('private_registry_upgrade_plan_success')}
            </OsdsText>
          )}
        </Translation>,
        true,
      );

      navigate('..');
    },
    onError: (e: {
      response: { data: { message: never } };
      error: { message: never };
      message: never;
    }) => {
      addError(
        <Translation ns="upgrade-plan">
          {(_t) => (
            <OsdsText
              break-spaces="false"
              size={ODS_TEXT_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            >
              {tUpgradePlan('private_registry_upgrade_plan_error', {
                message:
                  e?.response?.data.message ||
                  e?.error?.message ||
                  e?.message ||
                  '',
              })}
            </OsdsText>
          )}
        </Translation>,
        false,
      );
    },
  });

  useEffect(() => {
    setSelectedPlan(availablePlans?.[0]);
  }, [availablePlans]);

  const update = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_CHANGEPLAN_CONFIRM_${selectedPlan.name}`,
    });

    updatePlan();
  };

  const cancel = () => {
    tracking?.trackClick({
      name: `PCI_PROJECTS_PRIVATEREGISTRY_CHANGEPLAN_CANCEL`,
    });
    navigate('..');
  };

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectHref,
              label: project.description,
            },
            {
              label: t('private_registry_title'),
              href: backHref,
            },
            {
              label: t('private_registry_upgrade_plan'),
            },
          ]}
        />
      )}

      <div className="header mt-8">
        <Headers title={t('private_registry_upgrade_plan')} />
      </div>

      <Notifications />

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {tUpgrade('private_registry_upgrade_plan_description')}
      </OsdsText>
      {plan && availablePlans && (
        <PlanChooser
          plan={selectedPlan}
          plans={availablePlans}
          onInput={(p) => {
            setSelectedPlan(p);
          }}
        />
      )}

      <div>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          <i>{tUpgrade('private_registry_upgrade_plan_warning')}</i>
        </OsdsText>
      </div>

      <div className="flex mt-8">
        <OsdsButton
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={cancel}
        >
          {t('private_registry_common_cancel')}
        </OsdsButton>
        <OsdsButton
          className="ml-4"
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={update}
          {...(isUpdatingPlan ? { disabled: true } : {})}
        >
          {t('private_registry_upgrade_plan')}
        </OsdsButton>
      </div>
    </>
  );
}
