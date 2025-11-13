import { useParams } from 'react-router-dom';
import { ArrowRight, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CardContent, CardHeader } from '@datatr-ux/uxlib';
import OvhLink from '../links/OvhLink.component';

const BillingSupport = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('components/billing-support');
  return (
    <>
      <CardHeader>
        <h4>
          <UserCheck className="inline size-4 mr-2" />
          {t('billingSupportTitle')}
        </h4>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col gap-2"
          data-testid="billing-support-container"
        >
          <OvhLink
            className="flex flex-row items-center gap-1"
            data-testid="dashboard-billing-link"
            application="public-cloud"
            path={`#/pci/projects/${projectId}/billing`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('billingLink')}
            <ArrowRight className="size-4" />
          </OvhLink>
          <OvhLink
            className="flex flex-row items-center gap-1"
            data-testid="dashboard-support-link"
            application="dedicated"
            path={`#/support/tickets/new`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('supportLink')}
            <ArrowRight className="size-4" />
          </OvhLink>
        </div>
      </CardContent>
    </>
  );
};

export default BillingSupport;
