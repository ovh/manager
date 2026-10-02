import { describe, it, expect } from 'vitest';
import * as database from '@/types/cloud/project/database';
import {
  isMongoFreemium,
  isUnshelveDisplayed,
  isUnshelveEnabled,
} from './mongoFreemiumHelper';

const freemium = {
  engine: database.EngineEnum.mongodb,
  plan: 'discovery',
  flavor: 'db2-free',
};

describe('isMongoFreemium', () => {
  it('is true for a MongoDB service on the free plan and the free flavor', () => {
    expect(isMongoFreemium(freemium)).toBe(true);
  });

  it('is false when the flavor is not the free one', () => {
    expect(isMongoFreemium({ ...freemium, flavor: 'db2-2' })).toBe(false);
  });

  it('is false when the plan is not the free one', () => {
    expect(isMongoFreemium({ ...freemium, plan: 'production' })).toBe(false);
  });

  it('is false for another engine', () => {
    expect(
      isMongoFreemium({ ...freemium, engine: database.EngineEnum.postgresql }),
    ).toBe(false);
  });
});

const { enabled, disabled } = database.service.capability.StateEnum;

describe('isUnshelveDisplayed', () => {
  it('is true for a freemium service exposing unshelve create or update', () => {
    expect(
      isUnshelveDisplayed({
        ...freemium,
        capabilities: { unshelve: { create: enabled } },
      }),
    ).toBe(true);
    expect(
      isUnshelveDisplayed({
        ...freemium,
        capabilities: { unshelve: { update: disabled } },
      }),
    ).toBe(true);
  });

  it('is false without the unshelve capability', () => {
    expect(isUnshelveDisplayed({ ...freemium, capabilities: {} })).toBe(false);
    expect(
      isUnshelveDisplayed({
        ...freemium,
        capabilities: { unshelve: { read: enabled } },
      }),
    ).toBe(false);
  });

  it('is false for a service that is not freemium', () => {
    expect(
      isUnshelveDisplayed({
        ...freemium,
        plan: 'production',
        capabilities: { unshelve: { create: enabled } },
      }),
    ).toBe(false);
  });
});

describe('isUnshelveEnabled', () => {
  it('is true when create or update is enabled', () => {
    expect(
      isUnshelveEnabled({
        ...freemium,
        capabilities: { unshelve: { create: disabled, update: enabled } },
      }),
    ).toBe(true);
  });

  it('is false when every exposed action is disabled', () => {
    expect(
      isUnshelveEnabled({
        ...freemium,
        capabilities: { unshelve: { create: disabled, update: disabled } },
      }),
    ).toBe(false);
  });
});
