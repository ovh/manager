export const isSnapshotConsumption = (
  code: string | null | undefined,
): boolean =>
  typeof code === 'string' && code.startsWith('snapshot.consumption');
