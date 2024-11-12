import React from 'react';
import { Meta } from '@storybook/react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsTab,
  OdsTabs,
  OdsTable,
  OdsBadge,
} from '@ovhcloud/ods-components/react';
import { DashboardTile } from '../../content';
import OdsNotification from '../../notifications/ods-notification';
import { NotificationType } from '../../notifications/useNotifications';
import { BaseLayout } from './base.component';
import GuideButton, {
  GuideItem,
} from '../../navigation/menus/guide/guide.component';
import './base.stories.css';
import { DashboardGridLayout } from '../layout/layout.component';

const guideItems: GuideItem[] = [
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

const Tabs = () => (
  <OdsTable>
    <table>
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
              <OdsBadge label="Ready" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </OdsTable>
);

export const listingTemplateProps = {
  breadcrumb: (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem href="/vrack-services" label="Vrack Services" />
      <OdsBreadcrumbItem href="/vrs-abc-def-ghi" label="vrs-abc-def-ghi" />
    </OdsBreadcrumb>
  ),
  header: {
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />,
  },
  description:
    'Description de la listing, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: (
    <OdsNotification
      notification={{
        uid: 87879789,
        content: 'Votre service a été créé avec succès',
        type: NotificationType.Success,
      }}
    />
  ),
  children: <Tabs />,
  subtitle: '',
  backLinkLabel: '',
  onClickReturn: () => {
    console.log('back link click');
  },
  subdescription: '',
};

const dashboardTemplateProps = {
  breadcrumb: (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem href="/vrack-services" label="Vrack Services" />
      <OdsBreadcrumbItem href="/vrs-abc-def-ghi" label="vrs-abc-def-ghi" />
    </OdsBreadcrumb>
  ),
  header: {
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />,
  },
  subtitle: '',
  backLinkLabel: 'Retour à la XXX',
  onClickReturn: () => {
    console.log('back link click');
  },
  subdescription: '',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: (
    <OdsNotification
      notification={{
        uid: 87879789,
        content: 'Votre service a été créé avec succès',
        type: NotificationType.Success,
      }}
    />
  ),
  tabs: (
    <OdsTabs>
      <OdsTab is-selected="true" id="tab1">
        Informations générales
      </OdsTab>
      <OdsTab id="tab2">Tabs 2</OdsTab>
    </OdsTabs>
  ),
  children: (
    <DashboardGridLayout>
      <DashboardTile
        key={1}
        title="General info"
        items={[
          { id: '1', label: 'Name', value: 'name 1' },
          { id: '2', label: 'Service ID', value: 'xxxx-128875' },
          { id: '3', label: 'Datacentre location', value: 'Paris Roubaix' },
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
  title: 'Templates/Base',
  component: BaseLayout,
  argTypes: {},
  args: listingTemplateProps,
};

export default meta;
