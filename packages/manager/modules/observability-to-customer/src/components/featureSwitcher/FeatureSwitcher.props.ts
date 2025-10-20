import { FeatureSwitcherItem } from './FeatureSwitcher.type';

export interface FeatureSwitcherProps {
  items: FeatureSwitcherItem[];
  activeItemId: string;
}
