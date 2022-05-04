export type Node = {
  children?: Node[];
  parent?: Node;
  count?: number;
  id?: string;
  path?: string;
  serviceType?: string;
  translation?: string;
};
