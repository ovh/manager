export enum Region3AZ {
  PARIS = 'EU-WEST-PAR',
  MILAN = 'EU-SOUTH-MIL',
}

export const COLD_ARCHIVE_REGIONS: readonly string[] = [Region3AZ.PARIS];
export const GLACIER_IR_REGIONS: readonly string[] = Object.values(Region3AZ);
