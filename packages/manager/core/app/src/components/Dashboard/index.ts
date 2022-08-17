export { default } from './Dashboard';

export type DashboardTile = {
  name: string;
  heading: string;
  type?: TileTypesEnum;
  onLoad?: () => Promise<unknown>;
  definitions?: DashboardTileDefinition[];
  content?: JSX.Element | string;
};

export type DashboardTileDefinition = {
  name: string;
  title: string;
  getDescription?: (data: unknown) => unknown;
  actions?: DashboardTileDefinitionAction[];
};

export type DashboardTileDefinitionAction = {
  name: string;
  label: string;
  title?: string;
  to?: string;
  onClick?: () => void;
  href?: string;
  isExternal?: boolean;
};

export enum TileTypesEnum {
  LIST = 'list',
}
