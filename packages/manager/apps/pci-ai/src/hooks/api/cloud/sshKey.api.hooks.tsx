import {
    useQueries,
} from '@tanstack/react-query';
import { user } from '@/models/types';
import { useCallback } from 'react';
import { cloudApi } from '@/data/cloudapi';

export interface SSHKeyWithRegion extends user.SSHKey {
    region: string;
}

export const useGetSSHKeyWithRegions = (
    projectId: string,
    regions: string[],
) => {
    const sshKeyQueries = useQueries({
        queries: regions
            ? regions.map(reg => {
                return {
                    queryKey: [projectId, 'region', reg, 'sshkey'],
                    queryFn: () => cloudApi.getSSHKey(projectId, reg),
                    select: (ssh: user.SSHKey[]) => ssh.map((ssh: user.SSHKey) => ({ ...ssh, region: reg })),
                };
            })
            : [],
    })

    const refetchAll = useCallback(() => {
        sshKeyQueries.forEach(sshQuery => sshQuery.refetch());
    }, [sshKeyQueries]);

    return {
        sshKeyQueries,
        refetchAll,
    };
}