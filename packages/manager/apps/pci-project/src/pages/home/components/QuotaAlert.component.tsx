import { useContext } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { OdsLink, OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { isDiscoveryProject, usePciUrl, useProject } from '@ovh-ux/manager-pci-common';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { QUOTA_LIMIT_GUIDES } from '@/constants';
import { useIsQuotaAboveThreshold, useQuotas } from '@/data/hooks/useQuota';
import { useProjectIdFromParams } from '@/hooks/useProjectIdFromParams';
import { TProject } from '@/types/pci-common.types';

export default function QuotaAlert() {
  const { t } = useTranslation('home');
  const projectId = useProjectIdFromParams();

  const { data: quotas, isLoading } = useQuotas(projectId);
  const isQuotaAboveThreshold = useIsQuotaAboveThreshold(quotas ?? []);
  const { data: project } = (
    useProject as unknown as (id: string | undefined) => {
      data: TProject | undefined;
    }
  )(projectId);
  const isDiscovery = (isDiscoveryProject as (p: TProject | undefined) => boolean)(project);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const quotaGuidesLink =
    QUOTA_LIMIT_GUIDES[ovhSubsidiary as OvhSubsidiary] || QUOTA_LIMIT_GUIDES.DEFAULT || '';

  const hrefProject = (usePciUrl as unknown as () => string)();
  const quotaUrl = `${hrefProject}/quota`;

  if (isLoading || !isQuotaAboveThreshold || isDiscovery) {
    return null;
  }

  return (
    <div className="my-6 w-full">
      <OdsMessage color="warning" isDismissible={false} data-testid="quota-alert_message">
        <OdsText>
          <Trans
            t={t}
            i18nKey="pci_projects_home_quota_threshold_warning_message"
            components={{
              quotaGuidesLink: (
                <OdsLink
                  href={quotaGuidesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  icon="external-link"
                  data-testid="quota-alert_guides-link"
                />
              ),
              quotaUrl: <OdsLink href={quotaUrl} data-testid="quota-alert_quota-url" />,
            }}
          />
        </OdsText>
      </OdsMessage>
    </div>
  );
}
