export type TVolume = {
  id: string;
  name: string;
  size: number;
  availabilityZone: string | null | 'any'; // any is for Volume Any type which means available for any zone
};
