import { describe, vi } from 'vitest';
import { computeServicePrice } from '@/lib/pricingHelper';
import { database } from '@/models/database';
import { mockedPricing } from '../helpers/mocks/order-funnel';

const mockedPricingHelper = {
  offerPricing: mockedPricing,
  nbNodes: 2,
  storagePricing: mockedPricing,
  additionalStorage: 2,
};

describe('pricingHelper', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('computeServicePriceWithDistributed', () => {
    const mockedDistributedPricing = {
      ...mockedPricingHelper,
      storageMode:
        database.capabilities.engine.storage.StrategyEnum.distributed,
    };
    const pricing = computeServicePrice(mockedDistributedPricing);
    expect(pricing).toStrictEqual({
      hourly: { price: 4, tax: 4 },
      monthly: { price: 120, tax: 4 },
    });
  });

  it('computeServicePriceWithReplicated', () => {
    const mockedReplicatedPricing = {
      ...mockedPricingHelper,
      storageMode: database.capabilities.engine.storage.StrategyEnum.replicated,
    };
    const pricing = computeServicePrice(mockedReplicatedPricing);
    expect(pricing).toStrictEqual({
      hourly: { price: 6, tax: 6 },
      monthly: { price: 180, tax: 6 },
    });
  });
});
