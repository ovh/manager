/* eslint-disable import/no-extraneous-dependencies */
import {
  OdsBadge,
  OdsTab,
  OdsTabs,
} from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';

export default {
  story: 'Long tabs',
  customComponentExemple: (
    <div className="max-w-[500px]">
      <TabsMenu
        tabs={[
          { href: '', label: 'Tab1' },
          { href: '../new', label: 'Tab2', count: 5 },
          { href: '../', label: 'Tab3' },
          { href: '../', label: 'Tab4' },
          { href: '../', label: 'Tab5' },
          { href: '../', label: 'Tab6' },
          { href: '../', label: 'Tab7' },
          { href: '../', label: 'Tab8' },
          { href: '../', label: 'Tab9' },
          { href: '../', label: 'Tab10' },
          { href: '../', label: 'Tab11' },
          { href: '../', label: 'Tab12' },
          { href: '../', label: 'Tab13' },
          { href: '../', label: 'Tab14' },
          { href: '../', label: 'Tab15' },
        ]}
      />
    </div>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <div className="max-w-[500px]">
      <OdsTabs>
        <OdsTab>Tab1</OdsTab>
        <OdsTab>
          Tab2 <OdsBadge label={(5).toString()} />
        </OdsTab>
        <OdsTab>Tab3</OdsTab>
        <OdsTab>Tab4</OdsTab>
        <OdsTab>Tab5</OdsTab>
        <OdsTab>Tab6</OdsTab>
        <OdsTab>Tab7</OdsTab>
        <OdsTab>Tab8</OdsTab>
        <OdsTab>Tab9</OdsTab>
        <OdsTab>Tab10</OdsTab>
        <OdsTab>Tab11</OdsTab>
        <OdsTab>Tab12</OdsTab>
        <OdsTab>Tab13</OdsTab>
        <OdsTab>Tab14</OdsTab>
        <OdsTab>Tab15</OdsTab>
      </OdsTabs>
    </div>
  ),
  ODSComponentResult: StoryResult.fail,
};
