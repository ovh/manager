import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { getPciProjects } from '@/container/nav-reshuffle/data/api/pciProjects';
import { PciProject } from '@/container/nav-reshuffle/sidebar/ProjectSelector/PciProject';

export const usePciProjects = (
  options?: Partial<
    DefinedInitialDataOptions<PciProject[], unknown, PciProject[]>
  >,
) =>
  useQuery({
    ...options,
    queryKey: ['pci-projects'],
    queryFn: getPciProjects,
  });
