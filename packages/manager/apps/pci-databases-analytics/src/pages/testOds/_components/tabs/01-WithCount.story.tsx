/* eslint-disable import/no-extraneous-dependencies */
import {
  OdsBadge,
  OdsCard,
  OdsTab,
  OdsTabs,
} from '@ovhcloud/ods-components/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StoryResult } from '../Stories';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';

export default {
  story: 'With count',
  customComponentExemple: (
    <TabsMenu
      tabs={[
        { href: '', label: 'Tab1' },
        { href: '../new', label: 'Tab2', count: 5 },
        { href: '../', label: 'Tab3' },
      ]}
    />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsTabs>
      <OdsTab>Tab1</OdsTab>
      <OdsTab>
        Tab2 <OdsBadge label={(5).toString()} />
      </OdsTab>
      <OdsTab>Tab3</OdsTab>
    </OdsTabs>
  ),
  ODSComponentResult: StoryResult.warning,
};
