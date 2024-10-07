import React from 'react';
import { Meta } from '@storybook/react';
import {
  OsdsBreadcrumb,
  OsdsTile,
  OsdsDivider,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
  OsdsTable,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_DIVIDER_SIZE, ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { Headers } from '../../content';
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
    target: OdsHTMLAnchorElementTarget._blank,
    label: 'ovh.com',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: OdsHTMLAnchorElementTarget._blank,
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
  <OsdsTable>
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
              <OsdsChip
                size={ODS_CHIP_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.info}
                inline
              >
                READY
              </OsdsChip>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </OsdsTable>
);

export const listingTemplateProps = {
  breadcrumb: (
    <OsdsBreadcrumb
      className="flex-start"
      items={[
        { label: 'vRack Services', href: '/vrack-services' },
        { label: 'vrs-abc-def-ghi', href: '/vrs-abc-def-ghi' },
      ]}
    />
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
    <OsdsBreadcrumb
      className="flex-start"
      items={[
        { label: 'vRack Services', href: '/vrack-services' },
        { label: 'vrs-abc-def-ghi', href: '/vrs-abc-def-ghi' },
      ]}
    />
  ),
  header: {
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />,
  },
  // subtitle: 'Lorem ipsum',
  backLinkLabel: 'Retour à la XXX',
  onClickReturn: () => {
    console.log('back link click');
  },
  // subdescription:
  //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,',
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
    <>
      <OsdsTabs>
        <OsdsTabBar slot="top">
          <OsdsTabBarItem panel="tab1" role="tab">
            Informations générales
          </OsdsTabBarItem>
          <OsdsTabBarItem panel="tab2" role="tab">
            Tabs 2
          </OsdsTabBarItem>
        </OsdsTabBar>
      </OsdsTabs>
      <OsdsDivider separator size={ODS_DIVIDER_SIZE.zero} />
    </>
  ),
  children: (
    <DashboardGridLayout>
      <OsdsTile rounded>
        <span slot="start">
          <Headers subtitle="Tile 1" />
        </span>
      </OsdsTile>
      <OsdsTile rounded>
        <span slot="start">
          <Headers subtitle="Tile 2" />
        </span>
      </OsdsTile>
      <OsdsTile rounded>
        <span slot="start">
          <Headers subtitle="Tile 3" />
        </span>
      </OsdsTile>
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
