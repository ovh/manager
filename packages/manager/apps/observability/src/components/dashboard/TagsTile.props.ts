export interface TagsTileProps {
  tenantId: string;
  title: string;
  tags: { [key: string]: string };
  isLoading?: boolean;
}
