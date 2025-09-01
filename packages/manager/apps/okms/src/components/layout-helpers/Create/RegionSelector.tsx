import React, { useContext, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsSelect,
  OdsButton,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_SPINNER_SIZE,
  ODS_BUTTON_COLOR,
  ODS_ICON_NAME,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
  ODS_BUTTON_ICON_ALIGNMENT,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { ErrorBanner, Region } from '@ovh-ux/manager-react-components';
import { useOrderCatalogOkms } from '@/data/hooks/useOrderCatalogOkms';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import { CREATE_KMS_TEST_IDS } from '@/pages/create/createKms.constants';

export type RegionSelectorProps = {
  setOrderInitiated: () => void;
  selectRegion: (region: string) => void;
  selectedRegion: string | undefined;
};

const RegionSelector = ({
  setOrderInitiated,
  selectRegion,
  selectedRegion,
}: RegionSelectorProps) => {
  const { t } = useTranslation('key-management-service/create');
  const { trackClick } = useOvhTracking();
  const { environment } = useContext(ShellContext);
  const {
    data: orderCatalogOKMS,
    isError,
    error,
    isLoading,
  } = useOrderCatalogOkms(environment.getUser().ovhSubsidiary);
  const navigate = useNavigate();

  if (isError && error) {
    return (
      <Suspense>
        <ErrorBanner
          error={error.response}
          data-testid={CREATE_KMS_TEST_IDS.catalogError}
        />
      </Suspense>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading2}>
          {t('key_management_service_create_region_title')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('key_management_service_create_region_description')}
        </OdsText>
        {isLoading && (
          <OdsSpinner className="mr-3" size={ODS_SPINNER_SIZE.sm} />
        )}
        {orderCatalogOKMS && !isLoading && (
          <OdsSelect
            className="md:w-[400px] sm:w-full"
            name="select-region"
            placeholder={t('key_management_service_create_select_placeholder')}
            data-testid={CREATE_KMS_TEST_IDS.selectRegion}
            onOdsChange={(v) => {
              const value = v.detail.value?.toString();

              if (value) {
                trackClick({
                  location: PageLocation.funnel,
                  buttonType: ButtonType.select,
                  actionType: 'action',
                  actions: ['select_location', value],
                });

                selectRegion(value);
              }
            }}
          >
            {orderCatalogOKMS.plans[0].configurations[0].values.map(
              (region) => (
                <option
                  key={region}
                  value={region}
                  data-testid={`${CREATE_KMS_TEST_IDS.selectRegion}-${region}`}
                >
                  <Region
                    mode="region"
                    name={region.toLowerCase().replaceAll('_', '-')}
                  />
                </option>
              ),
            )}
          </OdsSelect>
        )}
      </div>
      <div className="flex flex-row gap-4">
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          color={ODS_BUTTON_COLOR.primary}
          onClick={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.link,
              actionType: 'navigation',
              actions: ['create_kms', 'cancel'],
            });
            navigate(KMS_ROUTES_URLS.kmsListing);
          }}
          label={t('key_management_service_create_cta_cancel')}
          data-testid={CREATE_KMS_TEST_IDS.ctaCancel}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!selectedRegion}
          onClick={() => {
            if (selectedRegion) {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.link,
                actionType: 'navigation',
                actions: ['create_kms', 'confirm', selectedRegion],
              });
            }
            setOrderInitiated();
          }}
          icon={ODS_ICON_NAME.externalLink}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.left}
          label={t('key_management_service_create_cta_order')}
          data-testid={CREATE_KMS_TEST_IDS.ctaCreate}
        />
      </div>
    </div>
  );
};

export default RegionSelector;
