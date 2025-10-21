import React from 'react';
import { useTranslation } from 'react-i18next';

import { ManagerTile, ManagerButton, ActionMenu } from '@ovh-ux/manager-react-components';

import { SpaceMeter } from '@/components/SpaceMeter';
import type { NashaServiceDetails } from '@/types/Nasha.type';

interface GeneralInformationTabProps {
  service: NashaServiceDetails;
  onEditName: () => void;
  onGoToPartitions: () => void;
}

export const GeneralInformationTab = ({
  service,
  onEditName,
  onGoToPartitions
}: GeneralInformationTabProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="row py-4">
      {/* Tile Information */}
      <div className="col-md-4">
        <ManagerTile>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">{t('information_title')}</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-gray-600">{t('name')}</label>
                  <div>{service.customName || service.serviceName}</div>
                </div>
                <ActionMenu
                  id="edit-name-menu"
                  items={[
                      { id: 1, label: t('edit'), onClick: onEditName }
                  ]}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">{t('id')}</label>
                <div>{service.serviceName}</div>
              </div>

              <div>
                <label className="text-sm text-gray-600">{t('datacenter')}</label>
                <div>{service.localeDatacenter || service.datacenter}</div>
              </div>

              <div>
                <label className="text-sm text-gray-600">{t('disk_type')}</label>
                <div>{service.diskType?.toUpperCase() || 'N/A'}</div>
              </div>
            </div>
          </div>
        </ManagerTile>
      </div>

      {/* Tile Configuration avec SpaceMeter */}
      <div className="col-md-4">
        <ManagerTile>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">{t('configuration_title')}</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">{t('quota')}</label>
                {service.use && (
                  <SpaceMeter
                    usage={service.use as any}
                    large={true}
                    help={true}
                  />
                )}
                <ManagerButton
                  id="go-to-partitions"
                  label={t('go_to_partitions')}
                  onClick={onGoToPartitions}
                  variant="ghost"
                  icon="arrow-right"
                />
              </div>
            </div>
          </div>
        </ManagerTile>
      </div>

      {/* Tile Billing (réutiliser existant) */}
      <div className="col-md-4">
        <ManagerTile>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">{t('billing_title')}</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">{t('service_type')}</label>
                <div>{service.serviceInfos?.serviceType || 'N/A'}</div>
              </div>

              {service.serviceInfos?.engagedUpTo && (
                <div>
                  <label className="text-sm text-gray-600">{t('engagement_end')}</label>
                  <div>{new Date(service.serviceInfos.engagedUpTo).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>
        </ManagerTile>
      </div>
    </div>
  );
};
