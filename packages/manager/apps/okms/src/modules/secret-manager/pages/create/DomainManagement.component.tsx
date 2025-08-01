import React, { useContext, useEffect, useState } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
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
import { DomainSelector } from './DomainSelector.component';
import { RegionSelector } from './RegionSelector.component';
import { OkmsRegionOrderSuccessful } from '@/common/pages/OrderOkmsModal/OrderOkmsModal.page';

type DomainManagementProps = {
  selectedDomainId: string;
  setSelectedDomainId: React.Dispatch<React.SetStateAction<string>>;
};

export const DomainManagement = ({
  selectedDomainId,
  setSelectedDomainId,
}: DomainManagementProps) => {
  const { t } = useTranslation(['secret-manager/create', NAMESPACES.ERROR]);
  const { addSuccess } = useNotifications();
  const { environment } = useContext(ShellContext);
  const {
    data: orderCatalogOKMS,
    error: orderCatalogError,
    isLoading: isLoadingOrderCatalog,
  } = useOrderCatalogOkms(environment.getUser().ovhSubsidiary);

  const regions = orderCatalogOKMS?.plans[0]?.configurations[0]?.values;

  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  const [updatingOkmsList, setUpdatingOkmsList] = useState(false);
  const [orderSuccessful, setOrderSuccessful] = useState(false);

  const location = useLocation();
  const state = location.state as OkmsRegionOrderSuccessful;

  // if there is an okms order, begin refreshing the okms list
  useEffect(() => {
    if (state?.orderRegion) setUpdatingOkmsList(true);
  }, [state]);

  const {
    data: domains,
    error: okmsError,
    isLoading: isOkmsListLoading,
  } = useOkmsList({
    refetchInterval: (query) => {
      if (!updatingOkmsList) return false;

      // refresh the list until there's one okms on the order region.
      const domainList = filterDomainsByRegion(
        query.state.data,
        state.orderRegion,
      );
      if (domainList.length === 0) return 2000;

      // handle successfully created domain
      setUpdatingOkmsList(false);
      setOrderSuccessful(true);
      setSelectedRegion(state.orderRegion);
      setSelectedDomainId(domainList[0].id);
      return false;
    },
  });

  useEffect(() => {
    if (orderSuccessful) {
      addSuccess(t('create_domain_success'), true);
      setOrderSuccessful(false);
    }
  }, [orderSuccessful]);

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

    if (!domains || selectedRegion) return;

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
  }, [domains, searchParams, selectedRegion]);

  const handleRegionSelection = (region: string) => {
    setSelectedRegion(region);

    if (!domains) return;

    const filteredDomainList = filterDomainsByRegion(domains, region);

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
        domains={filterDomainsByRegion(domains, selectedRegion)}
        selectedRegion={selectedRegion}
        selectedDomain={selectedDomainId}
        isUpdatingOkmsList={updatingOkmsList}
        onDomainSelection={setSelectedDomainId}
      />
    </div>
  );
};
