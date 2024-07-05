import { createTree } from '@/lib/availabilitiesHelper';
import { mockedAvailabilities } from '../__tests__/helpers/mocks/availabilitiesMock/availabilities';
import { mockedCatalog } from '../__tests__/helpers/mocks/availabilitiesMock/catalog';
import { mockedCapabilities } from '../__tests__/helpers/mocks/availabilitiesMock/capabilities';

const mockedSuggestions = [
  {
    default: true,
    engine: 'mongodb',
    flavor: 'db1',
    plan: 'essential',
    region: 'GRA',
    version: '6',
  },
  {
    default: false,
    engine: 'postgresql',
    flavor: 'db1',
    plan: 'essential',
    region: 'GRA',
    version: '4',
  },
  {
    default: true,
    engine: 'grafana',
    flavor: 'db1',
    plan: 'essential',
    region: 'GRA',
    version: '1',
  },
];

describe('createTree function', () => {
  it('transforms availability data into structured tree format', () => {
    const tree = createTree(
      mockedAvailabilities,
      mockedCapabilities,
      mockedSuggestions,
      mockedCatalog,
    );

    expect(tree).toBeInstanceOf(Array);
    expect(tree).toHaveLength(3);
    const engine = tree[0];

    // Check the engine level
    expect(engine.name).toEqual(mockedAvailabilities[0].engine);
    expect(engine.versions).toHaveLength(1);
    expect(engine.defaultVersion).toEqual('6');

    // Check the version level
    const version = engine.versions[0];
    expect(version.name).toEqual(mockedAvailabilities[0].version);
    expect(version.plans).toHaveLength(2);

    // Check the plan level
    const plan = version.plans[0];
    expect(plan.name).toEqual(mockedAvailabilities[0].plan);
    expect(plan.networks).toEqual([
      mockedAvailabilities[0].specifications.network,
    ]);
    expect(plan.nodes.minimum).toEqual(
      mockedAvailabilities[0].specifications.nodes.minimum,
    );
    expect(plan.nodes.maximum).toEqual(
      mockedAvailabilities[0].specifications.nodes.maximum,
    );

    // Check the region level
    const region = plan.regions[0];
    expect(region.name).toEqual(mockedAvailabilities[0].region);
    expect(region.flavors).toHaveLength(1);

    // Check the flavor level
    const flavor = region.flavors[0];
    expect(flavor.name).toEqual(mockedAvailabilities[0].specifications.flavor);
    expect(flavor.ram).toEqual({
      unit: 'GB',
      value: 0,
    });
    expect(flavor.vcores).toEqual(0);

    // Check pricing
    expect(flavor.pricing.hourly.price).toEqual(1);
    expect(flavor.pricing.monthly.price).toEqual(1);
  });
});
