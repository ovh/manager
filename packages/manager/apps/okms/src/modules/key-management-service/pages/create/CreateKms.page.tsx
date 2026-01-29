import { useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Breadcrumb from '@key-management-service/components/breadcrumb/Breadcrumb';
import KmsGuidesHeader from '@key-management-service/components/guide/KmsGuidesHeader';
import { KMS_ROUTES_URIS, KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';
import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { useNotifications } from '@ovh-ux/muk';
import { BaseLayout, Button, Notifications } from '@ovh-ux/muk';

import { RegionPicker } from '@/common/components/region-picker/RegionPicker.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { usePendingOkmsOrder } from '@/common/hooks/usePendingOkmsOrder/usePendingOkmsOrder';

import { CREATE_KMS_TEST_IDS } from './CreateKms.constants';

export default function CreateKmsPage() {
  const { t } = useTranslation(['key-management-service/create', 'common']);
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { hasPendingOrder } = usePendingOkmsOrder();
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const { notifications } = useNotifications();

  const handleGenerateOrderLink = () => {
    if (selectedRegion) {
      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['order', 'okms'],
      });
      navigate(KMS_ROUTES_URLS.kmsCreateOrderModal(selectedRegion));
    }
  };

  const handleCancel = () => {
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['create', 'okms', 'cancel'],
    });
    navigate(KMS_ROUTES_URLS.kmsListing);
  };

  return (
    <BaseLayout
      header={{
        title: t('key_management_service_create_title'),
        changelogButton: <KmsGuidesHeader />,
      }}
      message={notifications?.length ? <Notifications /> : undefined}
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
      <section className="max-w-2xl space-y-8">
        {hasPendingOrder && (
          <Message color="information" dismissible={false}>
            {t('common:okms_order_blocked')}
          </Message>
        )}
        <div className="space-y-8">
          <div>
            <Text preset="heading-2" className="mb-2">
              {t('region_selection')}
            </Text>
            <Text preset="paragraph">{t('region_selection_description')}</Text>
          </div>

          <RegionPicker selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
        </div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleCancel}
            data-testid={CREATE_KMS_TEST_IDS.CTA_CANCEL}
          >
            {t('key_management_service_create_cta_cancel')}
          </Button>

          <Button
            disabled={!selectedRegion || hasPendingOrder}
            onClick={handleGenerateOrderLink}
            data-testid={CREATE_KMS_TEST_IDS.CTA_ORDER}
          >
            {t('key_management_service_create_cta_order')}
          </Button>
        </div>
      </section>
      <Outlet />
    </BaseLayout>
  );
}
