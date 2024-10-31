import { useState } from 'react';
import { useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsIcon,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  PciGuidesHeader,
  useProjectUrl,
  Title,
  useColumnFilters,
  FilterList,
} from '@ovh-ux/manager-react-components';
import { FilterComparator } from '@ovh-ux/manager-core-api';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import BackButton from '@/components/back-button/BackButton.component';
import SubnetDataGrid from './datagrid/Datagrid.component';
import usePrivateNetwork from '@/hooks/usePrivateNetwork/usePrivateNetwork';
import useSubnets from '@/hooks/useSubnets/useSubnets';

const SubnetListing: React.FC = () => {
  const { t } = useTranslation('listing');
  const { data: project } = useProject();
  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState<string>('');

  const { networkId } = useParams();

  const { network, isLoading: isNetworkLoading } = usePrivateNetwork(networkId);

  const { subnets, isLoading: isSubnetLoading } = useSubnets(
    project.project_id,
    network?.id,
    network?.region,
    filters,
  );

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectUrl,
            label: project.description,
          },
          {
            href: backHref,
            label: t('pci_projects_project_network_private'),
          },
          {
            label: network?.name,
          },
        ]}
      />
      <div className="header my-8">
        <div className="flex items-center justify-between">
          <Title>{network?.name}</Title>
          <PciGuidesHeader category="instances" />
        </div>
      </div>

      <BackButton
        title={t('pci_projects_project_network_private_back_to_list')}
      />

      {isNetworkLoading || isSubnetLoading ? (
        <div className="mt-8 text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between my-8">
            <OsdsButton
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
              inline
              disabled
            >
              <OsdsIcon
                name={ODS_ICON_NAME.ADD}
                size={ODS_ICON_SIZE.xxs}
                color={ODS_TEXT_COLOR_INTENT.primary}
                className="mr-3"
              />
              {t('pci_projects_project_network_private_subnet_create')}
            </OsdsButton>
            <div className="flex items-center">
              <OsdsButton
                className="mr-4"
                color={ODS_THEME_COLOR_INTENT.primary}
                variant={ODS_BUTTON_VARIANT.stroked}
                size={ODS_BUTTON_SIZE.sm}
                inline
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.REFRESH}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_ICON_SIZE.xs}
                  className="mr-4"
                />
              </OsdsButton>
              <OsdsSearchBar
                value={searchField}
                onOdsSearchSubmit={({ detail }) => {
                  addFilter({
                    key: 'search',
                    value: detail.inputValue,
                    comparator: FilterComparator.Includes,
                    label: '',
                  });
                  setSearchField('');
                }}
              />
            </div>
          </div>

          <div className="my-8">
            <FilterList filters={filters} onRemoveFilter={removeFilter} />
          </div>

          <SubnetDataGrid data={subnets || []} />
        </>
      )}
    </>
  );
};

export default SubnetListing;
