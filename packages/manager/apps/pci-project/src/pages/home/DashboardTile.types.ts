import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

export type DashboardTileItem = {
  labelTranslationKey: string;
  descriptionTranslationKey?: string;
  link?: string;
  linkLabelTranslationKey?: string;
  iconODS?: ODS_ICON_NAME;
  iconImage?: string;
  target?: string;
  rel?: string;
  color?: string;
  ariaLabelTranslationKey?: string;
  price?: string;
  validUntil?: string | null;
  hideTileIfNoOtherItems?: boolean;
};

export type DashboardTile = {
  titleTranslationKey: string;
  type: 'billing' | 'documentation' | 'community';
  items: DashboardTileItem[];
};
