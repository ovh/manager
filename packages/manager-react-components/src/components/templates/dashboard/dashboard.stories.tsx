import React from 'react';
import { Meta } from '@storybook/react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsMessage,
  OdsTabs,
  OdsTab,
} from '@ovhcloud/ods-components/react';
import { DashboardTile } from '../../content';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { DashboardLayout, DashboardLayoutProps } from './dashboard.component';
import GuideButton, {
  GuideItem,
} from '../../navigation/menus/guide/guide.component';
import './dashboard.stories.css';
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

export const defaultProps: DashboardLayoutProps = {
  header: {
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />,
  },
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: (
    <OdsMessage className="w-full" color={ODS_MESSAGE_COLOR.success}>
      Votre service a été créé avec succès
    </OdsMessage>
  ),
  subtitle: 'Lorem ipsum',
  backLinkLabel: 'Retour à la XXX',
  onClickReturn: () => {
    console.log('back link click');
  },
  subdescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,',
  tabs: (
    <OdsTabs>
      <OdsTab id="tab1" role="tab">
        Tabs 1
      </OdsTab>
      <OdsTab id="tab2" role="tab">
        Tabs 2
      </OdsTab>
      <OdsTab id="tab3" role="tab">
        Tabs 3
      </OdsTab>
    </OdsTabs>
  ),
  content: (
    <DashboardGridLayout>
      <DashboardTile
        key={1}
        title="General info"
        items={[
          { id: '1', label: 'Name', value: 'service anme' },
          { id: '2', label: 'Service ID', value: 'xxxx-1299075' },
          { id: '3', label: 'Datacentre location', value: 'Madrid' },
        ]}
      />
      <DashboardTile
        key={2}
        title="Configuration"
        items={[{ id: '1', label: 'Quota 1', value: <div>Quota 1</div> }]}
      />
      <DashboardTile
        key={3}
        title="Billing"
        items={[
          { id: '1', label: 'Creation date', value: '19 Agost 2028' },
          { id: '2', label: 'Next payment', value: '1 January 2029' },
          { id: '3', label: 'Contact', value: 'Manager' },
        ]}
      />
    </DashboardGridLayout>
  ),
  breadcrumb: (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem href="/vrack-services" label="Vrack Services" />
      <OdsBreadcrumbItem href="/vrs-abc-def-ghi" label="vrs-abc-def-ghi" />
    </OdsBreadcrumb>
  ),
};

const meta: Meta<typeof DashboardLayout> = {
  title: 'Templates/Dashboard (deprecated)',
  component: DashboardLayout,
  argTypes: {},
  args: defaultProps,
};

export default meta;
