import React, { useContext, useEffect, useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { filterDomainsByRegion } from '@secret-manager/utils/domains';
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
    error: orderCatalogError,
    isLoading: isLoadingOrderCatalog,
  } = useOrderCatalogOkms(environment.getUser().ovhSubsidiary);

  const regions = orderCatalogOKMS?.plans[0]?.configurations[0]?.values;

  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [regionDomains, setRegionDomains] = useState<OKMS[]>([]);

  const {
    data: domains,
    error: okmsError,
    isLoading: isOkmsListLoading,
  } = useOkmsList();

  const [searchParams, setSearchParams] = useSearchParams();

  // INITIAL REGION AND DOMAIN SELECTION
  // when the domain list is fetched and there's a domain id as a search param
  // -> select the query Domain's Region
  // -> set the region's domain List
  // -> select the domain
  useEffect(() => {
    // domain from the secret list
    const domainIdSearchParam = searchParams.get(
      SECRET_MANAGER_SEARCH_PARAMS.domainId,
    );

    if (!domains || !domainIdSearchParam) return;

    const domainFromSearchParam = domains.find(
      (domain) => domain.id === domainIdSearchParam,
    );

    if (!domainFromSearchParam) {
      setSearchParams({});
      setSelectedRegion(undefined);
      setSelectedDomainId(undefined);
      return;
    }

    setSelectedRegion(domainFromSearchParam.region);
    setSelectedDomainId(domainIdSearchParam);
    setRegionDomains(
      filterDomainsByRegion(domains, domainFromSearchParam.region),
    );
  }, [domains, searchParams]);

  const handleRegionSelection = (region: string) => {
    setSelectedRegion(region);

    if (!domains) return;

    const filteredDomainList = filterDomainsByRegion(domains, region);

    setRegionDomains(filteredDomainList);

    if (filteredDomainList.length === 0) {
      setSelectedDomainId(undefined);
      return;
    }
    setSelectedDomainId(filteredDomainList[0].id);
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
      <OdsText preset="heading-2">{t('domain_section_title')}</OdsText>
      <RegionSelector
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={handleRegionSelection}
      />
      <DomainSelector
        domains={regionDomains}
        onDomainSelection={setSelectedDomainId}
        selectedDomain={selectedDomainId}
      />
    </div>
  );
};
