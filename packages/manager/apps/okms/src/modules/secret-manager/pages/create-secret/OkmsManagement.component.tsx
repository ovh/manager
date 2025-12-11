import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { filterOkmsListByRegion } from '@secret-manager/utils/okms';
import { useTranslation } from 'react-i18next';

import { OdsMessage, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { RegionPicker } from '@/common/components/region-picker/RegionPicker.component';
import { usePendingOkmsOrder } from '@/common/hooks/usePendingOkmsOrder/usePendingOkmsOrder';

import { OkmsSelector } from './OkmsSelector.component';

type OkmsManagementProps = {
  selectedOkmsId: string | undefined;
  setSelectedOkmsId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const OkmsManagement = ({ selectedOkmsId, setSelectedOkmsId }: OkmsManagementProps) => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ERROR]);

  // Poll for new OKMS and handle the pending order
  // Then select the new OKMS when it's available
  usePendingOkmsOrder({
    onSuccess: (okmsId) => {
      setSelectedOkmsId(okmsId);
    },
  });

  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();

  const { data: okmsList, error: okmsError, isPending: isOkmsListLoading } = useOkmsList();
  const okmsActiveList = okmsList?.filter((okms) => okms.iam.state === 'OK');

  const [searchParams, setSearchParams] = useSearchParams();

  // INITIAL REGION AND OKMS SELECTION
  // when the okms list is fetched and there's an okms id as a search param
  // -> select the query okms Region
  // -> set the region's okms List
  // -> select the okms
  useEffect(() => {
    // okms from the secret list page
    const okmsIdSearchParam = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.okmsId) ?? undefined;

    if (!okmsActiveList || selectedRegion) return;

    const okmsFromSearchParam = okmsActiveList.find((okms) => okms.id === okmsIdSearchParam);

    if (!okmsFromSearchParam) {
      setSearchParams({});
      // Code smell, but hard to fix right now
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRegion(undefined);
      setSelectedOkmsId(undefined);
      return;
    }

    setSelectedRegion(okmsFromSearchParam.region);
    setSelectedOkmsId(okmsIdSearchParam);
  }, [
    okmsActiveList,
    searchParams,
    selectedRegion,
    setSearchParams,
    setSelectedRegion,
    setSelectedOkmsId,
  ]);

  const handleRegionSelection = (region: string | undefined) => {
    setSelectedRegion(region);

    if (!okmsActiveList) return;

    const regionOkmsList = region ? filterOkmsListByRegion(okmsActiveList, region) : [];

    if (regionOkmsList.length === 0) {
      setSelectedOkmsId(undefined);
      return;
    }
    setSelectedOkmsId(regionOkmsList[0]?.id);
  };

  if (okmsError) {
    return (
      <OdsMessage color="danger">
        {t(`${NAMESPACES.ERROR}:error_message`, {
          message: okmsError.response?.data?.message,
        })}
      </OdsMessage>
    );
  }

  if (isOkmsListLoading) {
    return <OdsSpinner data-testid="regionsSpinner" />;
  }

  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <OdsText preset="heading-2">{t('create_secret_form_region_section_title')}</OdsText>
        <RegionPicker selectedRegion={selectedRegion} setSelectedRegion={handleRegionSelection} />
      </div>
      <OkmsSelector
        okmsList={filterOkmsListByRegion(okmsActiveList ?? [], selectedRegion)}
        selectedRegion={selectedRegion}
        selectedOkms={selectedOkmsId}
        onOkmsSelection={setSelectedOkmsId}
      />
    </div>
  );
};
