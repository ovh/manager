import React, { useContext, useEffect, useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { filterOkmsListByRegion } from '@secret-manager/utils/okms';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useOkmsList } from '@/data/hooks/useOkms';
import { useOrderCatalogOkms } from '@/data/hooks/useOrderCatalogOkms';
import { OkmsSelector } from './OkmsSelector.component';
import { RegionSelector } from './RegionSelector.component';
import { useOrderOkmsModalContext } from '@/common/pages/OrderOkmsModal/OrderOkmsModalContext';

const OKMS_LIST_REFETCH_INTERVAL_DISABLE = 0;
const OKMS_LIST_REFETCH_INTERVAL_IN_MS = 2000; // 2 seconds

type OkmsManagementProps = {
  selectedOkmsId: string;
  setSelectedOkmsId: React.Dispatch<React.SetStateAction<string>>;
};

export const OkmsManagement = ({
  selectedOkmsId,
  setSelectedOkmsId,
}: OkmsManagementProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ERROR]);
  const { addSuccess } = useNotifications();
  const { environment } = useContext(ShellContext);
  const {
    data: orderCatalogOKMS,
    error: orderCatalogError,
    isLoading: isLoadingOrderCatalog,
  } = useOrderCatalogOkms(environment.getUser().ovhSubsidiary);

  const regions = orderCatalogOKMS?.plans[0]?.configurations[0]?.values;

  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();

  const {
    orderProcessingRegion,
    resetOrderProcessingRegion,
  } = useOrderOkmsModalContext();
  const isOkmsOrderProcessing = Boolean(orderProcessingRegion);

  const [refetchInterval, setRefetchInterval] = useState(
    OKMS_LIST_REFETCH_INTERVAL_DISABLE,
  );

  const {
    data: okmsList,
    error: okmsError,
    isLoading: isOkmsListLoading,
  } = useOkmsList({ refetchInterval });

  // Manage Okms order processing
  useEffect(() => {
    if (!orderProcessingRegion) return;

    const regionOkmsList = filterOkmsListByRegion(
      okmsList,
      orderProcessingRegion,
    );
    // If region has no okms then when we refresh the list periodically
    if (regionOkmsList.length === 0) {
      setRefetchInterval(OKMS_LIST_REFETCH_INTERVAL_IN_MS);
      return;
    }

    // Handle successfully created okms
    setRefetchInterval(OKMS_LIST_REFETCH_INTERVAL_DISABLE);
    resetOrderProcessingRegion();
    addSuccess(t('create_okms_success'), true);
    setSelectedRegion(orderProcessingRegion);
    setSelectedOkmsId(regionOkmsList[0].id);
  }, [okmsList, orderProcessingRegion]);

  const [searchParams, setSearchParams] = useSearchParams();

  // INITIAL REGION AND OKMS SELECTION
  // when the okms list is fetched and there's an okms id as a search param
  // -> select the query okms Region
  // -> set the region's okms List
  // -> select the okms
  useEffect(() => {
    // okms from the secret list page
    const okmsIdSearchParam = searchParams.get(
      SECRET_MANAGER_SEARCH_PARAMS.okmsId,
    );

    if (!okmsList || selectedRegion) return;

    const okmsFromSearchParam = okmsList.find(
      (okms) => okms.id === okmsIdSearchParam,
    );

    if (!okmsFromSearchParam) {
      setSearchParams({});
      setSelectedRegion(undefined);
      setSelectedOkmsId(undefined);
      return;
    }

    setSelectedRegion(okmsFromSearchParam.region);
    setSelectedOkmsId(okmsIdSearchParam);
  }, [okmsList, searchParams, selectedRegion]);

  const handleRegionSelection = (region: string) => {
    setSelectedRegion(region);

    if (!okmsList) return;

    const regionOkmsList = filterOkmsListByRegion(okmsList, region);

    if (regionOkmsList.length === 0) {
      setSelectedOkmsId(undefined);
      return;
    }
    setSelectedOkmsId(regionOkmsList[0].id);
  };

  if (orderCatalogError || okmsError) {
    const message = orderCatalogError
      ? orderCatalogError.response?.data?.message
      : okmsError.response?.data?.message;

    return (
      <OdsMessage color="danger">
        {t(`${NAMESPACES.ERROR}:error_message`, {
          message,
        })}
      </OdsMessage>
    );
  }

  if (isLoadingOrderCatalog || isOkmsListLoading) {
    return <OdsSpinner data-testid="regionsSpinner" />;
  }

  return (
    <div className="flex flex-col gap-5">
      <OdsText preset="heading-2">
        {t('create_secret_form_region_section_title')}
      </OdsText>
      <RegionSelector
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={handleRegionSelection}
      />
      <OkmsSelector
        okmsList={filterOkmsListByRegion(okmsList, selectedRegion)}
        selectedRegion={selectedRegion}
        selectedOkms={selectedOkmsId}
        isOkmsOrderProcessing={isOkmsOrderProcessing}
        onOkmsSelection={setSelectedOkmsId}
      />
    </div>
  );
};
