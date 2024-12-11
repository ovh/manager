import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams, useResolvedPath } from 'react-router-dom';
import { BaseLayout, UpdateNameModal } from '@ovh-ux/manager-react-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constants';
import TabsPanel from '@/components/layout-helpers/Dashboard/TabsPanel';
import { updateOfficeParentTenant, getOfficeParentTenant } from '@/hooks';
import { ParentTenantType } from '@/api/parentTenant/type';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const basePath = useResolvedPath('').pathname;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: getData } = getOfficeParentTenant() as {
    data?: ParentTenantType;
  };
  const { data: updateData } = updateOfficeParentTenant();

  const handleUpdateDisplayNameClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDisplayNameUpdate = (newName: string) => {
    updateData
      .mutateAsync({ displayName: newName })
      .then(() => {
        closeModal();
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  function computePathMatchers(routes: string[]) {
    return routes.map(
      (path) => new RegExp(path.replace(':serviceName', serviceName)),
    );
  }

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'licence',
      title: t('microsoft_office_dashboard_licences'),
      to: basePath,
      pathMatchers: computePathMatchers([urls.license]),
    },
    {
      name: 'consumption',
      title: t('microsoft_office_dashboard_consumption'),
      to: `${basePath}/consumption`,
      pathMatchers: computePathMatchers([urls.consumption]),
    },
  ];

  const header = {
    title: (
      <>
        <OdsText preset={ODS_TEXT_PRESET.heading6}>Groupes de licences</OdsText>
        <div className="flex items-center justify-between">
          <div>{getData?.displayName}</div>
          <OdsButton
            label=""
            icon={ODS_ICON_NAME.pen}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={handleUpdateDisplayNameClick}
            className="ml-4"
          />
        </div>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {getData?.serviceName}
        </OdsText>
      </>
    ),
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      tabs={<TabsPanel tabs={tabsList} />}
    >
      <Outlet />
      {isModalOpen && (
        <UpdateNameModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          headline={t('microsoft_office_modal_update_headline')}
          description={t('microsoft_office_modal_update_description')}
          inputLabel={t('microsoft_office_modal_update_input_label')}
          defaultValue={getData?.displayName}
          confirmButtonLabel={t('microsoft_office_modal_update_confirm')}
          cancelButtonLabel={t('microsoft_office_modal_update_cancel')}
          updateDisplayName={handleDisplayNameUpdate}
        />
      )}
    </BaseLayout>
  );
}
