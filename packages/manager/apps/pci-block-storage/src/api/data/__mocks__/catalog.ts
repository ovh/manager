export function getVolumeCatalog() {
  return Promise.resolve({
    regions: [],
    filters: {
      deployment: [],
      region: [],
    },
    models: [
      {
        name: 'model1',
        filters: {},
        tags: [],
        pricings: [
          {
            regions: ['region1', 'region2'],
            specs: {
              maxAttachedInstances: 1,
              name: 'model 1',
              bandwidth: null,
              volume: {
                capacity: { max: 4000 },
                iops: {
                  max: 200,
                  maxUnit: 'u',
                  unit: 'u',
                  guaranteed: false,
                  level: 1,
                },
              },
            },
            price: 2000,
            areIOPSDynamic: true,
            showAvailabilityZones: false,
            interval: 'hour',
          },
        ],
      },
    ],
  });
}
