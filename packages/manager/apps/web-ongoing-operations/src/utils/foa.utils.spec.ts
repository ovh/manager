import { describe, it, expect } from 'vitest';
import { isFoaEligibleOperation, isPendingFoa } from '@/utils/foa.utils';
import { FoaChoiceEnum } from '@/enum/foa.enum';
import { StatusEnum } from '@/enum/status.enum';

describe('isPendingFoa', () => {
  it('is pending while the currentState carries no choice', () => {
    expect(isPendingFoa({ id: 'foa-1' })).toBe(true);
    expect(isPendingFoa({ id: 'foa-2', currentState: {} })).toBe(true);
    // whatever else the currentState carries is none of our business
    expect(
      isPendingFoa({ id: 'foa-3', currentState: { anything: 'else' } }),
    ).toBe(true);
  });

  it('is not pending anymore once a choice is recorded', () => {
    expect(
      isPendingFoa({ id: 'foa-1', currentState: { choice: FoaChoiceEnum.Accept } }),
    ).toBe(false);
    expect(
      isPendingFoa({ id: 'foa-2', currentState: { choice: FoaChoiceEnum.Reject } }),
    ).toBe(false);
  });
});

describe('isFoaEligibleOperation', () => {
  const operation = { function: 'DomainTrade', status: StatusEnum.TODO };

  it('is eligible while the trade is still running', () => {
    [
      StatusEnum.TODO,
      StatusEnum.DOING,
      StatusEnum.ERROR,
      StatusEnum.PROBLEM,
    ].forEach((status) => {
      expect(isFoaEligibleOperation({ ...operation, status })).toBe(true);
    });
  });

  it('is not eligible anymore on a finished trade', () => {
    expect(
      isFoaEligibleOperation({ ...operation, status: StatusEnum.DONE }),
    ).toBe(false);
    expect(
      isFoaEligibleOperation({ ...operation, status: StatusEnum.CANCELLED }),
    ).toBe(false);
  });

  it('is not eligible on another operation, nor on a missing one', () => {
    expect(
      isFoaEligibleOperation({ ...operation, function: 'DomainDnsUpdate' }),
    ).toBe(false);
    expect(isFoaEligibleOperation(undefined)).toBe(false);
    expect(isFoaEligibleOperation(null)).toBe(false);
  });
});
