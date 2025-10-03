import { LinkProps } from '../Link';

export interface GuideMenuItem extends Omit<LinkProps, 'id'> {
  id: number;
  href: string;
  download?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  children?: string | JSX.Element;
}

export interface GuideMenuProps {
  items: GuideMenuItem[];
  isLoading?: boolean;
}
