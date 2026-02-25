import { useCallback, useState } from 'react';
import {
  BaseLayout,
  Breadcrumb,
  Datagrid,
  Notifications,
  useAuthorizationIam,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetZoneHistoryWithDetails } from '@/zone/hooks/data/history.hooks';
import { TZoneHistoryWithDate } from '@/zone/types/history.types';
import { useHistoryColumns } from '@/zone/hooks/useHistoryColumns';
import { urls as zoneUrls } from '@/zone/routes/routes.constant';
import RestoreZoneModal from '@/zone/components/RestoreZoneModal';
import ViewZoneModal from '@/zone/components/ViewZoneModal';
import { Button, BUTTON_SIZE } from '@ovhcloud/ods-react';
import { useGetIAMResource } from '@/common/hooks/iam/useGetIAMResource';

export default function HistoryPage() {
  const { t } = useTranslation('zone');
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const { notifications, clearNotifications } = useNotifications();
  const resolvedServiceName = serviceName ?? '';
  const [viewItem, setViewItem] = useState<TZoneHistoryWithDate | null>(null);
  const [restoreItem, setRestoreItem] = useState<TZoneHistoryWithDate | null>(
    null,
  );

  const { history, isLoading } = useGetZoneHistoryWithDetails(
    resolvedServiceName,
    30,
  );

  // IAM authorization check for restore
  const { data: dnsZoneIAMRessources } = useGetIAMResource(
    resolvedServiceName,
    'dnsZone',
  );
  const urn = dnsZoneIAMRessources?.[0]?.urn;
  const { isPending: isIamPending, isAuthorized } = useAuthorizationIam(
    ['dnsZone:apiovh:import'],
    urn,
  );
  const canRestore = !isIamPending && isAuthorized;

  const handleView = (item: TZoneHistoryWithDate) => {
    setViewItem(item);
  };

  const handleRestore = (item: TZoneHistoryWithDate) => {
    setRestoreItem(item);
  };

  const handleCompareVersions = useCallback(() => {
    if (!history || history.length < 2) return;
    const compareUrl = zoneUrls.zoneCompare.replace(
      ':serviceName',
      resolvedServiceName,
    );
    clearNotifications();
    navigate(compareUrl, {
      state: {
        baseId: history[0].id,
        modifiedId: history[1].id,
      },
    });
  }, [history, resolvedServiceName, navigate, clearNotifications]);

  const columns = useHistoryColumns({
    t,
    onView: handleView,
    onRestore: handleRestore,
    zoneName: resolvedServiceName,
    activeZoneId: history && history.length > 0 ? history[0].id : undefined,
    canRestore,
  });

  const backUrl = zoneUrls.zoneRoot.replace(
    ':serviceName',
    resolvedServiceName,
  );

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb rootLabel={serviceName} appName="domain" hideRootLabel />
      }
      header={{ title: serviceName }}
      backLinkLabel={t('zone_history_back_to_zone')}
      onClickReturn={() => navigate(backUrl, { replace: true })}
      message={notifications.length > 0 ? <Notifications /> : null}
    >
      <div className="mb-4">
        <p className="text-gray-600 mb-4">{t('zone_history_description')}</p>
        <Button
          onClick={handleCompareVersions}
          disabled={!history || history.length < 2}
          size={BUTTON_SIZE.sm}
        >
          {t('zone_history_compare_versions')}
        </Button>
      </div>
      <Datagrid
        columns={columns}
        items={history || []}
        totalItems={history?.length || 0}
        isLoading={isLoading}
        hasNextPage={false}
      />

      <ViewZoneModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        item={viewItem}
      />

      <RestoreZoneModal
        isOpen={!!restoreItem}
        onClose={() => setRestoreItem(null)}
        item={restoreItem}
        zoneName={resolvedServiceName}
      />
    </BaseLayout>
  );
}
