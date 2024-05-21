export default interface Config {
  listing?: Listing;
}

export interface Listing {
  datagrid?: Datagrid;
}

export interface Datagrid {
  serviceKey?: string;
}
