import { LinksProps } from '../typography';

export interface GuideItem extends Omit<LinksProps, 'id'> {
  id: number;
  href: string;
  download?: string;
  target?: string;
  rel?: string;
  label: string;
  onClick?: () => void;
}

export interface GuideButtonProps {
  items: GuideItem[];
  isLoading?: boolean;
}
