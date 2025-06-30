import React, { useContext, useEffect, useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { Region } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useOkmsList } from '@/data/hooks/useOkms';
import { useOrderCatalogOkms } from '@/data/hooks/useOrderCatalogOkms';
import { OKMS } from '@/types/okms.type';
import { RadioCard } from '@/components/RadioCard/RadioCard.component';
import { DomainSelector } from './DomainSelector.component';

interface IRegionSelector {
  selectedDomainId: string;
  setSelectedDomainId: React.Dispatch<React.SetStateAction<string>>;
}

export const RegionSelector = ({
  selectedDomainId,
  setSelectedDomainId,
}: IRegionSelector) => {
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

  // domain from the secret list
  const [searchParams] = useSearchParams();
  const domainIdSearchParam = searchParams.get(
    SECRET_MANAGER_SEARCH_PARAMS.domainId,
  );

  // INITIAL REGION AND DOMAIN SELECTION
  // when the domain list is fetched and there's a domain id as a search param
  // -> select the domain's Region
  // -> select the domain
  useEffect(() => {
    if (!domains || !domainIdSearchParam) return;

    const currentDomain = domains.pages[0].data.find(
      (domain) => domain.id === domainIdSearchParam,
    );
    setSelectedRegion(currentDomain.region);
    setSelectedDomainId(domainIdSearchParam);
  }, [domains, domainIdSearchParam]);

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
    return <OdsSpinner />;
  }

  return (
    <div className="flex flex-col gap-3">
      <OdsText preset="heading-3">Select Region</OdsText>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {orderCatalogOKMS.plans[0].configurations[0].values.map((region) => (
          <RadioCard
            id={region}
            onChange={(event) => setSelectedRegion(event.target.value)}
            selected={selectedRegion}
            key={region}
            name="region"
            title={<Region mode={'region'} name={region} />}
            subTitle={region}
          />
        ))}
      </div>
      <DomainSelector
        domains={regionDomains}
        onDomainSelection={setSelectedDomainId}
        selectedDomain={selectedDomainId}
      />
    </div>
  );
};
