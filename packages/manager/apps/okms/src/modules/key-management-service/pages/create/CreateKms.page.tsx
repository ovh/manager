import React, { useState } from 'react';
import {
  BaseLayout,
  useNotifications,
  Notifications,
  Order,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { useGetOkmsOrderLink } from '@key-management-service/pages/create/useGetOkmsOrderLink';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import {
  KMS_ROUTES_URIS,
  KMS_ROUTES_URLS,
} from '@key-management-service/routes/routes.constants';
import { RegionPicker } from '@/common/components/region-picker/RegionPicker.component';
import { KMS_LABEL } from '@/constants';

export default function CreateKmsPage() {
  const { t } = useTranslation('key-management-service/create');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [orderLink, setOrderLink] = useState<string | undefined>();
  const { notifications } = useNotifications();
  const { getOrderLink } = useGetOkmsOrderLink();

  const handleGenerateOrderLink = () => {
    if (selectedRegion) {
      const newOrderLink = getOrderLink(selectedRegion);
      setOrderLink(newOrderLink);

      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.link,
        actionType: 'navigation',
        actions: ['create_kms', 'confirm', selectedRegion],
      });
    }
  };

  const handleCancel = () => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['create_kms', 'cancel'],
    });
    navigate(KMS_ROUTES_URLS.kmsListing);
  };

  const handleNavigateToOkmsList = () => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['finish'],
    });
    navigate(KMS_ROUTES_URLS.kmsListing, {
      state: { hasPendingOrder: true },
    });
  };

  return (
    <BaseLayout
      header={{
        title: t('key_management_service_create_title'),
        changelogButton: <KmsGuidesHeader />,
      }}
      message={notifications.length > 0 && <Notifications />}
      breadcrumb={
        <Breadcrumb
          items={[
            {
              id: KMS_ROUTES_URIS.kmsCreate,
              label: t('key_management_service_create_title'),
              navigateTo: KMS_ROUTES_URLS.kmsCreate,
            },
          ]}
        />
      }
    >
      <div className="max-w-2xl">
        <div className="space-y-8">
          <Order>
            <Order.Configuration
              onCancel={handleCancel}
              onConfirm={handleGenerateOrderLink}
              isValid={!!selectedRegion}
            >
              <div>
                <OdsText preset="heading-2" className="mb-2">
                  {t('region_selection')}
                </OdsText>
                <OdsText preset="paragraph">
                  {t('region_selection_description')}
                </OdsText>
              </div>

              <RegionPicker
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
              />
            </Order.Configuration>

            <Order.Summary
              productName={KMS_LABEL}
              orderLink={orderLink}
              onFinish={handleNavigateToOkmsList}
            />
          </Order>
        </div>
      </div>
    </BaseLayout>
  );
}
