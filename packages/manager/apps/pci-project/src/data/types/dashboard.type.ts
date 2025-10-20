import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

// Dashboard Tile Types and Constants
export type DashboardItem = {
  label?: string;
  labelTranslationKey?: string;
  description?: string;
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
  featureFlag?: string;
};

// Config type for items that need transformation before becoming DashboardItem
export type DashboardItemConfig = DashboardItem & {
  documentationGuideKey?: string;
  featureFlag?: string;
};

export type DashboardTile = {
  titleTranslationKey: string;
  // Tile type. Defaults to 'standard' if not specified.
  type?: 'standard' | 'billing';
  items: DashboardItem[];
};
