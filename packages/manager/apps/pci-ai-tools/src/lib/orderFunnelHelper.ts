import ai from '@/types/AI';
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
  const notebookEnv: ai.notebook.NotebookEnv = {
    frameworkId: formResult.framework.id,
    frameworkVersion: formResult.version,
    editorId: formResult.editor.id,
  };
  const notebookResource: ai.ResourcesInput =
    formResult.flavor.type === ai.capabilities.FlavorTypeEnum.cpu
      ? {
          flavor: formResult.flavor.id,
          cpu: Number(formResult.resourcesQuantity),
        }
      : {
          flavor: formResult.flavor.id,
          gpu: Number(formResult.resourcesQuantity),
        };

  const notebookInfos: ai.notebook.NotebookSpecInput = {
    env: notebookEnv,
    resources: notebookResource,
    name: formResult.notebookName,
    region: formResult.region.id,
    unsecureHttp: formResult.unsecureHttp,
    sshPublicKeys: formResult.sshKey,
    labels: formResult.labels,
  };

  if (formResult.volumes.length > 0) {
    notebookInfos.volumes = formResult.volumes.map((volume: OrderVolumes) => {
      return {
        cache: volume.cache,
        mountPath: volume.mountPath,
        permission: volume.permission,
        volumeSource: volume.publicGit
          ? { publicGit: volume.publicGit }
          : {
              dataStore: {
                alias: volume.dataStore.alias,
                container: volume.dataStore.container,
              },
            },
      };
    });
  }
  return notebookInfos;
}
