import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Icon,
  ICON_NAME,
  ICON_NAMES,
  type IconProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<IconProp>;

(Icon as any).__docgenInfo = docgenMap.icon;

type AllArg = Partial<IconProp> & {
  search: string
};
type IconNameKey = keyof typeof ICON_NAME;

/**
 * Try to keep the tags meaningful, they should represent possible search value from a user or an alternative name
 * (ex: "day" for "calendar" or "times" for "xmark")
 * Do not add tag copying part of the icon name, as the search will find them anyway
 * (ex: do not add "arrow" tag to "arrowCrossed" icon)
 * Not every icon needs to have tags, add them only if relevant
 * Keep each tag list small (ideally no more than 4 elements)
 * Keep the tag high-level, it does not describe the state represented on the icon
 * (ex: do not add "lab-full" tag to "flask-full" icon, just add "lab" on each flask icon)
 */
const ODS_ICON_TAG: { [NameKey in IconNameKey]: string[] } = {
  analysis: ['data', 'graph', 'metrics'],
  arrowCrossed: ['branch', 'git'],
  arrowDown: [],
  arrowDownLeft: [],
  arrowDownRight: [],
  arrowLeft: ['back', 'previous'],
  arrowLeftRight: ['swap', 'exchange'],
  arrowRight: ['forward', 'next'],
  arrowUp: [],
  arrowUpDown: ['swap', 'reorder'],
  arrowUpLeft: [],
  arrowUpRight: [],
  bell: ['notification', 'alert'],
  bill: ['invoice', 'receipt'],
  book: ['read', 'guide'],
  box: ['pack', 'storage', 'delivery', 'parcel'],
  building: ['company', 'facility', 'office'],
  cable: ['connect', 'wire', 'link'],
  calculator: ['maths', 'total', 'convert'],
  calendar: ['day', 'month', 'year', 'schedule', 'date', 'event'],
  castle: ['fortress', 'protection', 'security'],
  check: ['validation', 'verified', 'approved', 'success'],
  chevronDoubleLeft: ['forward', 'next'],
  chevronDoubleRight: ['back', 'previous'],
  chevronDown: ['expand', 'collapse'],
  chevronLeft: ['back', 'previous'],
  chevronLeftSlash: ['code', 'html', 'tags'],
  chevronLeftUnderscore: ['code', 'terminal'],
  chevronRight: ['forward', 'next'],
  chevronUp: ['close, collapse'],
  circleCheck: ['validation', 'verified', 'approved', 'success'],
  circleCheckFull: ['validation', 'verified', 'approved', 'success'],
  circleInfo: ['details', 'tooltip'],
  circleInfoFull: ['details', 'tooltip'],
  circleQuestion: ['help', 'support', 'faq', 'tooltip', '?'],
  circleQuestionFull: ['help', 'support', 'faq', 'tooltip', '?'],
  circleThreeNodes: [],
  circleUser: ['account', 'profile', 'person', 'avatar'],
  circleXmark: ['clear', 'times', 'error'],
  circleXmarkFull: ['clear', 'times', 'error'],
  clockTimeFour: [],
  clockTimeNine: [],
  clockTimeSix: [],
  clockTimeThree: [],
  clockTimeTwelve: ['noon', 'midnight'],
  cloud: [],
  cloudCheck: ['validation', 'verified', 'approved', 'success'],
  cloudDownload: [],
  cloudLock: ['security', 'encryption'],
  cloudUpload: ['save', 'send', 'transfer'],
  cloudXmark: ['clear', 'times'],
  cog: ['gear', 'settings', 'preferences'],
  columns: ['filter', 'grid', 'layout', 'table'],
  comment: ['chat', 'message', 'contact', 'feedback'],
  cpu: ['processor', 'performance', 'hardware'],
  creditCard: ['pay', 'payment', 'transaction'],
  crown: ['premium', 'popular', 'best', 'top', 'vip'],
  dPad: ['controller', 'gamepad', 'gaming'],
  diamondExclamation: ['error', 'urgent', 'alert', '!'],
  diamondExclamationFull: ['error', 'urgent', 'alert', '!'],
  diamondsFull: [],
  disk: ['drive', 'storage', 'hardware', 'files', 'data'],
  download: [],
  ellipsisHorizontal: ['truncated'],
  ellipsisVertical: ['more', 'menu', 'options', 'actions'],
  email: ['message', 'contact', 'inbox'],
  emoticon: ['smiley', 'emoji'],
  emoticonDizzy: ['smiley', 'emoji', 'shocked'],
  emoticonNeutral: ['smiley', 'emoji'],
  emoticonSad: ['smiley', 'emoji'],
  emoticonSmile: ['smiley', 'emoji', 'happy'],
  emoticonWink: ['smiley', 'emoji'],
  equal: ['maths'],
  externalLink: [],
  eye: ['see', 'view', 'show', 'visibility', 'masked'],
  eyeOff: ['hide', 'visibility', 'masked'],
  fiber: ['network', 'connection'],
  file: ['document', 'paper'],
  fileCopy: ['document', 'duplicate'],
  fileMinus: ['document', 'remove', 'delete'],
  filePlus: ['document', 'add', 'create', 'new'],
  filter: ['sort'],
  flame: ['fire', 'hot', 'popular'],
  flaskEmpty: ['lab', 'test'],
  flaskFull: ['lab', 'test'],
  flaskHalf: ['lab', 'test'],
  floppy: ['save', 'disk', 'storage'],
  focus: [],
  folder: ['directory'],
  folderMinus: ['directory', 'remove', 'delete'],
  folderPlus: ['directory', 'add', 'create', 'new'],
  funnel: ['filter', 'sort'],
  gameConsole: [],
  gameController: [],
  gameControllerAlt: [],
  gathering: ['group'],
  gift: ['reward', 'bonus'],
  globe: ['world', 'global', 'internet'],
  grid: ['apps', 'layout'],
  gridAlt: ['apps', 'layout'],
  hamburgerMenu: ['navigation', 'sidebar'],
  heart: ['wishlist', 'love', 'favorite'],
  heartFull: ['wishlist', 'love', 'favorite'],
  heartHalf: ['wishlist', 'love', 'favorite'],
  hexagonExclamation: ['error', 'urgent', 'alert', '!'],
  hexagonExclamationFull: ['error', 'urgent', 'alert', '!'],
  hierarchy: ['tree', 'structure', 'organization'],
  history: ['rollback', 'logs', 'timeline'],
  home: ['house', 'main', 'dashboard'],
  key: ['lock', 'unlock', 'security'],
  leaf: ['nature', 'green', 'eco', 'carbon'],
  lifeBuoy: ['help', 'support'],
  lightbulb: ['idea'],
  lightning: ['fast', 'flash'],
  list: ['bullet', 'points', 'items'],
  location: ['map', 'place', 'pin'],
  lockClose: ['security', 'access', 'restricted'],
  lockOpen: ['security', 'access', 'unlocked'],
  magicWand: ['wizard', 'fix'],
  magnifyingGlass: ['search', 'zoom', 'find'],
  meter: ['dashboard', 'gauge', 'measure'],
  minus: ['decrease', 'maths', 'less', 'subtract'],
  money: ['cash', 'currency'],
  moneyBagDefault: ['cash', 'wallet'],
  moneyBagDollar: ['cash', 'wallet', '$'],
  moneyBagEuro: ['cash', 'wallet', '€'],
  monitor: ['display', 'screen', 'desktop'],
  network: ['snowflake'],
  pen: ['edit', 'write', 'modify'],
  percent: ['discount, savings'],
  phone: ['call', 'contact', 'hotline'],
  piggyBank: ['savings', 'economy', 'money', 'budget'],
  plus: ['add', 'create', 'maths', 'more', 'new'],
  printer: [],
  question: ['help', 'support', '?'],
  refresh: ['reload', 'update'],
  resize: ['expand', 'scale'],
  robot: ['chat', 'agent', 'automation'],
  server: ['rack', 'datacenter', 'database'],
  serverRack: ['datacenter', 'database'],
  shareNodes: ['send', 'forward'],
  shield: ['protection', 'security', 'safe'],
  shieldCheck: ['validation', 'protection', 'security', 'safe', 'verified', 'approved'],
  shieldExclamation: ['protection', 'security', 'safe', 'warning', 'alert'],
  shieldFirewall: ['protection', 'security', 'safe', 'network'],
  shieldLock: ['protection', 'security', 'safe', 'access', 'restricted'],
  shieldMinus: ['protection', 'security', 'safe'],
  shieldOff: ['protection', 'security', 'safe', 'disabled', 'unprotected'],
  shieldPlus: ['protection', 'security', 'safe', 'add'],
  shieldXmark: ['clear', 'times'],
  shoppingCart: ['basket'],
  shoppingCartError: ['basket', 'disabled', 'issue'],
  shoppingCartMinus: ['basket', 'less', 'decrease'],
  shoppingCartPlus: ['basket', 'add', 'more'],
  shoppingCartXmark: ['basket', 'clear', 'remove','times'],
  shrink: ['reduce', 'minimize', 'scale'],
  shutdown: ['off', 'logout', 'power'],
  sortAlphaDown: ['ascending', 'order'],
  sortAlphaUp: ['descending', 'order'],
  sortNumericDown: ['descending', 'order'],
  sortNumericUp: ['ascending', 'order'],
  sparkle: ['ai', 'shine', 'special'],
  splitHorizontal: ['screen'],
  splitVertical: ['screen'],
  star: ['favorite', 'rating', 'bookmark'],
  starFull: ['favorite', 'rating', 'bookmark'],
  starHalf: ['favorite', 'rating', 'bookmark'],
  store: ['shop', 'marketplace', 'retail'],
  sync: ['portability', 'update', 'refresh', 'reload'],
  tag: ['label', 'promotion'],
  thumbsDown: ['like'],
  thumbsUp: ['like'],
  timer: ['alarm', 'clock', 'countdown'],
  trafficCone: ['wip', 'construction'],
  trash: ['bin', 'delete', 'remove'],
  triangleExclamation: ['warning', 'alert', '!'],
  triangleExclamationFull: ['warning', 'alert', '!'],
  triangleThreeNodes: [],
  truck: ['shipping', 'shipment', 'delivery', 'transport', 'vehicle'],
  undo: ['reverse'],
  upload: ['send', 'transfer'],
  user: ['account', 'profile', 'person'],
  vault: ['protection', 'security', 'safe'],
  xmark: ['cancel', 'clear', 'close', 'delete', 'maths', 'multiply', 'times'],
};

