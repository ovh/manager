import { useQuery } from "@tanstack/react-query";
import { v6 } from "@ovh-ux/manager-core-api";

const fetchIdentityDocumentsStatus = () => v6.get<{ status: string}>('/me/procedure/identity');

export const useIdentityDocumentsStatus = ({ enabled }: { enabled: boolean }) => useQuery({
    queryKey: ['identity-documents-status'],
    queryFn: fetchIdentityDocumentsStatus,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: enabled
});