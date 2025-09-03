import { usePciUrl } from '@ovh-ux/manager-pci-common';
import { Drawer } from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME, OdsInputChangeEvent } from '@ovhcloud/ods-components';
import React, { useMemo, useState } from 'react';
import { OdsText, OdsInput, OdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type ConsumptionResourceListProps = {
  isDrawerOpen: boolean;
  resources: string[];
  handleCloseDrawer: () => void;
  isInstanceFlavor: boolean;
};

const ConsumptionResourceList = ({
  isDrawerOpen,
  resources,
  isInstanceFlavor,
  handleCloseDrawer,
}: ConsumptionResourceListProps) => {
  const pciUrl = usePciUrl();
  const { t } = useTranslation('dashboard');

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: OdsInputChangeEvent) => {
    const { value } = event.detail;
    setSearchQuery(typeof value === 'string' ? value : '');
  };

  const filteredPlanIds = useMemo(() => {
    if (!resources) return [];
    if (!searchQuery) return resources;
    return resources.filter((id) =>
      id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [resources, searchQuery]);

  const onClose = () => {
    setSearchQuery('');
    handleCloseDrawer();
  };

  const getResourceUrl = (planId: string) =>
    isInstanceFlavor
      ? `${pciUrl}/instances/${planId}`
      : `${pciUrl}/rancher/${planId}`;

  return (
    <Drawer
      heading={t('dashboard_resource_list_details')}
      isOpen={isDrawerOpen}
      onDismiss={onClose}
    >
      <div className="gap-2 max-w-[800px] w-[400px]">
        <div>
          <OdsText preset="heading-6" className="mb-4">
            {t('dashboard_resource_list_title')}
          </OdsText>
        </div>

        {resources.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col">
              <OdsText>{t('dashboard_resource_list_search')}</OdsText>
              <OdsInput
                name="search-resource"
                placeholder={t('dashboard_resource_list_search')}
                value={searchQuery}
                onOdsChange={handleSearchChange}
                className="max-w-full"
              />
            </div>

            <div className="flex flex-col gap-3">
              {filteredPlanIds.length > 0 ? (
                filteredPlanIds.map((planId) => (
                  <div key={planId} className="py-2">
                    <OdsLink
                      icon={ODS_ICON_NAME.arrowRight}
                      href={getResourceUrl(planId)}
                      label={planId}
                      target="_blank"
                    />
                  </div>
                ))
              ) : (
                <OdsText className="text-neutral-500">
                  {t('dashboard_resource_list_no_results', { searchQuery })}
                </OdsText>
              )}
            </div>
          </>
        ) : (
          <OdsText className="text-neutral-500">
            {t('dashboard_resource_list_no_resources')}
          </OdsText>
        )}
      </div>
    </Drawer>
  );
};

export default ConsumptionResourceList;
