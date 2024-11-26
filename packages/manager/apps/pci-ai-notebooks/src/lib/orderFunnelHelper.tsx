import * as ai from '@/types/cloud/project/ai';
import { NotebookOrderResult, OrderVolumes } from '@/types/orderFunnel';

export function humanizeFramework(
  framework: ai.capabilities.notebook.Framework,
) {
  switch (framework.id) {
    case 'alicebob':
      return 'Alice & Bob';
    case 'myqlm':
      return 'myQLM';
    case 'autogluon-mxnet':
      return 'Autogluon';
    case 'fastai':
      return 'Fastai';
    case 'huggingface':
      return 'Huggin Face';
    case 'colatible':
      return 'Miniconda';
    case 'one-for-all':
      return 'One for all';
    case 'perceval':
      return 'Perceval';
    default:
      return framework.name;
  }
}

export function getNotebookSpec(formResult: NotebookOrderResult) {
  const notebookInfos: ai.notebook.NotebookSpec = {
    env: {
      frameworkId: formResult.framework.id,
      frameworkVersion: formResult.version,
      editorId: formResult.editor.id,
    },
    region: formResult.region.id,
    unsecureHttp: formResult.unsecureHttp,
    sshPublicKeys: formResult.sshKey,
    labels: formResult.labels,
  };

  if (formResult.flavor.type === ai.capabilities.FlavorTypeEnum.cpu) {
    notebookInfos.resources = {
      flavor: formResult.flavor.id,
      cpu: formResult.resourcesQuantity,
    };
  } else {
    notebookInfos.resources = {
      flavor: formResult.flavor.id,
      gpu: formResult.resourcesQuantity,
    };
  }

  if (formResult.volumes.length > 0) {
    notebookInfos.volumes = formResult.volumes.map((volume: OrderVolumes) => ({
      cache: volume.cache,
      dataStore: {
        alias: volume.dataStore.alias,
        container: volume.dataStore.container,
      },
      mountPath: volume.mountPath,
      permission: volume.permission,
    }));
  }

  return notebookInfos;
}
