export type UsefulLink = {
  action?: () => void;
  href?: string;
  icon: JSX.Element | string;
  id: string;
  external?: boolean;
  tracking?: string;
};
