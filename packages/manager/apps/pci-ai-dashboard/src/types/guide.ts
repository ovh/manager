export interface Guide {
  section: string;
  lang: string;
  slug: string;
  title: string;
  excerpt: string;
  url: string;
}

export enum GuideSections {
  'users' = 'utilisateurs',
  'tokens' = 'tokens',
  'datastore' = 'datastore',
}
