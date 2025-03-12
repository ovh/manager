import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import * as billingView from '@datatr-ux/ovhcloud-types/cloud/billingView/index';
import OvhLink from '@/components/links/OvhLink.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { useGetCurrentUsage } from '@/data/hooks/usage/useGetUsage.hook';

const Billing = () => {
  const { t } = useTranslation('ai-tools/dashboard/home');
  const { projectId } = useParams();
  const [aiGlobalPrice, setAiGlobalPrice] = useState<number>(0);
  const currentUsageQuery = useGetCurrentUsage(projectId);
  useEffect(() => {
    if (!currentUsageQuery.data?.resourcesUsage) return;
    setAiGlobalPrice(
      (currentUsageQuery.data?.resourcesUsage?.find(
        (res: billingView.TypedResources) =>
          res.type === 'ai-notebook-workspace',
      )?.totalPrice ?? 0) +
        (currentUsageQuery.data?.resourcesUsage?.find(
          (res: billingView.TypedResources) => res.type === 'ai-training',
        )?.totalPrice ?? 0) +
        (currentUsageQuery.data?.resourcesUsage?.find(
          (res: billingView.TypedResources) => res.type === 'ai-notebook',
        )?.totalPrice ?? 0) +
        (currentUsageQuery.data?.resourcesUsage?.find(
          (res: billingView.TypedResources) => res.type === 'ai-app',
        )?.totalPrice ?? 0),
    );
  }, [currentUsageQuery.isSuccess]);

  return (
    <>
      <p>{t('billingParagraphe1')}</p>
      {currentUsageQuery.isSuccess && (
        <>
          <FormattedDate
            date={new Date(currentUsageQuery.data?.period.to)}
            options={{
              dateStyle: 'long',
            }}
          />
          <h3 className="py-4">
            {t('billingValueInfo', {
              value: aiGlobalPrice.toFixed(2) || 0,
            })}
          </h3>
        </>
      )}
      <OvhLink
        application="public-cloud"
        path={`#/pci/projects/${projectId}/billing`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('billingDetailsButton')}
        <ArrowRight className="size-4 inline ml-1" />
      </OvhLink>
    </>
  );
};

export default Billing;
