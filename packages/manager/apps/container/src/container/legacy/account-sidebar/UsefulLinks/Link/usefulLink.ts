export type UsefulLink = {
  action?(): void;
  href?: string;
  icon: string;
  id: string;
  external?: boolean;
  tracking?: string;
};
