import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Notifications,
  BaseLayout,
  ChangelogButton,
  ChangelogLinks,
  Datagrid,
  Clipboard,
  Links,
} from '@ovh-ux/manager-react-components';
import { OdsButton, OdsSpinner } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useObservabilityServices } from '@/data/hooks/useObservability';

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/ovh/infrastructure-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};

export type TabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

const SettingsPage = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useObservabilityServices();

  const flattenData = useMemo(
    () =>
      data
        ? data.map((item) => {
            return {
              id: item.id,
              name: item.currentState.displayName ?? item.id,
            };
          })
        : [],
    [data],
  );

  const DatagridServiceIdCell = (service: { id: string; name: string }) => {
    return <Clipboard className="w-full" value={service.id} />;
  };

  const DatagridServiceNameCell = (service: { id: string; name: string }) => {
    const settingsBasePath = `/settings/${service.id}`;

    return (
      <Links
        onClickReturn={() => {
          navigate(`${settingsBasePath}/general-informations`);
        }}
        label={service.name}
      />
    );
  };

  const columns = [
    {
      id: 'name',
      cell: DatagridServiceNameCell,
      label: 'Service name',
    },
    {
      id: 'id',
      cell: DatagridServiceIdCell,
      label: 'Id',
    },
  ];

  return (
    <BaseLayout
      header={{
        title: 'Settings',
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }}
      message={<Notifications />}
    >
      <div className="flex flex-col gap-6">
        <OdsButton
          className="w-fit"
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_BUTTON_COLOR.primary}
          onClick={() => {
            navigate('');
          }}
          label="Commander un service"
          isDisabled={isLoading}
        />
        {isLoading ? (
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        ) : (
          <>
            {data && (
              <Datagrid
                isLoading={isLoading}
                columns={columns}
                items={flattenData}
                totalItems={data.length || 0}
                contentAlignLeft
              />
            )}
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default SettingsPage;
