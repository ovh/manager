// TODO: fix typing error for OdsToggle's defaultValue.
export type TOdsToggleDefaultValue =
  | (false & readonly string[])
  | (true & readonly string[]);

export type ExpiryDateModel = {
  active: boolean;
  mode: 'duration' | 'date';
  expiresAt: Date | null;
  expiresIn: number | null;
  invalid?: boolean;
};
