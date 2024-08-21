import { SvgIconProps } from "./services/icons/icons.type";

export type NodeRouting = {
  application?: string;
  hash?: string;
};

export enum NodeTag {
  ALPHA = 'alpha',
  BETA = 'beta',
  NEW = 'new',
}

export type Node = {
  children?: Node[];
  parent?: Node;
  universe?: string;
  count?: number | boolean;
  id?: string;
  path?: string;
  serviceType?: string | string[];
  translation?: string;
  shortTranslation?: string;
  illustration?: string;
  iconNode?:  React.FunctionComponent<SvgIconProps>
  features?: string[];
  separator?: boolean;
  idAttr?: string;
  hideIfEmpty?: boolean;
  badge?: string;
  forceVisibility?: boolean;
  url?: string | Record<string, string>;
  isExternal?: boolean;
  hidden?: boolean;
  routing?: NodeRouting;
  region?: string[];
  tag?: NodeTag;
  icon?: string;
  onClick?: any;
};
