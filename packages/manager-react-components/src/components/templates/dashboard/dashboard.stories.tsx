import React from 'react';
import { Meta } from '@storybook/react';
import {
  OsdsBreadcrumb,
  OsdsTile,
  OsdsMessage,
  OsdsDivider,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_DIVIDER_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Headers } from '../../content';
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

export const defaultProps: DashboardLayoutProps = {
  header: {
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />,
  },
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  message: (
    <OsdsMessage
      icon={ODS_ICON_NAME.SUCCESS_CIRCLE}
      removable
      className="w-full"
      color={ODS_THEME_COLOR_INTENT.success}
    >
      Votre service a été créé avec succès
    </OsdsMessage>
  ),
  subtitle: 'Lorem ipsum',
  backLinkLabel: 'Retour à la XXX',
  onClickReturn: () => {
    console.log('back link click');
  },
  subdescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia rutrum interdum. Nullam tempor, mi eu imperdiet scelerisque, lorem nisl blandit ligula, eget sodales erat nulla a odio. Donec efficitur posuere quam. Maecenas metus sem, venenatis id mattis eget, sollicitudin sit amet nulla. Sed ac erat fermentum, porta ligula ac,',
  tabs: (
    <>
      <OsdsTabs>
        <OsdsTabBar slot="top">
          <OsdsTabBarItem panel="tab1" role="tab">
            Tabs 1
          </OsdsTabBarItem>
          <OsdsTabBarItem panel="tab2" role="tab">
            Tabs 2
          </OsdsTabBarItem>
          <OsdsTabBarItem panel="tab3" role="tab">
            Tabs 3
          </OsdsTabBarItem>
        </OsdsTabBar>
      </OsdsTabs>
      <OsdsDivider separator size={ODS_DIVIDER_SIZE.zero} />
    </>
  ),
  content: (
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
  breadcrumb: (
    <OsdsBreadcrumb
      className="flex-start"
      items={[
        { label: 'vRack Services', href: '/vrack-services' },
        { label: 'vrs-abc-def-ghi', href: '/vrs-abc-def-ghi' },
      ]}
    />
  ),
};

const meta: Meta<typeof DashboardLayout> = {
  title: 'Templates/Dashboard (deprecated)',
  component: DashboardLayout,
  argTypes: {},
  args: defaultProps,
};

export default meta;
