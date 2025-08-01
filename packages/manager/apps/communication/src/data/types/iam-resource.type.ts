export type IamResource = {
  displayName: string;
  id: string;
  name: string;
  owner: string;
  tags: Record<string, string> | null;
  type: string;
  urn: string;
};
