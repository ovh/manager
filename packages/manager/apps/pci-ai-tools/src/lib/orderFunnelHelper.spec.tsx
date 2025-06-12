import {
  getAppSpec,
  getJobSpec,
  getNotebookSpec,
  humanizeFramework,
} from './orderFunnelHelper';
import ai from '@/types/AI';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import {
  mockedOrderFlavorCPU,
  mockedOrderFlavorGPU,
} from '@/__tests__/helpers/mocks/capabilities/flavor';
import { mockedEditor } from '@/__tests__/helpers/mocks/capabilities/notebookEditor';
import {
  mockedOrderPublicGit,
  mockedOrderVolumesGit,
  mockedOrderVolumesS3,
} from '@/__tests__/helpers/mocks/volume/datastore';
import {
  AppOrderResult,
  JobOrderResult,
  NotebookOrderResult,
} from '@/types/orderFunnel';
import {
  mockedNotebookSpecInput,
  mockedNotebookSpecInputGPU,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { mockedFramework } from '@/__tests__/helpers/mocks/capabilities/notebookFramework';
import {
  mockedJobSpecInput,
  mockedJobSpecInputGPU,
} from '@/__tests__/helpers/mocks/job/job';
import { mockedOrderScaling } from '@/__tests__/helpers/mocks/app/appHelper';
import { mockedPartnerImagePerApp } from '@/__tests__/helpers/mocks/partner/partner';
import {
  mockedAppSpecInput,
  mockedAppSpecInputGPU,
} from '@/__tests__/helpers/mocks/app/app';

describe('orderFunnelHelper', () => {
  it('getNotebookSpec', () => {
    const orderResultCPU: NotebookOrderResult = {
      region: mockedCapabilitiesRegionGRA,
      flavor: mockedOrderFlavorCPU,
      resourcesQuantity: 2,
      framework: mockedFramework,
      version: 'version',
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

    expect(getNotebookSpec(orderResultCPU)).toStrictEqual(
      mockedNotebookSpecInput,
    );
    expect(getNotebookSpec(orderResultGPU)).toStrictEqual(
      mockedNotebookSpecInputGPU,
    );
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

    expect(getJobSpec(jobOrderResultCPU)).toStrictEqual(mockedJobSpecInput);
    expect(getJobSpec(jobOrderResultGPU)).toStrictEqual(mockedJobSpecInputGPU);
  });

  it('getAppSpec', () => {
    const appOrderResultCPU: AppOrderResult = {
      region: mockedCapabilitiesRegionGRA,
      flavor: mockedOrderFlavorCPU,
      resourcesQuantity: 2,
      appName: 'myNewApp',
      unsecureHttp: false,
      image: 'myImage',
      version: '',
      httpPort: 8080,
      volumes: [mockedOrderVolumesS3, mockedOrderVolumesGit],
      dockerCommand: ['command', 'docker'],
      scaling: mockedOrderScaling,
      labels: {
        test: 'testLabel',
      },
      probe: {
        path: '/health',
        port: 8080,
      },
    };

    const appOrderResultGPU: AppOrderResult = {
      ...appOrderResultCPU,
      flavor: mockedOrderFlavorGPU,
      volumes: [mockedOrderPublicGit],
      version: '1',
      image: 'sentiment-analysis-app',
      scaling: {
        ...mockedOrderScaling,
        autoScaling: false,
      },
    };
    expect(
      getAppSpec(appOrderResultCPU, [mockedPartnerImagePerApp]),
    ).toStrictEqual(mockedAppSpecInput);
    expect(
      getAppSpec(appOrderResultGPU, [mockedPartnerImagePerApp]),
    ).toStrictEqual(mockedAppSpecInputGPU);
  });

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
});
