import React, { useContext, Dispatch, SetStateAction, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsSelect,
  OdsFormField,
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
import { useOrderCatalogOKMS } from '@/data/hooks/useOrderCatalogOKMS';
import { ROUTES_URLS } from '@/routes/routes.constants';

export type RegionSelectorProps = {
  setOrderInitiated: () => void;
  selectRegion: Dispatch<SetStateAction<string>>;
  selectedRegion: string | null;
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
  } = useOrderCatalogOKMS(environment.getUser().ovhSubsidiary);
  const navigate = useNavigate();

  if (isError && error) {
    return (
      <Suspense>
        <ErrorBanner error={error.response} />
      </Suspense>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-6">
        <OdsFormField className="mb-5">
          <div slot="label">
            <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
              {t('key_management_service_create_region_title')}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t('key_management_service_create_region_description')}
            </OdsText>
            {isLoading && (
              <OdsSpinner className="mr-3" size={ODS_SPINNER_SIZE.sm} />
            )}
          </div>
          {orderCatalogOKMS && !isLoading && (
            <OdsSelect
              className="md:w-[250px] sm:w-full"
              name="select-region"
              placeholder={t(
                'key_management_service_create_select_placeholder',
              )}
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
                    data-testid={`select-region-option-${region}`}
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
        </OdsFormField>
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
            navigate(ROUTES_URLS.root);
          }}
          label={t('key_management_service_create_cta_cancel')}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.md}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={!selectedRegion}
          onClick={() => {
            trackClick({
              location: PageLocation.funnel,
              buttonType: ButtonType.link,
              actionType: 'navigation',
              actions: ['create_kms', 'confirm', selectedRegion],
            });
            setOrderInitiated();
          }}
          icon={ODS_ICON_NAME.externalLink}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.left}
          label={t('key_management_service_create_cta_order')}
        />
      </div>
    </>
  );
};

export default RegionSelector;
