import {
  MoveIpAvailableDestinationsResponse,
  MoveIpDestination,
} from '@/data/api';

/** Group under which the VCFaaS destinations are displayed. */
export const dedicatedCloudDestinationKey = 'dedicatedCloud';
/** API section holding the VCFaaS (VMware Cloud Director) destinations. */
export const vmwareCloudDirectorDestinationKey = 'vmwareCloudDirector';

export type MoveIpDestinationGroup = [string, MoveIpDestination[]];

/**
 * Build the destination groups displayed in the move IP combobox.
 *
 * The `vmwareCloudDirector` section has no group of its own: its services are
 * merged into the `dedicatedCloud` group (labelled "Hosted Private Cloud"),
 * listed first and sorted alphabetically by service name. VCFaaS services
 * without a service id are dropped. Empty groups are dropped and the remaining
 * ones are ordered alphabetically by API key.
 */
export const getMoveIpDestinationGroups = (
  availableDestinations?: MoveIpAvailableDestinationsResponse,
): MoveIpDestinationGroup[] => {
  const {
    [vmwareCloudDirectorDestinationKey]: vcfaas = [],
    ...otherDestinations
  } = availableDestinations || ({} as MoveIpAvailableDestinationsResponse);

  const sortedVcfaas = vcfaas
    .filter(({ service }) => !!service)
    .sort((a, b) => a.service.localeCompare(b.service));

  const groups: MoveIpDestinationGroup[] = Object.entries(
    otherDestinations,
  ).map(([key, services]) =>
    key === dedicatedCloudDestinationKey
      ? [key, [...sortedVcfaas, ...services]]
      : [key, services],
  );

  if (!groups.some(([key]) => key === dedicatedCloudDestinationKey)) {
    groups.push([dedicatedCloudDestinationKey, sortedVcfaas]);
  }

  return groups
    .filter(([, services]) => services.length > 0)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
};
