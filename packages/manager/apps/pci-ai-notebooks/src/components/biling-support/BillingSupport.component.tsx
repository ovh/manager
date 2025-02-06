import { useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OvhLink from '../links/OvhLink.component';

const BillingSupport = () => {
  const projectId = useParams();
  const { t } = useTranslation('components/billing-support');
  return (
    <div
      className="flex flex-col gap-2"
      data-testid="billing-support-container"
    >
      <OvhLink
        data-testid="dashboard-billing-link"
        application="public-cloud"
        path={`#/pci/projects/${projectId}/billing`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('billingLink')}
        <ArrowRight className="size-4 inline ml-1" />
      </OvhLink>
      <OvhLink
        data-testid="dashboard-support-link"
        application="dedicated"
        path={`#/support/tickets/new`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('supportLink')}
        <ArrowRight className="size-4 inline ml-1" />
      </OvhLink>
    </div>
  );
};

export default BillingSupport;
