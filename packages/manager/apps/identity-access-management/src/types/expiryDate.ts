// TODO: fix typing error for OdsToggle's defaultValue.
export type TOdsToggleDefaultValue =
  | (false & readonly string[])
  | (true & readonly string[]);

export type ExpiryDateModel = {
  active: boolean;
  mode: ExpiryMode,
  expiresAt: Date | null;
  expiresIn: number | null;
  invalid?: boolean;
};

export enum ExpiryMode {
  DURATION = 'duration',
  DATE = 'date'
}
