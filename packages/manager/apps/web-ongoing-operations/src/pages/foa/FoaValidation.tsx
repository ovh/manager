import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toUnicode } from 'punycode';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import SubHeader from '@/components/SubHeader/SubHeader';
import Loading from '@/components/Loading/Loading';
import FoaActions from '@/components/Foa/FoaActions.component';
import { DomainOperationsEnum } from '@/constants';
import { useDomain, usePendingFoas } from '@/hooks/data/query';
import NotFound from '@/pages/404';

export default function FoaValidation() {
  const { t } = useTranslation('dashboard');
  const { id, product } = useParams<{ id: string; product: string }>();
  const paramId = Number(id);
  const { notifications } = useNotifications();

  const { data: operation, isLoading: operationLoading } = useDomain(paramId);
  const domainName = operation?.domain ?? '';
  const isTrade = operation?.function === DomainOperationsEnum.DomainTrade;
  const { taskId, foas, pendingFoas, isLoading: foasLoading } = usePendingFoas(
    domainName,
    isTrade,
  );

  if (operationLoading || foasLoading) {
    return <Loading />;
  }

  // No scheduled trade task, no FOA (404) or every FOA already answered :
  // there is nothing a designated agent can validate here
  if (!operation || !isTrade || !taskId || pendingFoas.length === 0) {
    return <NotFound />;
  }

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
      }}
      message={notifications.length ? <Notifications /> : undefined}
    >
      <SubHeader
        title={t('domain_operations_foa_title', {
          t0: toUnicode(domainName),
        })}
      />
      <section className="flex flex-col gap-y-4">
        <Text preset={TEXT_PRESET.paragraph}>
          {t('domain_operations_foa_description')}
        </Text>
        <FoaActions
          domainName={domainName}
          taskId={taskId}
          foas={foas}
          product={product ?? ''}
        />
      </section>
    </BaseLayout>
  );
}
