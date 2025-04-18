// TODO: Replace with a shared Error class in @ovh-ux/manager-config after the full revamp
export type ApiError = {
  message?: string;
  details?: {
    statusPageURL?: string;
  };
};
