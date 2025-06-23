export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
}

export interface LinksProps {
  className?: string;
  download?: string;
  label?: string;
  children?: string | JSX.Element;
  href?: string;
  rel?: string;
  target?: string;
  type?: LinkType;
  onClickReturn?: () => void;
  // Iam trigger
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  disabledIamCheck?: boolean;
  disabled?: boolean;
}
