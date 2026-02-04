export const ASIA_PACIFIC_DEFAULT_BANDWIDTH_LIMIT = 100;
export const DEFAULT_BANDWIDTH_LIMIT = 5000;

export function isDefaultBandwidthOption({
  bandwidthLimit,
  region,
}: {
  bandwidthLimit: number;
  region: string;
}) {
  if (bandwidthLimit === DEFAULT_BANDWIDTH_LIMIT) {
    return ['eu-', 'ca-', 'us-'].some((part) => region.toLowerCase().includes(part));
  }

  if (bandwidthLimit === ASIA_PACIFIC_DEFAULT_BANDWIDTH_LIMIT) {
    return region.toLowerCase().includes('ap-');
  }

  return false;
}

const bandwidthMultiplierMap: Record<string, number> = {
  m: 1,
  g: 1000,
  t: 1000000,
};

export function extractBandwidthLimitFromPlanCode(planCode: string): number {
  const bandwidthMatch = planCode.split('-').pop();

  return bandwidthMatch
    ? parseInt(bandwidthMatch.slice(0, -1), 10) *
        (bandwidthMultiplierMap[bandwidthMatch.slice(-1).toLowerCase()] || 1)
    : 0;
}
