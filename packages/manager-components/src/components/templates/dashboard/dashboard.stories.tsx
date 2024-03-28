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
import { ODS_DIVIDER_SIZE } from '@ovhcloud/ods-components';
import { Headers } from '../../content';
import { DashboardLayout, DashboardLayoutProps } from './dashboard.component';
import { LinkType } from '../../typography/links/links.component';
import GuideButton, {
  GuideItem,
} from '../../navigation/menus/guide/guide.component';

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
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    title: 'Vrack Services',
    headerButton: <GuideButton items={guideItems} />,
  },

  linkProps: {
    label: 'Back to the list',
    href: 'https://www.ovhcloud.com',
    target: OdsHTMLAnchorElementTarget._blank,
    type: LinkType.back,
  },
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
    <div className="w-full block">
      <div>
        <OsdsMessage
          removable
          className="mb-5 w-full"
          color={ODS_THEME_COLOR_INTENT.success}
        >
          Votre service a été créé avec succès
        </OsdsMessage>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <OsdsTile rounded>
            <span slot="start">
              <Headers subtitle="Tile 1" />
            </span>
          </OsdsTile>
        </div>
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
      </div>
    </div>
  ),
  breadcrumb: (
    <OsdsBreadcrumb
      className="flex-start"
      items={[
        { label: 'Network', href: '/Network' },
        { label: 'vrackServices', href: '/vrackServices' },
      ]}
    />
  ),
};

const meta: Meta<typeof DashboardLayout> = {
  title: 'Templates/Dashboard',
  decorators: [(story) => <div className="w-4/5">{story()}</div>],
  component: DashboardLayout,
  argTypes: {},
  args: defaultProps,
};

export default meta;
