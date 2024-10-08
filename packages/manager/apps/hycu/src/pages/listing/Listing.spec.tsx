import { describe, it } from 'vitest';
import { setupTest } from '@/utils/tests/setup-test';

describe('HYCU listing test suite', () => {
  it('should redirect to the onboarding page when the license list is empty', async () => {
    await setupTest();
  });
});
