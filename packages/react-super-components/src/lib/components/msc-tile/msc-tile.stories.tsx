import React from 'react'
import { localeList, defaultLocale } from '@ovhcloud/msc-utils';
import { MscTile, MscTileProps } from '.'
import { Meta } from '@storybook/react'
import { StoryFn } from '@storybook/react'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof MscTile> = {
  title: 'Atoms/MscTile',
  component: MscTile,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    category: {
      description: 'Top label of the tile',
      control: 'text',
    },
    tileTitle: { control: 'text', description: 'Title of the tile' },
    tileDescription: {
      control: 'text',
      description: 'Description of the tile',
    },
    href: { control: 'text', description: 'URL of the tile and link' },
    isExternalHref: {
      control: 'boolean',
      description:
        'Change the icon of the link to indicate if the link is internal or external',
      table: {
        defaultValue: { summary: false },
      },
    },
    imgSrc: {
      control: 'text',
      description: 'URL of the image to display in the header of the tile',
    },
    imgAlt: { control: 'text', description: 'Alternative label of the image' },
    hasBadges: {
      control: 'boolean',
      description:
        'Display examples of badges in the story (in the actual code there is a badge slot)',
    },
    hasFooter: {
      control: 'boolean',
      description:
        'Display an example of footer containing a button in the tile (in the actual code there is a footer slot)',
    },
    locale: {
      description: 'Locale of the labels',
      control: 'select',
      options: localeList,
      table: {
        defaultValue: { summary: defaultLocale },
      },
    },
    dataTracking: {
      description: 'Tracking label sent when the tile or the link is clicked',
    },
  },
  args: {
    category: 'Tutoriel',
    hasBadges: true,
    hasFooter: true,
    isExternalHref: false,
    locale: defaultLocale,
  },
}
export default meta

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof MscTile> = (args: MscTileProps) => <MscTile {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  category: 'NAS',
  tileTitle: 'Titre du produit',
  tileDescription:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  href: 'https://ovh.com',
  imgSrc:
    'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
  imgAlt: 'offer',
  dataTracking: 'home::dashboard::test',
};

export const Secondary = Template.bind({})
Secondary.args = {
  category: 'Button',
  variant: 'SECONDARY',
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  category: 'Button',
  variant: 'TERTIARY',
}

export const Disabled = Template.bind({})
Disabled.args = {
  category: 'Button',
  isDisabled: true,
}
