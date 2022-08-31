export { default } from './Dashboard';

export type DashboardTile = {
  name: string;
  heading: string;
  type?: TileTypesEnum;
  onLoad?: () => Promise<unknown>;
  onError?: (error?: Error) => string;
  definitions?:
    | DashboardTileDefinition[]
    | ((data: unknown) => DashboardTileDefinition[]);
  content?: JSX.Element | string;
};

export type DashboardTileDefinition = {
  name: string;
  title: string;
  description?: unknown | ((data: unknown) => unknown);
  actions?:
    | DashboardTileDefinitionAction[]
    | ((data: unknown) => DashboardTileDefinitionAction[]);
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
