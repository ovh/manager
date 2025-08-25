import { Effect, Equal } from 'effect/index';
import { hasIpv4CIDRConflict } from './hasIpv4CIDRConflict';

const isTrueSuccess = (result: Effect.Effect<boolean, never, never>) => {
  if (Equal.equals(result, Effect.succeed(true))) {
    return Effect.succeed(true);
  }
  return Effect.fail(`Result is not a Effect.succeed(true) : ${result}`);
};

export const hasIpv4CIDRConflictInArray = (
  network: Readonly<string>,
  networks: Readonly<string[]>,
) =>
  Effect.validateFirst(networks, (networkB) =>
    hasIpv4CIDRConflict(network, networkB).pipe(isTrueSuccess),
  );