const meta: Meta<IconProp> = {
  component: Icon,
  title: 'Manager UI Kit/Components/Icon/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    name: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'ICON_NAME' },
      },
      control: { type: 'select' },
      options: ICON_NAMES,
    },
  }),
  args: {
    name: ICON_NAME.home,
  },
};

export const AccessibilityInformative: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Icon
      aria-label="home"
      name={ ICON_NAME.home }
      role="img" />
  ),
};

export const All: StoryObj<AllArg> = {
  render: (arg: AllArg) => {
    const regexp = new RegExp(arg.search)

    const names = arg.search ?
      Object.entries<string>(ICON_NAME)
        .filter(([key, name]) => {
          return [name].concat(ODS_ICON_TAG[key as IconNameKey] || []).some((value) => regexp.test(value));
        })
        .map(([_, name]) => name)
      : ICON_NAMES;

    return (
      <div style={{
        display: 'flex',
        flexFlow: 'row',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {
          names.map((name) => (
            <Icon
              key={ name }
              name={ name as ICON_NAME }
              title={ name } />
          ))
        }
      </div>
    );
  },
  argTypes: {
    name: {
      table: {
        disable: true,
      },
    },
    search: {
      control: { type: 'text' },
      description: 'Search for a specific icon name or tag',
    },
  },
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Icon
      name="home"
      style={{ fontSize: '2rem', color: 'var(--ods-color-primary-500)' }} />
  ),
};

export const Decorative: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Icon name={ ICON_NAME.home } />
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Icon name={ ICON_NAME.home } />
  ),
};

