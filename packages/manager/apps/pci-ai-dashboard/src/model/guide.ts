export interface Guide {
    section: string;
    engine: string;
    lang: string;
    slug: string;
    title: string;
    excerpt: string;
    url: string;
  }
  
  export enum GuideSections {
    'settings' = 'settings',
    'acls' = 'acls',
    'dashboard' = 'dashboard',
    'landing' = 'landing',
    'logs' = 'logs',
    'pools' = 'pools',
    'integrations' = 'integrations',
    'backups' = 'backups',
    'onboarding' = 'onboarding',
    'metrics' = 'metrics',
    'queries' = 'queries',
    'funnel' = 'funnel',
  }
  