export const DEPLOYMENT_MODES = ['region', 'localzone', 'region-3-az'] as const;
export type TDeploymentMode = (typeof DEPLOYMENT_MODES)[number];

export const CONTINENT_CODES = ['AF', 'ASIA', 'EU', 'NA', 'US'] as const;
export type TContinentCode = (typeof CONTINENT_CODES)[number];
