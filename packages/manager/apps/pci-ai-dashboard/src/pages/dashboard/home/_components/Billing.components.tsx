import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetCurrentUsage } from '@/hooks/api/usage/useGetUsage.hook';
import OvhLink from '@/components/links/OvhLink.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import * as billingView from '@/types/cloud/billingView';

const Billing = () => {
  const { t } = useTranslation('pci-ai-dashboard/home');
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
        path={`#/pci/project/${projectId}/billing`}
      >
        <div className="flex flex-row gap-1 items-center">
          {t('billingDetailsButton')}
          <ArrowRight className="size-4" />
        </div>
      </OvhLink>
    </>
  );
};

export default Billing;
