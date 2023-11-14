import React from 'react'
import ScTile, { MscTileProps } from './msc-tile'
import { Meta } from '@storybook/react'
import { StoryFn } from '@storybook/react'

const locale = {}
const defaultLocale = {}
const localeList = {}

export const defaultProps = {
  category: 'NAS',
  tileTitle: 'Titre du produit',
  tileDescription:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  href: 'https://ovh.com',
  imgSrc:
    'https://www.ovhcloud.com/sites/default/files/styles/offer_range_card/public/2021-06/1886_AI_Notebook1_Hero_600x400.png',
  imgAlt: 'offer',
  dataTracking: 'home::dashboard::test',
}

const meta: Meta<typeof ScTile> = {
  title: 'Atoms/MscTile',
  decorators: [
    (Story) => (
      <div className="columns-3">
        <Story />
      </div>
    ),
  ],
  component: ScTile,
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
      description: 'Change the icon of the link to indicate if the link is internal or external',
      table: {
        defaultValue: { summary: false },
      },
    },
    imgSrc: {
      control: 'text',
      description: 'URL of the image to display in the header of the tile',
    },
    imgAlt: { control: 'text', description: 'Alternative label of the image' },
    badges: {
      description: 'Display examples of badges in the story (in the actual code there is a badge slot)',
    },
    footer: {
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
  args: defaultProps,
}
export default meta

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ScTile> = (args: MscTileProps) => <ScTile {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  ...defaultProps,
}

export const WithFooter = Template.bind({})
WithFooter.args = {
  ...defaultProps,
  footer: (
    <button color="primary" className="mb-1">
      Commander
    </button>
  ),
}

export const WithBadges = Template.bind({})
WithBadges.args = {
  ...defaultProps,
  badges: [
    {
      text: 'Cloud computing',
      color: 'primary',
    },
  ],
}
