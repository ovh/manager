export type Node = {
  children?: Node[];
  parent?: Node;
  count?: number | boolean;
  id?: string;
  path?: string;
  serviceType?: string;
  translation?: string;
  features?: string[];
  separator?: boolean;
  idAttr?: string;
  hideIfEmpty?: boolean;
  forceVisibility?: boolean;
};
