import React from 'react';
import { Meta } from '@storybook/react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import {
  DashboardTile,
  BaseLayout,
  GuideMenu,
  GuideMenuItem,
  DashboardGridLayout,
  ActionMenu,
  ChangelogLinks,
  ChangelogButton,
} from '@ovh-ux/manager-ui-kit';
import {
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  Tab,
  Table,
  Badge,
} from '@ovhcloud/ods-react';

import { withRouter } from 'storybook-addon-react-router-v6';

const guideItems: GuideMenuItem[] = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: '_blank',
    label: 'ovh.com',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: '_blank',
    label: 'Guides OVH',
  },
];

const rows = [
  {
    id: 'user-t',
    name: 'user-t',
    description: 'Lorem ipsum dolor',
  },
  {
    id: 'user-n',
    name: 'user-n',
    description: 'Lorem ipsum dolor',
  },
  {
    id: 'user-x',
    name: 'user-x',
    description: 'Lorem ipsum dolor',
  },
  {
    id: 'user-y',
    name: 'user-y',
    description: 'Lorem ipsum dolor',
  },
];

const changelogChapters: string[] = ['baremetal', 'server', 'dedicated'];

const changelogLinks: ChangelogLinks = {
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
  'feature-request':
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Baremetal',
};

const SampleTable = () => (
  <Table>
    <table className="w-full">
      <thead>
        <tr>
          <th scope="col">Nom</th>
          <th scope="col">Description</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((element) => (
          <tr key={element.id}>
            <td scope="row">{element.name}</td>
            <td scope="row">{element.description}</td>
            <td scope="row">
              <Badge>Ready</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Table>
);

const SampleBreadcrumb = ({ items }) => (
  <Breadcrumb>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">{items[0]}</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">{items[1]}</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
);

const SampleTabs = () => (
  <Tabs defaultValue="tab1">
    <TabList>
      <Tab value="tab1">General Information</Tab>
      <Tab value="tab2">Tabs 2</Tab>
    </TabList>
  </Tabs>
);

export const completeBaseLayoutExample = {
  breadcrumb: <SampleBreadcrumb items={['App Name', 'Current Page Name']} />,
  header: {
    title: 'Title of the Page',
    GuideMenu: <GuideMenu items={guideItems} />,
    changelogButton: (
      <ChangelogButton links={changelogLinks} chapters={changelogChapters} />
    ),
  },
  backLink: {
    label: 'Backlink Label',
    onClick: () => {
      console.log('back link click');
    },
  },
  description:
    'Description of the Page: Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  message: (
    <Message color={MESSAGE_COLOR.success}>
      <MessageIcon name="circle-check" />
      Sample Message: Sit amet consectetur adipiscing elit quisque faucibus ex.
    </Message>
  ),
  tabs: <SampleTabs />,
  subtitle: 'Sub-heading of the Page',
  children: <main>Render Main content here</main>,
};

const listingTemplateProps = {
  breadcrumb: (
    <SampleBreadcrumb items={['Vrack Services', 'vrs-abc-def-ghi']} />
  ),
  header: {
    title: 'Vrack Services',
    GuideMenu: <GuideMenu items={guideItems} />,
    changelogButton: (
      <ChangelogButton links={changelogLinks} chapters={changelogChapters} />
    ),
  },
  description:
    'Description de la listing, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: (
    <Message color={MESSAGE_COLOR.success}>
      Votre service a été créé avec succès
    </Message>
  ),
  children: <SampleTable />,
};

export const ListingTemplate = () => <BaseLayout {...listingTemplateProps} />;

const dashboardTemplateProps = {
  breadcrumb: (
    <SampleBreadcrumb items={['Vrack Services', 'vrs-abc-def-ghi']} />
  ),
  header: {
    title: 'Vrack Services',
    GuideMenu: <GuideMenu items={guideItems} />,
    changelogButton: (
      <ChangelogButton links={changelogLinks} chapters={changelogChapters} />
    ),
  },
  backLink: {
    label: 'Retour à la XXX',
    onClick: () => {
      console.log('back link click');
    },
  },
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: (
    <Message color={MESSAGE_COLOR.success}>
      <MessageIcon name="circle-check" />
      Votre service a été créé avec succès
    </Message>
  ),
  tabs: <SampleTabs />,
  children: (
    <DashboardGridLayout>
      <DashboardTile
        key={1}
        title="General info"
        items={[
          { id: '1', label: 'Name', value: 'name 1' },
          { id: '2', label: 'Service ID', value: 'xxxx-128875' },
          {
            id: '3',
            label: 'Datacentre location',
            value: (
              <div className="flex">
                <div className="mr-auto">Test value</div>
                <ActionMenu
                  id="base-story-action-menu"
                  isCompact
                  items={[
                    {
                      id: 1,
                      label: 'Edit',
                    },
                    {
                      id: 2,
                      label: 'Delete',
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
      <DashboardTile
        key={2}
        title="Configuration"
        items={[
          { id: '1', label: 'Quota', value: <div>Quota description</div> },
        ]}
      />
      <DashboardTile
        key={3}
        title="Billing"
        items={[
          { id: '1', label: 'Creation date', value: '15 July 2022' },
          { id: '2', label: 'Next payment', value: '1 February 2023' },
          { id: '3', label: 'Contact', value: 'Manager contact' },
        ]}
      />
    </DashboardGridLayout>
  ),
};

export const DashboardTemplate = () => (
  <BaseLayout {...dashboardTemplateProps} />
);

const meta: Meta<typeof BaseLayout> = {
  decorators: [withRouter],
  title: 'Manager UI Kit/Templates/Base Layout',
  component: BaseLayout,
  argTypes: {},
  args: completeBaseLayoutExample,
};

export default meta;
