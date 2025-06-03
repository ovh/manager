import { useQuery } from "@tanstack/react-query";
import { useApplication } from "@/context";
import fetchPendingAgreements from "@/api/agreements";

// TODO: simplify this once new-billing is fully open to the public
export const useAgreementsPageNavigationParam = () => {
  const { shell } = useApplication();
  const environment = shell.getPlugin('environment').getEnvironment();

  const isNewBillingAvailable = Boolean(
    environment.getApplicationURL('new-billing'),
  );

  return {
    app: isNewBillingAvailable ? 'new-billing' : 'dedicated',
    path: `#/${
      isNewBillingAvailable ? '' : 'billing/'
    }autorenew/agreements`,
  }
};

export const usePendingAgreements = (enabled: boolean) => useQuery({
  queryKey: ['pending-agreements'],
  queryFn: fetchPendingAgreements,
  enabled,
});
