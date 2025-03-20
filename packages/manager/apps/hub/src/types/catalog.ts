import { ApiEnvelope } from '@/types/apiEnvelope.type';

export type CatalogItem = {
  categories: string[];
  category: string;
  description: string;
  highlight?: boolean;
  id: number;
  lang: string;
  name: string;
  order: string;
  productName: string;
  regionTags: string[];
  universe: string;
  url: string;
};

export type CatalogData = {
  catalog: ApiEnvelope<CatalogItem[]>;
};
