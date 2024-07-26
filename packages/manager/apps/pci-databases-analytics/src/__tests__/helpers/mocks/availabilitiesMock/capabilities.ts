import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import * as database from '@/types/cloud/project/database';

const mockedLifecycle = {
  startDate: '',
  status: database.availability.StatusEnum.STABLE,
};
export const mockedCapabilities: FullCapabilities = {
  engines: [
    {
      name: 'mongodb',
      category: database.engine.CategoryEnum.operational,
      description: 'mongodb description',
      order: 0,
      storage: database.capabilities.engine.storage.StrategyEnum.distributed,
      tags: [],
      versions: [
        { default: true, name: '6', tags: [], lifecycle: mockedLifecycle },
      ],
      lifecycle: mockedLifecycle,
      sslModes: ['required'],
    },
    {
      name: 'postgresql',
      category: database.engine.CategoryEnum.operational,
      description: 'postgresql description',
      order: 1,
      storage: database.capabilities.engine.storage.StrategyEnum.distributed,
      tags: [],
      versions: [
        { default: true, name: '4', tags: [], lifecycle: mockedLifecycle },
      ],
      lifecycle: mockedLifecycle,
      sslModes: ['required'],
    },
    {
      name: 'grafana',
      category: database.engine.CategoryEnum.operational,
      description: 'grafana description',
      order: 2,
      storage: database.capabilities.engine.storage.StrategyEnum.distributed,
      tags: [],
      versions: [
        { default: true, name: '1', tags: [], lifecycle: mockedLifecycle },
      ],
      lifecycle: mockedLifecycle,
      sslModes: ['required'],
    },
  ],
  disks: ['disk1', 'disk2'],
  flavors: [
    {
      name: 'free',
      lifecycle: mockedLifecycle,
      order: 0,
      tags: [],
      specifications: {
        core: 0,
        memory: { value: 0, unit: 'GB' },
        storage: { value: 512, unit: 'MB' },
      },
    },
    {
      name: 'db1',
      lifecycle: mockedLifecycle,
      order: 1,
      tags: [],
      specifications: {
        core: 2,
        memory: { value: 16, unit: 'GB' },
        storage: { value: 20, unit: 'GB' },
      },
    },
    {
      name: 'db2',
      lifecycle: mockedLifecycle,
      order: 2,
      tags: [],
      specifications: {
        core: 3,
        memory: { value: 32, unit: 'GB' },
        storage: { value: 40, unit: 'GB' },
      },
    },
    {
      name: 'db3',
      lifecycle: mockedLifecycle,
      order: 3,
      tags: [],
      specifications: {
        core: 5,
        memory: { value: 64, unit: 'GB' },
        storage: { value: 40, unit: 'GB' },
      },
    },
  ],
  options: [
    {
      name: 'optionName',
      type: database.TypeEnum.boolean,
    },
  ],
  plans: [
    {
      name: 'discovery',
      description: 'discovery plan',
      lifecycle: mockedLifecycle,
      tags: [database.capabilities.TagEnum.new],
      order: 0,
      backupRetention: '1',
    },
    {
      name: 'essential',
      description: 'essential plan',
      lifecycle: mockedLifecycle,
      tags: [],
      order: 1,
      backupRetention: '3',
    },
  ],
  regions: [{ name: 'GRA', lifecycle: mockedLifecycle, order: 0, tags: [] }],
};
