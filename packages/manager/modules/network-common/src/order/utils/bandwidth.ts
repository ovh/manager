export const DEFAULT_BANDWIDTH_LIMIT = 5000;

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
