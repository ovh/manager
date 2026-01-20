export interface TagsTileProps {
  title: string;
  tags: { [key: string]: string };
  isLoading?: boolean;
  hideLink?: boolean;
  href: string;
}
