import { getMe } from "@/data/api/me";
import { User } from "@ovh-ux/manager-config";
import { useQuery } from "@tanstack/react-query";

export const useBusinessVerificationRequired = (enabled: boolean) => useQuery({
  queryKey: ['me', 'business-verification-required'],
  queryFn: getMe,
  select: (data) => data.businessVerificationRequired ?? false,
  enabled,
});

export const isUserConcernedByBusinessVerification = (user: User) =>
  user.legalform === 'corporation' &&
  user.country === 'FR';
