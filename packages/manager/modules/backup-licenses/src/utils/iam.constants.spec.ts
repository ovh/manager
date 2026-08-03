import { describe, expect, it } from 'vitest';

import { IAM_ACTIONS, getTerminateIamActions } from './iam.constants';

describe('getTerminateIamActions', () => {
  it('gates the US subsidiary on the action guarding the DELETE form it is served', () => {
    expect(getTerminateIamActions('US')).toEqual([
      IAM_ACTIONS.servicesGet,
      IAM_ACTIONS.servicesTerminateWithoutConfirmation,
    ]);
  });

  it.each(['FR', 'CA', 'GB', undefined])(
    'gates %s on the action guarding the POST termination form',
    (ovhSubsidiary) => {
      expect(getTerminateIamActions(ovhSubsidiary)).toEqual([
        IAM_ACTIONS.servicesGet,
        IAM_ACTIONS.servicesTerminate,
      ]);
    },
  );
});
