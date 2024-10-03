import { useContext, useState } from 'react';
import {
  Outlet,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from 'react-router-dom';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsChip,
  OsdsDivider,
  OsdsIcon,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHIP_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  DataGridTextCell,
  Notifications,
  PciGuidesHeader,
  useDatagridSearchParams,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  TProject,
} from '@ovh-ux/manager-pci-common';
import { TSshKey } from '@/interface';
import { useSshKeys } from '@/api/hooks/useSsh';
import Key from '@/components/ssh-keys/listing/Key';
import RemoveSsh from '@/components/ssh-keys/listing/RemoveSsh';
import { PCI_LEVEL2 } from '@/tracking.constants';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { trackClick } = useContext(ShellContext).shell.tracking;
  const { projectId } = useParams();
  const projectUrl = useProjectUrl('public-cloud');
  const [searchField, setSearchField] = useState('');
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const project = useRouteLoaderData('ssh') as TProject;

  const columns = [
    {
      id: 'name',
      cell: (props: TSshKey) => (
        <DataGridTextCell>{props.name}</DataGridTextCell>
      ),
      label: t('pci_projects_project_sshKeys_name'),
    },
    {
      id: 'publicKey',
      cell: (props: TSshKey) => <Key publicKey={props.publicKey} />,
      label: t('pci_projects_project_sshKeys_public'),
    },
    {
      id: 'actions',
      cell: (props: TSshKey) => <RemoveSsh sshId={`${props.id}`} />,
      label: '',
    },
  ];

  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
  } = useDatagridSearchParams();

  const { error, data: sshKeys, isLoading } = useSshKeys(
    projectId || '',
    {
      pagination,
      sorting,
    },
    searchQueries,
  );

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              label: t('pci_projects_project_sshKeys_title'),
            },
          ]}
        ></OsdsBreadcrumb>
      )}
      <div className="flex items-center justify-between mt-4">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('pci_projects_project_sshKeys_title')}
        </OsdsText>
        <PciGuidesHeader category="instances"></PciGuidesHeader>
      </div>
      <OsdsDivider></OsdsDivider>
      <Notifications />

      <PciDiscoveryBanner project={project} />

      <div className="flex flex-col sm:flex-row justify-between mt-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={isDiscoveryProject(project) ? true : undefined}
          onClick={() => {
            // @TODO remove this condition when ODS disabled button issue is fixed
            if (!isDiscoveryProject(project)) {
              navigate('./add');
              trackClick({
                name: 'PCI_PROJECTS_SSH_KEYS_ADD',
                type: 'action',
                level2: PCI_LEVEL2,
              });
            }
          }}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_sshKeys_add')}
        </OsdsButton>
        {/* onOdsValueChange={({ detail }) => setSearchField(`${detail.value}`)} */}
        <OsdsSearchBar
          className="sm:w-[15rem] xs:mt-4"
          value={searchField}
          onOdsSearchSubmit={({ detail }) => {
            const { inputValue } = detail;
            if (inputValue) {
              setSearchField('');
              if (searchQueries.indexOf(inputValue) < 0) {
                setSearchQueries([...searchQueries, inputValue]);
                setPagination({
                  ...pagination,
                  pageIndex: 0,
                });
              } else {
                setSearchQueries([...searchQueries]);
              }
            }
          }}
        />
      </div>

      <div className="flex mt-4">
        {searchQueries.map((query, index) => (
          <OsdsChip
            key={index}
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_CHIP_VARIANT.flat}
            removable
            onOdsChipRemoval={() => {
              setSearchQueries(searchQueries.filter((_, i) => i !== index));
            }}
          >
            {query}
          </OsdsChip>
        ))}
      </div>

      {isLoading && (
        <div className="text-center">
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            data-testid="ListingPage-spinner"
          />
        </div>
      )}

      {!isLoading && (!error || (error && isDiscoveryProject(project))) && (
        <div>
          <Datagrid
            columns={columns}
            items={sshKeys?.rows || []}
            totalItems={sshKeys?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
            className="overflow-x-hidden px-0"
          />
        </div>
      )}
      <Outlet />
    </>
  );
}
