import { describe, expect, it } from 'vitest';

import { CartItemRequiredConfiguration } from '@/types/OrderCart.type';

import { planCartConfigurations } from './cartConfiguration';

const requirement = (label: string, required = true): CartItemRequiredConfiguration => ({
  fields: null,
  label,
  required,
  type: 'string',
});

describe('planCartConfigurations', () => {
  it('pairs each required label with the value at hand', () => {
    const plan = planCartConfigurations([requirement('vault_name'), requirement('vault_region')], {
      vault_name: 'my-vault',
      vault_region: 'eu-west-par',
    });

    expect(plan).toEqual({
      configurations: [
        { label: 'vault_name', value: 'my-vault' },
        { label: 'vault_region', value: 'eu-west-par' },
      ],
      missingLabels: [],
    });
  });

  it('drops values the cart does not ask for', () => {
    const plan = planCartConfigurations([requirement('vault_name')], {
      vault_name: 'my-vault',
      unexpected_label: 'ignored',
    });

    expect(plan.configurations).toEqual([{ label: 'vault_name', value: 'my-vault' }]);
  });

  it('reports a required label with no value instead of posting it empty', () => {
    const plan = planCartConfigurations([requirement('vault_name'), requirement('vault_region')], {
      vault_name: 'my-vault',
    });

    expect(plan.configurations).toEqual([{ label: 'vault_name', value: 'my-vault' }]);
    expect(plan.missingLabels).toEqual(['vault_region']);
  });

  it('treats an empty string as no value at all', () => {
    const plan = planCartConfigurations([requirement('vault_name')], { vault_name: '' });

    expect(plan.configurations).toEqual([]);
    expect(plan.missingLabels).toEqual(['vault_name']);
  });

  it('stays silent about an optional label with no value', () => {
    const plan = planCartConfigurations([requirement('optional_note', false)], {});

    expect(plan).toEqual({ configurations: [], missingLabels: [] });
  });

  it('sends an optional label when a value is available', () => {
    const plan = planCartConfigurations([requirement('optional_note', false)], {
      optional_note: 'note',
    });

    expect(plan.configurations).toEqual([{ label: 'optional_note', value: 'note' }]);
  });

  it('plans nothing when the requirements are not loaded', () => {
    expect(planCartConfigurations(undefined, { vault_name: 'my-vault' })).toEqual({
      configurations: [],
      missingLabels: [],
    });
  });
});
