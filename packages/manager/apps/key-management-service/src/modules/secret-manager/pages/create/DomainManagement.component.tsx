import React, { useContext, useEffect, useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useOkmsList } from '@/data/hooks/useOkms';
import { useOrderCatalogOkms } from '@/data/hooks/useOrderCatalogOkms';
import { OKMS } from '@/types/okms.type';
import { DomainSelector } from './DomainSelector.component';
import { RegionSelector } from './RegionSelector.component';

type DomainManagementProps = {
  selectedDomainId: string;
  setSelectedDomainId: React.Dispatch<React.SetStateAction<string>>;
};

export const DomainManagement = ({
  selectedDomainId,
  setSelectedDomainId,
}: DomainManagementProps) => {
  const { t } = useTranslation(['secret-manager/create', NAMESPACES.ERROR]);
  const { environment } = useContext(ShellContext);
  const {
    data: orderCatalogOKMS,
    error: OrderCatalogError,
    isLoading: isLoadingOrderCatalog,
  } = useOrderCatalogOkms(environment.getUser().ovhSubsidiary);

  const [selectedRegion, setSelectedRegion] = useState<string>();
  const [regionDomains, setRegionDomains] = useState<OKMS[]>([]);

  const {
    data: domains,
    error: okmsError,
    isLoading: isOkmsListLoading,
  } = useOkmsList();

  const [searchParams, setSearchParams] = useSearchParams();

  // INITIAL REGION AND DOMAIN SELECTION
  // when the domain list is fetched and there's a domain id as a search param
  // -> select the domain's Region
  // -> select the domain
  useEffect(() => {
    // domain from the secret list
    const domainIdSearchParam = searchParams.get(
      SECRET_MANAGER_SEARCH_PARAMS.domainId,
    );

    if (!domains || !domainIdSearchParam) return;

    const currentDomain = domains.pages[0].data.find(
      (domain) => domain.id === domainIdSearchParam,
    );

    if (!currentDomain) {
      setSearchParams({});
      return;
    }

    setSelectedRegion(currentDomain.region);
    setSelectedDomainId(domainIdSearchParam);
  }, [domains, searchParams]);

  // when a region is selected
  // -> reset the region domain list
  // -> select a domain if applicable
  useEffect(() => {
    if (!domains || !selectedRegion) return;

    // get the filtered domain list by region
    const filteredDomainList = domains.pages[0].data.filter(
      (domain) => domain.region === selectedRegion,
    );

    // reset the domain list
    setRegionDomains(filteredDomainList);

    // if the filtered domain list is empty, reset the selected domain
    if (filteredDomainList.length === 0) {
      setSelectedDomainId(undefined);
      return;
    }

    // find the selectedDomain in the filtered list
    const selectedDomain = filteredDomainList.find(
      (domain) => domain.id === selectedDomainId,
    );

    // if the selectedDomain is not in the list, select the first domain of the list
    if (!selectedDomain) {
      setSelectedDomainId(filteredDomainList[0].id);
    }
  }, [selectedRegion, domains]);

  if (OrderCatalogError || okmsError) {
    const message = OrderCatalogError
      ? OrderCatalogError.response?.data?.message
      : okmsError.message;

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
      <OdsText preset="heading-2">{t('region_section_title')}</OdsText>
      <RegionSelector
        regions={orderCatalogOKMS.plans[0].configurations[0].values}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
      <DomainSelector
        domains={regionDomains}
        onDomainSelection={setSelectedDomainId}
        selectedDomain={selectedDomainId}
      />
    </div>
  );
};
