import { mockedFramework } from '@/__tests__/helpers/mocks/notebook/framework';
import {
  getJobSpec,
  getNotebookSpec,
  humanizeFramework,
} from './orderFunnelHelper';
import * as ai from '@/types/cloud/project/ai';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/region';
import {
  mockedOrderFlavorCPU,
  mockedOrderFlavorGPU,
} from '@/__tests__/helpers/mocks/flavor';
import { mockedEditor } from '@/__tests__/helpers/mocks/notebook/editor';
import {
  mockedOrderPublicGit,
  mockedOrderVolumesGit,
  mockedOrderVolumesS3,
} from '@/__tests__/helpers/mocks/datastore';
import { JobOrderResult, NotebookOrderResult } from '@/types/orderFunnel';

describe('orderFunnelHelper', () => {
  it('humanizeFramework', () => {
    const fmk: ai.capabilities.notebook.Framework = mockedFramework;
    fmk.id = 'alicebob';
    expect(humanizeFramework(fmk)).toBe('Alice & Bob');
    fmk.id = 'myqlm';
    expect(humanizeFramework(fmk)).toBe('myQLM');
    fmk.id = 'autogluon-mxnet';
    expect(humanizeFramework(fmk)).toBe('Autogluon');
    fmk.id = 'fastai';
    expect(humanizeFramework(fmk)).toBe('Fastai');
    fmk.id = 'huggingface';
    expect(humanizeFramework(fmk)).toBe('Huggin Face');
    fmk.id = 'colatible';
    expect(humanizeFramework(fmk)).toBe('Miniconda');
    fmk.id = 'one-for-all';
    expect(humanizeFramework(fmk)).toBe('One for all');
    fmk.id = 'perceval';
    expect(humanizeFramework(fmk)).toBe('Perceval');
    fmk.id = 'noId';
    expect(humanizeFramework(fmk)).toBe(mockedFramework.name);
  });

  it('getNotebookSpec', () => {
    const orderResultCPU: NotebookOrderResult = {
      region: mockedCapabilitiesRegionGRA,
      flavor: mockedOrderFlavorCPU,
      resourcesQuantity: 2,
      framework: mockedFramework,
      version: '',
      editor: mockedEditor,
      notebookName: 'myNewNotebook',
      unsecureHttp: false,
      labels: {
        test: 'testLabel',
      },
      sshKey: ['myNewSshKey'],
      volumes: [mockedOrderVolumesS3, mockedOrderVolumesGit],
    };

    const orderResultGPU: NotebookOrderResult = {
      ...orderResultCPU,
      flavor: mockedOrderFlavorGPU,
      volumes: [mockedOrderPublicGit],
    };

    const notebookSpecInputCPU: ai.notebook.NotebookSpecInput = {
      env: {
        editorId: 'jupyterlab',
        frameworkId: 'noId',
        frameworkVersion: '',
      },
      labels: {
        test: 'testLabel',
      },
      name: 'myNewNotebook',
      region: 'GRA',
      resources: {
        cpu: 2,
        flavor: 'flavorCPUId',
      },
      sshPublicKeys: ['myNewSshKey'],
      unsecureHttp: false,
      volumes: [
        {
          cache: false,
          mountPath: '/s3',
          permission: ai.VolumePermissionEnum.RWD,
          volumeSource: {
            dataStore: {
              alias: 'alias',
              container: 'container',
            },
          },
        },
        {
          cache: true,
          mountPath: '/git',
          permission: ai.VolumePermissionEnum.RWD,
          volumeSource: {
            dataStore: {
              alias: 'alias',
              container: 'develop',
            },
          },
        },
      ],
    };

    const notebookSpecInputGPU: ai.notebook.NotebookSpecInput = {
      ...notebookSpecInputCPU,
      resources: {
        gpu: 2,
        flavor: 'flavorGPUId',
      },
      volumes: [
        {
          cache: false,
          mountPath: '/demo',
          permission: ai.VolumePermissionEnum.RO,
          volumeSource: {
            publicGit: {
              url: 'https://repo.git',
            },
          },
        },
      ],
    };
    expect(getNotebookSpec(orderResultCPU)).toStrictEqual(notebookSpecInputCPU);
    expect(getNotebookSpec(orderResultGPU)).toStrictEqual(notebookSpecInputGPU);
  });

  it('getJobSpec', () => {
    const jobOrderResultCPU: JobOrderResult = {
      region: mockedCapabilitiesRegionGRA,
      flavor: mockedOrderFlavorCPU,
      resourcesQuantity: 2,
      jobName: 'myNewJob',
      unsecureHttp: false,
      image: 'myImage',
      sshKey: ['myNewSshKey'],
      volumes: [mockedOrderVolumesS3, mockedOrderVolumesGit],
      dockerCommand: ['command', 'docker'],
    };

    const jobOrderResultGPU: JobOrderResult = {
      ...jobOrderResultCPU,
      flavor: mockedOrderFlavorGPU,
      volumes: [mockedOrderPublicGit],
    };

    const jobSpecInputCPU: ai.job.JobSpecInput = {
      name: 'myNewJob',
      region: 'GRA',
      image: 'myImage',
      resources: {
        cpu: 2,
        flavor: 'flavorCPUId',
      },
      sshPublicKeys: ['myNewSshKey'],
      unsecureHttp: false,
      command: ['command', 'docker'],
      volumes: [
        {
          cache: false,
          mountPath: '/s3',
          permission: ai.VolumePermissionEnum.RWD,
          volumeSource: {
            dataStore: {
              alias: 'alias',
              container: 'container',
            },
          },
        },
        {
          cache: true,
          mountPath: '/git',
          permission: ai.VolumePermissionEnum.RWD,
          volumeSource: {
            dataStore: {
              alias: 'alias',
              container: 'develop',
            },
          },
        },
      ],
    };

    const jobSpecInputGPU: ai.job.JobSpecInput = {
      ...jobSpecInputCPU,
      resources: {
        gpu: 2,
        flavor: 'flavorGPUId',
      },
      volumes: [
        {
          cache: false,
          mountPath: '/demo',
          permission: ai.VolumePermissionEnum.RO,
          volumeSource: {
            publicGit: {
              url: 'https://repo.git',
            },
          },
        },
      ],
    };
    expect(getJobSpec(jobOrderResultCPU)).toStrictEqual(jobSpecInputCPU);
    expect(getJobSpec(jobOrderResultGPU)).toStrictEqual(jobSpecInputGPU);
  });
});
