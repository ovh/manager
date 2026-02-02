import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { OKMS } from '@key-management-service/types/okms.type';
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
  const { t } = useTranslation(NAMESPACES.ERROR);
  const [_, setSearchParams] = useSearchParams();

  // Poll for new OKMS and handle the pending order
  // Then select the new OKMS when it's available
  usePendingOkmsOrder({
    onSuccess: (okmsId) => {
      setSelectedOkmsId(okmsId);
    },
  });

  const { data: okmsList, error: okmsError, isPending: isOkmsListLoading } = useOkmsList();

  // Filters the okms list to only include active okms
  const okmsActiveList = okmsList?.filter((okms) => okms.iam.state === 'OK');

  // Unselects the selected okms id if it is not in the okms list
  // This prevents invalid okmsId coming from the url to be selected
  useEffect(() => {
    if (!selectedOkmsId) {
      return;
    }
    const isSelectedOkmsInList = okmsActiveList?.some((okms) => okms.id === selectedOkmsId);
    if (isSelectedOkmsInList === false) {
      setSelectedOkmsId(undefined);
      setSearchParams({});
    }
  }, [okmsActiveList, selectedOkmsId, setSearchParams, setSelectedOkmsId]);

  if (okmsError) {
    return (
      <OdsMessage color="danger">
        {t('error_message', {
          message: okmsError.response?.data?.message,
        })}
      </OdsMessage>
    );
  }

  if (isOkmsListLoading) {
    return <OdsSpinner data-testid="regionsSpinner" />;
  }

  return (
    <OkmsManagementContent
      selectedOkmsId={selectedOkmsId}
      setSelectedOkmsId={setSelectedOkmsId}
      okmsList={okmsActiveList ?? []}
    />
  );
};

type OkmsManagementContentProps = OkmsManagementProps & {
  okmsList: OKMS[];
};

export const OkmsManagementContent = ({
  selectedOkmsId,
  setSelectedOkmsId,
  okmsList,
}: OkmsManagementContentProps) => {
  const { t } = useTranslation('secret-manager');

  const preSelectedOkms = okmsList.find((okms) => okms.id === selectedOkmsId);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(preSelectedOkms?.region);

  const handleRegionSelection = (region: string | undefined) => {
    setSelectedRegion(region);

    const regionOkmsList = region ? filterOkmsListByRegion(okmsList, region) : [];

    if (regionOkmsList.length === 0) {
      setSelectedOkmsId(undefined);
      return;
    }
    setSelectedOkmsId(regionOkmsList[0]?.id);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <OdsText preset="heading-2">{t('create_secret_form_region_section_title')}</OdsText>
        <RegionPicker selectedRegion={selectedRegion} setSelectedRegion={handleRegionSelection} />
      </div>
      <OkmsSelector
        okmsList={filterOkmsListByRegion(okmsList, selectedRegion)}
        selectedRegion={selectedRegion}
        selectedOkms={selectedOkmsId}
        onOkmsSelection={setSelectedOkmsId}
      />
    </div>
  );
};
