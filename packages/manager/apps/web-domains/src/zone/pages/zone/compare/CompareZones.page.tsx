import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  BaseLayout,
  Breadcrumb,
  Notifications,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import {
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';
import { useGetZoneHistoryWithDetails } from '@/zone/hooks/data/history.hooks';
import CompareZonesViewer from '@/zone/components/CompareZonesViewer';
import { urls as zoneUrls } from '@/zone/routes/routes.constant';

interface CompareZonesState {
  baseId?: string;
  modifiedId?: string;
}

export default function CompareZonesPage() {
  const { t } = useTranslation('zone');
  const formatDate = useFormatDate();
  const navigate = useNavigate();
  const { serviceName } = useParams<{ serviceName: string }>();
  const location = useLocation();
  const resolvedServiceName = serviceName ?? '';

  const [baseId, setBaseId] = useState('');
  const [modifiedId, setModifiedId] = useState('');

  const { history } = useGetZoneHistoryWithDetails(
    resolvedServiceName,
    30,
  );

  const itemsByDateDesc = useMemo(() => {
    return (history || []).sort(
      (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
    );
  }, [history]);

  // Extract state from location if coming from history page with selected items
  // Only initialize once when data becomes available, not on every re-render
  useEffect(() => {
    // Skip if already initialized
    if (baseId && modifiedId) return;

    const state = location.state as CompareZonesState | undefined;
    if (state?.baseId && state?.modifiedId) {
      setBaseId(state.baseId);
      setModifiedId(state.modifiedId);
    } else if (itemsByDateDesc.length >= 2) {
      setBaseId(itemsByDateDesc[0].id);
      setModifiedId(itemsByDateDesc[1].id);
    }
  }, [itemsByDateDesc, location.state, baseId, modifiedId]);

  const selectedBase = useMemo(() => {
    return history?.find((item) => item.id === baseId);
  }, [history, baseId]);

  const selectedModified = useMemo(() => {
    return history?.find((item) => item.id === modifiedId);
  }, [history, modifiedId]);

  const backUrl = zoneUrls.zoneHistory.replace(':serviceName', resolvedServiceName);

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb rootLabel={serviceName} appName="domain" hideRootLabel />}
      header={{ title: serviceName }}
      backLinkLabel={t('zone_history_back_to_history')}
      onClickReturn={() => navigate(backUrl, { replace: true })}
      message={<Notifications />}
    >
      <div className="mb-6 space-y-4">
        <p className="text-gray-600">{t('zone_history_description')}</p>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <Text preset={TEXT_PRESET.caption} className="mb-2 block font-semibold">
              {t('zone_history_compare_base_label')}
            </Text>
            <select
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
              value={baseId}
              onChange={(event) => setBaseId(event.target.value)}
              disabled={itemsByDateDesc.length === 0}
            >
              {itemsByDateDesc.map((item) => (
                <option
                  key={`base-${item.id}`}
                  value={item.id}
                  disabled={item.id === modifiedId}
                >
                  {formatDate({ date: item.creationDate, format: 'PPpp' })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <Text preset={TEXT_PRESET.caption} className="mb-2 block font-semibold">
              {t('zone_history_compare_modified_label')}
            </Text>
            <select
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
              value={modifiedId}
              onChange={(event) => setModifiedId(event.target.value)}
              disabled={itemsByDateDesc.length === 0}
            >
              {itemsByDateDesc.map((item) => (
                <option
                  key={`modified-${item.id}`}
                  value={item.id}
                  disabled={item.id === baseId}
                >
                  {formatDate({ date: item.creationDate, format: 'PPpp' })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedBase && selectedModified && selectedBase.id !== selectedModified.id ? (
        <CompareZonesViewer baseItem={selectedBase} modifiedItem={selectedModified} />
      ) : (
        <div className="rounded border border-gray-200 bg-gray-50 p-6">
          <Text preset={TEXT_PRESET.paragraph}>
            {t('zone_history_compare_empty')}
          </Text>
        </div>
      )}
    </BaseLayout>
  );
}
