import { getNotebookSpec, humanizeFramework } from './orderFunnelHelper';
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
import { NotebookOrderResult } from '@/types/orderFunnel';
import {
  mockedNotebookSpecInput,
  mockedNotebookSpecInputGPU,
} from '@/__tests__/helpers/mocks/notebook/notebook';
import { mockedFramework } from '@/__tests__/helpers/mocks/capabilities/notebookFramework';

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