export const Informative: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Icon
      aria-label="Help"
      name={ ICON_NAME.circleQuestion }
      role="img" />
  ),
};

export const AccessibilityBadPracticeDecorative: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Icon name={ ICON_NAME.home } />
  ),
};

export const AccessibilityBadPracticeRating: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <label htmlFor="rating">
        Rating
      </label>

      <div id="rating">
        <Icon name={ ICON_NAME.star } tabIndex={ 0 } aria-label="one star" role="img" />
        <Icon name={ ICON_NAME.star } tabIndex={ 0 } aria-label="two star" role="img" />
        <Icon name={ ICON_NAME.star } tabIndex={ 0 } aria-label="three star" role="img" />
        <Icon name={ ICON_NAME.star } tabIndex={ 0 } aria-label="four star" role="img" />
        <Icon name={ ICON_NAME.star } tabIndex={ 0 } aria-label="five star" role="img" />
      </div>
    </>
  ),
};

export const AccessibilityRating: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <label
        htmlFor="rating"
        id="rating-label">
        Rating
      </label>

      <div
        aria-labelledby="rating-label"
        id="rating"
        role="radiogroup">
        <Icon name={ ICON_NAME.star } role="radio" tabIndex={ -1 } aria-label="one star" aria-checked="false" />
        <Icon name={ ICON_NAME.star } role="radio" tabIndex={ 0 } aria-label="two star" aria-checked="true" />
        <Icon name={ ICON_NAME.star } role="radio" tabIndex={ -1 } aria-label="three star" aria-checked="false" />
        <Icon name={ ICON_NAME.star } role="radio" tabIndex={ -1 } aria-label="four star" aria-checked="false" />
        <Icon name={ ICON_NAME.star } role="radio" tabIndex={ -1 } aria-label="five star" aria-checked="false" />
      </div>
    </>
  ),
};
