import { FeatureSwitcherItem } from '@/types/featureSwitcher/FeatureSwitcher.type';

export interface FeatureSwitcherProps {
  items: FeatureSwitcherItem[];
  activeItemId: string;
}
