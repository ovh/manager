import { Effect } from 'effect/index';

import { hasIpv4CIDRConflict } from './hasIpv4CIDRConflict';

// A bit counter-intuitive, but "succeed" = conflict found, "fail" = no conflict found
// Might be nice to inverse logic later
const assertTrueOrFail = Effect.flatMap((result: boolean) =>
  result ? Effect.succeed(true) : Effect.fail('No conflict found'),
);

export const hasIpv4CIDRConflictInArray = (
  network: Readonly<string>,
  networks: Readonly<string[]>,
) =>
  Effect.validateFirst(networks, (networkB) =>
    hasIpv4CIDRConflict(network, networkB).pipe(assertTrueOrFail),
  );
