import ai from '@/types/AI';
import {
  JobOrderResult,
  NotebookOrderResult,
  OrderVolumes,
} from '@/types/orderFunnel';

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
          ? {
              publicGit: {
                url: volume.publicGit.url,
              },
            }
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

export function getJobSpec(formResult: JobOrderResult) {
  const jobResource: ai.ResourcesInput =
    formResult.flavor.type === ai.capabilities.FlavorTypeEnum.cpu
      ? {
          flavor: formResult.flavor.id,
          cpu: Number(formResult.resourcesQuantity),
        }
      : {
          flavor: formResult.flavor.id,
          gpu: Number(formResult.resourcesQuantity),
        };

  const jobInfos: ai.job.JobSpecInput = {
    resources: jobResource,
    name: formResult.jobName,
    image: formResult.image,
    region: formResult.region.id,
    unsecureHttp: formResult.unsecureHttp,
    sshPublicKeys: formResult.sshKey,
    command: formResult.dockerCommand,
  };

  if (formResult.volumes.length > 0) {
    jobInfos.volumes = formResult.volumes.map((volume: OrderVolumes) => {
      return {
        cache: volume.cache,
        mountPath: volume.mountPath,
        permission: volume.permission,
        volumeSource: volume.publicGit
          ? {
              publicGit: {
                url: volume.publicGit.url,
              },
            }
          : {
              dataStore: {
                alias: volume.dataStore.alias,
                container: volume.dataStore.container,
              },
            },
      };
    });
  }
  return jobInfos;
}
