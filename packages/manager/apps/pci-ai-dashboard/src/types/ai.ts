/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-namespace */
export namespace ai {
  export namespace app {
    /** AI Solutions Platform App Object */
    export interface App {
      /** App creation date */
      createdAt: string;
      /** App Id */
      id: string;
      /** App spec */
      spec: ai.app.AppSpec;
      /** App Container Status */
      status: ai.app.AppStatus;
      /** App last update date */
      updatedAt: string;
      /** App user owner */
      user: string;
    }
    /** AI App Image object */
    export interface AppImageInput {
      /** URL of the Docker image */
      url: string;
    }
    /** AI Solutions App Spec Object to create an app */
    export interface AppSpec {
      /** App command */
      command?: string[];
      /** Default port to access the http service inside the app */
      defaultHttpPort?: number;
      /** AI App deployment strategy */
      deploymentStrategy?: ai.app.DeploymentStrategy;
      /** List of environment variable to be set inside the app */
      envVars?: ai.job.JobEnv[];
      /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
      grpcPort?: number;
      /** App image */
      image: string;
      /** Labels for the app */
      labels?: Record<string, string>;
      /** App name */
      name: string;
      /** Partner ID */
      partnerId?: string;
      /** App readiness probe */
      probe?: ai.app.Probe;
      /** Host region of the app */
      region: string;
      /** App resources */
      resources: ai.Resources;
      /** App scaling strategy */
      scalingStrategy?: ai.app.ScalingStrategy;
      /** True if app api port can be accessed without any authentication token, false otherwise */
      unsecureHttp?: boolean;
      /** App Data linked */
      volumes?: ai.volume.Volume[];
    }
    /** AI Solutions App Spec Object to create a app */
    export interface AppSpecInput {
      /** App command */
      command?: string[];
      /** Default port to access http service inside the app */
      defaultHttpPort?: number;
      /** AI App deployment strategy */
      deploymentStrategy?: ai.app.DeploymentStrategy;
      /** List of environment variable to be set inside the app */
      envVars?: ai.job.JobEnv[];
      /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
      grpcPort?: number;
      /** Docker or capability image to use in the app. App capability images must comply with the pattern 'image-id:version' */
      image: string;
      /** Labels are used to scope tokens, labels prefixed by 'ovh/' are owned by the platform and overridden */
      labels?: Record<string, string>;
      /** App name */
      name: string;
      /** Partner ID */
      partnerId?: string;
      /** App readiness probe */
      probe?: ai.app.ProbeInput;
      /** Host region of the app */
      region: string;
      /** App resources */
      resources: ai.ResourcesInput;
      /** App scaling strategy */
      scalingStrategy?: ai.app.ScalingStrategyInput;
      /** Whether if app api port can be accessed without any authentication token */
      unsecureHttp?: boolean;
      /** App Data linked */
      volumes?: ai.volume.Volume[];
    }
    /** State of the application */
    export enum AppStateEnum {
      'DELETED' = 'DELETED',
      'DELETING' = 'DELETING',
      'ERROR' = 'ERROR',
      'FAILED' = 'FAILED',
      'INITIALIZING' = 'INITIALIZING',
      'QUEUED' = 'QUEUED',
      'RUNNING' = 'RUNNING',
      'SCALING' = 'SCALING',
      'STOPPED' = 'STOPPED',
      'STOPPING' = 'STOPPING',
    }
    /** AI Solutions App State History Object */
    export interface AppStateHistory {
      /** Date when the status occurred */
      date: string;
      /** State of the app */
      state: ai.app.AppStateEnum;
    }
    /** AI Solutions App Status Object */
    export interface AppStatus {
      /** Number of available replicas */
      availableReplicas: number;
      /** Status about the datasync linked to the app */
      dataSync: ai.volume.DataSync[];
      /** Address to reach when you want to access the App's gRPC services */
      grpcAddress?: string;
      /** Job state history */
      history: ai.app.AppStateHistory[];
      /** Information about the app */
      info: ai.Info;
      /** App info url */
      infoUrl?: string;
      /** Internal IP address of the app service */
      internalServiceIp?: string;
      /** Date of the last app state change */
      lastTransitionDate?: string;
      /** App resource usage url */
      monitoringUrl?: string;
      /** State of the app */
      state?: ai.app.AppStateEnum;
      /** App access url */
      url?: string;
      /** App Data linked */
      volumes?: ai.volume.VolumeStatus[];
    }
    /** AI Solutions AI App deployment strategy object */
    export interface DeploymentStrategy {
      /** Maximum number of replicas that can be created over the desired number of Pods (can be expressed as a percentage of the desired pods, suffixed with '%') */
      maxSurge?: string;
      /** Maximum number of replicas that can be unavailable during the update process (can be expressed as a percentage of the desired pods, suffixed with '%') */
      maxUnavailable?: string;
      /** Number of seconds you want to wait for your Deployment to progress before the system reports back that the Deployment has failed progressing */
      progressDeadlineSeconds?: number;
    }
    /** AI Solutions App Probe Object */
    export interface Probe {
      /** Path to access to check for readiness */
      path?: string;
      /** Port to access to check for readiness */
      port?: number;
    }
    /** AI Solutions App Probe Object */
    export interface ProbeInput {
      /** Path to access to check for readiness */
      path?: string;
      /** Port to access to check for readiness */
      port?: number;
    }
    /** AI Solutions App automatic scaling strategy object */
    export interface ScalingAutomaticStrategy {
      /** The average resource usage threshold that the app upscale or downscale will be triggered from, in percent */
      averageUsageTarget: number;
      /** Maximum number of replicas */
      replicasMax: number;
      /** Minimum number of replicas */
      replicasMin: number;
      /** Type of the resource to base the automatic scaling on */
      resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum;
    }
    /** AI Solutions App automatic scaling strategy object */
    export interface ScalingAutomaticStrategyInput {
      /** The average resource usage threshold that the app upscale or downscale will be triggered from, in percent */
      averageUsageTarget: number;
      /** Maximum number of replicas */
      replicasMax: number;
      /** Minimum number of replicas */
      replicasMin: number;
      /** Type of the resource to base the automatic scaling on */
      resourceType: ai.app.ScalingAutomaticStrategyResourceTypeEnum;
    }
    /** Resource type for App automatic scaling strategy */
    export enum ScalingAutomaticStrategyResourceTypeEnum {
      'CPU' = 'CPU',
      'RAM' = 'RAM',
    }
    /** AI Solutions App Status Object */
    export interface ScalingFixedStrategy {
      /** Number of wanted replicas */
      replicas: number;
    }
    /** AI Solutions App Status Object */
    export interface ScalingFixedStrategyInput {
      /** Number of wanted replicas */
      replicas: number;
    }
    /** AI Solutions App Status Object */
    export interface ScalingStrategy {
      /** Strategy setting a variable number of replicas, based on an average resource usage threshold */
      automatic?: ai.app.ScalingAutomaticStrategy;
      /** Strategy setting a fix number of replicas */
      fixed?: ai.app.ScalingFixedStrategy;
    }
    /** AI Solutions App Status Object */
    export interface ScalingStrategyInput {
      /** Strategy setting a variable number of replicas, based on an average resource usage threshold (conflicts with 'fixed' property when both are not null) */
      automatic?: ai.app.ScalingAutomaticStrategyInput;
      /** Strategy setting a fix number of replicas (conflicts with 'automatic' property when both are not null) */
      fixed?: ai.app.ScalingFixedStrategyInput;
    }
    /** AI Solutions AI App update object */
    export interface UpdateInput {
      /** Default port to access http service inside the app */
      defaultHttpPort?: number;
      /** Deployment strategy to use when updating this AI App */
      deploymentStrategy?: ai.app.DeploymentStrategy;
      /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
      grpcPort?: number;
      /** URL of the Docker image for this AI deployment */
      url?: string;
    }
  }
  export namespace capabilities {
    export namespace app {
      /** AI Solutions App image object */
      export interface Image {
        /** Short description of the image */
        description: string;
        /** URL of the image documentation */
        docUrl: string;
        /** Unique identifier of the image */
        id: string;
        /** Type of licensing */
        licensing: ai.capabilities.LicensingTypeEnum;
        /** URL of the logo of the image */
        logoUrl: string;
        /** Name of the image */
        name: string;
        /** ID of the partner providing the image */
        partnerId: string;
        /** Name of the partner providing the image */
        partnerName: string;
        /** List of available versions of this image */
        versions: string[];
      }
    }
    export namespace flavor {
      /** AI Solutions Global GPU information */
      export interface GpuInformation {
        /** The GPU Brand */
        gpuBrand: string;
        /** The GPU Memory in bits */
        gpuMemory: number;
        /** The GPU Model */
        gpuModel: string;
      }
      /** AI Solutions Global Resource per flavor unit */
      export interface ResourcesPerUnit {
        /** The amount of cpu for one unit of the flavor */
        cpu: number;
        /** The amount of ephemeral storage in bytes */
        ephemeralStorage: number;
        /** The amount of memory in bytes */
        memory: number;
        /** The guarantee private bandwidth in bytes per seconds */
        privateNetwork: number;
        /** The guarantee public bandwidth in bytes per seconds */
        publicNetwork: number;
      }
    }
    export namespace job {
      /** AI Solutions Job image object */
      export interface Image {
        /** Short description of the image */
        description: string;
        /** URL of the image documentation */
        docUrl: string;
        /** Unique identifier of the image */
        id: string;
        /** URL of the logo of the image */
        logoUrl: string;
        /** Name of the image */
        name: string;
        /** List of available versions of this image */
        versions: string[];
      }
    }
    export namespace notebook {
      /** AI Solutions Notebook editor object */
      export interface Editor {
        /** Short description of the editor */
        description: string;
        /** URL of the editor documentation */
        docUrl: string;
        /** Unique identifier of the editor */
        id: string;
        /** URL of the logo of the editor */
        logoUrl: string;
        /** Name of the editor */
        name: string;
        /** List of available versions of this editor */
        versions: string[];
      }
      /** AI Solutions Notebook framework object */
      export interface Framework {
        /** Short description of the framework */
        description: string;
        /** URL of the framework documentation */
        docUrl: string;
        /** Unique identifier of the framework */
        id: string;
        /** URL of the logo of the framework */
        logoUrl: string;
        /** Name of the framework */
        name: string;
        /** List of paths that are automatically saved */
        savedPaths?: string[];
        /** List of available versions of this framework */
        versions: string[];
      }
    } /** AI Solutions Features */
    export interface Features {
      /** Inform if the AI Solutions is in Lab mode or not */
      lab: boolean;
      /** Capability to add registry */
      registry: boolean;
    }
    /** AI Solutions Flavor */
    export interface Flavor {
      /** Is the flavor the default one for a flavor type */
      default: boolean;
      /** Flavor description */
      description: string;
      /** Describe gpu informations */
      gpuInformation?: ai.capabilities.flavor.GpuInformation;
      /** Flavor id */
      id: string;
      /** Maximum amount available for a job / notebook */
      max: number;
      /** Describe the amount of resources given per unit of the flavor */
      resourcesPerUnit: ai.capabilities.flavor.ResourcesPerUnit;
      /** Flavor type */
      type: ai.capabilities.FlavorTypeEnum;
    }
    /** Flavor Type */
    export enum FlavorTypeEnum {
      'cpu' = 'cpu',
      'gpu' = 'gpu',
    }
    /** Licensing Type */
    export enum LicensingTypeEnum {
      'per-app' = 'per-app',
      'per-replica' = 'per-replica',
      'per-resource' = 'per-resource',
      'per-second-bracket' = 'per-second-bracket',
    }
    /** AI Solutions Preset image */
    export interface Preset {
      /** Preset capabilities */
      capabilities: ai.capabilities.PresetCapabilities;
      /** Preset description */
      descriptions: string[];
      /** URL toward the preset image documentation */
      docUrl: ai.capabilities.PresetDocumentationUrl[];
      /** Preset id */
      id: string;
      /** URL toward the logo to illustrate the preset */
      logoUrl: string;
      /** Preset name */
      name: string;
      /** Partner name */
      partner: ai.job.Partner;
      /** Snippet example of the doc */
      snippet: string;
      /** Preset type */
      type: ai.capabilities.PresetTypeEnum;
    }
    /** AI Solutions Preset image enabled features */
    export interface PresetCapabilities {
      /** Exec enabled */
      exec: boolean;
      /** Flavor types */
      flavorTypes: ai.capabilities.FlavorTypeEnum[];
      /** Log enabled */
      log: boolean;
      /** Resources requirements */
      resources: ai.capabilities.PresetResources;
      /** SSH enabled */
      ssh: boolean;
      /** Volume enabled */
      volume: boolean;
    }
    /** AI Solutions Preset image */
    export interface PresetDocumentationUrl {
      /** Documentation Name */
      name: string;
      /** Documentation URL */
      url: string;
    }
    /** AI Solutions Preset resources requirements */
    export interface PresetResources {
      /** Maximum number of GPUs supported */
      maxGpu: number;
    }
    /** Preset Type */
    export enum PresetTypeEnum {
      'app' = 'app',
      'job' = 'job',
      'notebook' = 'notebook',
    }
    /** AI Solutions Project Quotas */
    export interface ProjectQuotas {
      /** Project's quotas per compute-type resource (e.g CPU/GPU) */
      resources: Record<string, number>;
      /** Storage quota (in bits) that is allocated to the project */
      storage: number;
    }
    /** AI Solutions Region */
    export interface Region {
      /** Client Install Url */
      cliInstallUrl: string;
      /** Documentation Url */
      documentationUrl: string;
      /** Region id */
      id: string;
      /** Region Registry Url */
      registryUrl: string;
      /** Region version */
      version: string;
    }
  }
  export namespace job {
    /** AI Solutions Job Object */
    export interface Job {
      /** Job creation date */
      createdAt: string;
      /** Job Id */
      id: string;
      /** Job specifications */
      spec: ai.job.JobSpec;
      /** Job status */
      status: ai.job.JobStatus;
      /** Job update date */
      updatedAt: string;
      /** Job user owner */
      user: string;
    }
    /** AI Solutions Job Env Object */
    export interface JobEnv {
      /** Name of the environment variable to set inside the job */
      name: string;
      /** Value of the environment variable to set inside the job */
      value: string;
    }
    /** AI Solutions Job Spec Object to create a job */
    export interface JobSpec {
      /** Job command */
      command?: string[];
      /** Port use as the default one to access http service inside job */
      defaultHttpPort?: number;
      /** List of environment variable to be set inside job */
      envVars?: ai.job.JobEnv[];
      /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
      grpcPort?: number;
      /** Job image */
      image: string;
      /** Labels for the job */
      labels?: Record<string, string>;
      /** Job name */
      name: string;
      /** Partner ID */
      partnerId?: string;
      /** User ID to use to access the job */
      readUser?: string;
      /** Host region of the job */
      region: string;
      /** Job resources */
      resources: ai.Resources;
      /** Shutdown strategy (if any) */
      shutdown?: ai.ShutdownStrategyEnum;
      /** SSH keys authorized to access to the job container */
      sshPublicKeys?: string[];
      /** Maximum time to spend before killing the job */
      timeout?: number;
      /** Whether job should be restarted after timeout */
      timeoutAutoRestart?: boolean;
      /** Whether job api port can be accessed without any authentication token */
      unsecureHttp?: boolean;
      /** Job Data linked */
      volumes?: ai.volume.Volume[];
    }
    /** AI Solutions Job Spec Object to create a job */
    export interface JobSpecInput {
      /** Job command */
      command?: string[];
      /** Port use as the default one to access http service inside job */
      defaultHttpPort?: number;
      /** List of environment variable to be set inside job */
      envVars?: ai.job.JobEnv[];
      /** GRPC Port that we want to expose in case workload HTTP & gRPC servers cannot be multiplexed to listen on the same port */
      grpcPort?: number;
      /** Job image */
      image: string;
      /** Labels are used to scope tokens, labels prefixed by 'ovh/' are owned by the platform and overridden */
      labels?: Record<string, string>;
      /** Job name */
      name: string;
      /** Partner ID */
      partnerId?: string;
      /** User ID to use to access the job */
      readUser?: string;
      /** Host region of the job */
      region: string;
      /** Job resources */
      resources: ai.ResourcesInput;
      /** Shutdown strategy (if any) */
      shutdown?: ai.ShutdownStrategyEnum;
      /** SSH keys authorized to access to the job container */
      sshPublicKeys?: string[];
      /** Maximum time to spend before killing the job */
      timeout?: number;
      /** Whether job is set to be restarted after timeout */
      timeoutAutoRestart?: boolean;
      /** Whether job api port can be accessed without any authentication token */
      unsecureHttp?: boolean;
      /** Job Data linked */
      volumes?: ai.volume.Volume[];
    }
    /** State of the job */
    export enum JobStateEnum {
      'DONE' = 'DONE',
      'ERROR' = 'ERROR',
      'FAILED' = 'FAILED',
      'FINALIZING' = 'FINALIZING',
      'INITIALIZING' = 'INITIALIZING',
      'INTERRUPTED' = 'INTERRUPTED',
      'INTERRUPTING' = 'INTERRUPTING',
      'PENDING' = 'PENDING',
      'QUEUED' = 'QUEUED',
      'RESTARTING' = 'RESTARTING',
      'RUNNING' = 'RUNNING',
      'SYNC_FAILED' = 'SYNC_FAILED',
      'TIMEOUT' = 'TIMEOUT',
    }
    /** AI Solutions Job Status Object */
    export interface JobStatus {
      /** Status about the datasync linked to the job */
      dataSync: ai.volume.DataSync[];
      /** Duration of the job */
      duration?: number;
      /** Exit code of the job */
      exitCode?: number;
      /** External IP of the job */
      externalIp?: string;
      /** Date when the job was finalized */
      finalizedAt?: string;
      /** Address to reach when you want to access the Job's gRPC services */
      grpcAddress?: string;
      /** Job state history */
      history: ai.job.JobStatusHistory[];
      /** Information about the job */
      info: ai.Info;
      /** Job info url */
      infoUrl?: string;
      /** Date when the job was initialized */
      initializingAt?: string;
      /** IP of the job */
      ip?: string;
      /** Date of the last transition */
      lastTransitionDate?: string;
      /** Job resource usage url */
      monitoringUrl?: string;
      /** Date when the job was queued */
      queuedAt?: string;
      /** SSH Url fot the job */
      sshUrl?: string;
      /** Date when the job was started */
      startedAt?: string;
      /** State of the job */
      state?: ai.job.JobStateEnum;
      /** Date when the job was stop */
      stoppedAt?: string;
      /** Date when the job is planned to timeout */
      timeoutAt?: string;
      /** Job access url */
      url?: string;
      /** Job Data linked */
      volumes?: ai.volume.VolumeStatus[];
    }
    /** AI Solutions Job Status History Object */
    export interface JobStatusHistory {
      /** Date when the status occurred */
      date: string;
      /** State of the job */
      state: ai.job.JobStateEnum;
    }
    /** AI Solutions Partner Object */
    export interface Partner {
      /** Partner flavor */
      flavor: string;
      /** Partner ID */
      id: string;
      /** Partner name */
      name: string;
    }
    /** A Image of a preset data science image */
    export interface PresetImage {
      /** Model Image Description */
      description: string;
      /** Image id */
      id: string;
      /** Link to the Opensource Model */
      link?: string;
      /** Framework logo */
      logo?: string;
      /** Model Image Name */
      name: string;
    }
  }
  export namespace notebook {
    /** AI Solutions Platform Notebook Backup Object */
    export interface Backup {
      /** Backup creation date */
      createdAt: string;
      /** Backup Id */
      id: string;
      /** Backup last update date */
      updatedAt: string;
    }
    /** AI Solutions Data Object */
    export interface Editor {
      /** Short description of the code editor */
      description: string;
      /** URL toward the code editor documentation */
      docUrl: string;
      /** Unique identifier of the code editor */
      id: string;
      /** URL toward the logo to illustrate the editor */
      logoUrl: string;
      /** Name of the code editor */
      name: string;
      /** Version of the code editor */
      version: string;
    }
    /** AI Solutions Data Object */
    export interface Framework {
      /** Short description of the framework */
      description: string;
      /** URL toward the framework documentation */
      docUrl: string;
      /** Unique identifier of the framework */
      id: string;
      /** URL toward the logo to illustrate the framework */
      logoUrl: string;
      /** Name of the framework */
      name: string;
      /** Available versions for the framework (default is the first one) */
      versions: string[];
    }
    /** AI Solutions Platform Notebook Object */
    export interface Notebook {
      /** Notebook creation date */
      createdAt: string;
      /** Notebook Id */
      id: string;
      /** Notebook spec */
      spec: ai.notebook.NotebookSpec;
      /** Notebook Container Status */
      status: ai.notebook.NotebookStatus;
      /** Notebook last update date */
      updatedAt: string;
      /** Notebook user owner */
      user: string;
    }
    /** AI Solutions Framework Object to create a notebook */
    export interface NotebookEnv {
      /** Code editor to use */
      editorId: string;
      /** Framework name */
      frameworkId: string;
      /** Framework version to use */
      frameworkVersion?: string;
    }
    /** AI Solutions Notebook Spec Object to create a notebook */
    export interface NotebookSpec {
      /** Environment to deploy in this notebook */
      env: ai.notebook.NotebookEnv;
      /** List of environment variables to be set inside the notebook */
      envVars: ai.job.JobEnv[];
      /** Current notebook flavor */
      flavor?: string;
      /** Labels for the notebook */
      labels?: Record<string, string>;
      /** Notebook name */
      name: string;
      /** Host region of the notebook */
      region: string;
      /** Notebook resources */
      resources: ai.Resources;
      /** Shutdown strategy (if any) */
      shutdown?: ai.ShutdownStrategyEnum;
      /** SSH keys authorized to access the notebook */
      sshPublicKeys?: string[];
      /** Whether notebook is set to be restarted after timeout */
      timeoutAutoRestart?: boolean;
      /** Whether notebook api port can be accessed without any authentication token */
      unsecureHttp?: boolean;
      /** Notebook Data linked */
      volumes?: ai.volume.Volume[];
    }
    /** AI Solutions Notebook Spec Object to create a notebook */
    export interface NotebookSpecInput {
      /** Environment to deploy in this notebook */
      env: ai.notebook.NotebookEnv;
      /** List of environment variables to be set inside the notebook */
      envVars?: ai.job.JobEnv[];
      /** Labels are used to scope tokens, labels prefixed by 'ovh/' are owned by the platform and overridden */
      labels?: Record<string, string>;
      /** Notebook name */
      name: string;
      /** Host region of the notebook */
      region: string;
      /** Notebook resources */
      resources: ai.ResourcesInput;
      /** Shutdown strategy (if any) */
      shutdown?: ai.ShutdownStrategyEnum;
      /** SSH keys authorized to access the notebook */
      sshPublicKeys?: string[];
      /** Whether notebook is set to be restarted after timeout */
      timeoutAutoRestart?: boolean;
      /** Whether notebook api port can be accessed without any authentication token */
      unsecureHttp?: boolean;
      /** Notebook Data linked */
      volumes?: ai.volume.Volume[];
    }
    /** State of the notebook */
    export enum NotebookStateEnum {
      'DELETING' = 'DELETING',
      'FAILED' = 'FAILED',
      'RESTARTING' = 'RESTARTING',
      'RUNNING' = 'RUNNING',
      'STARTING' = 'STARTING',
      'STOPPED' = 'STOPPED',
      'STOPPING' = 'STOPPING',
      'SYNC_FAILED' = 'SYNC_FAILED',
    }
    /** AI Solutions Notebook Status Object */
    export interface NotebookStatus {
      /** Status about the datasync linked to the job */
      dataSync: ai.volume.DataSync[];
      /** Duration of the notebook in seconds */
      duration?: number;
      /** Address to reach when you want to access the Notebook's gRPC services */
      grpcAddress?: string;
      /** Information about the notebook */
      info: ai.Info;
      /** Notebook info url */
      infoUrl?: string;
      /** Status for the last job run */
      lastJobStatus: ai.job.JobStatus;
      /** Date when the notebook was last started */
      lastStartedAt?: string;
      /** Date when the notebook was last stopped */
      lastStoppedAt?: string;
      /** Notebook resource usage url */
      monitoringUrl?: string;
      /** SSH Url for the notebook */
      sshUrl?: string;
      /** State of the notebook */
      state?: ai.notebook.NotebookStateEnum;
      /** Notebook access url */
      url?: string;
      /** Notebook Data linked */
      volumes?: ai.volume.VolumeStatus[];
      /** State of the notebook workspace */
      workspace?: ai.notebook.NotebookWorkspace;
    }
    /** AI Solutions Notebook Spec Object to update a notebook */
    export interface NotebookUpdate {
      /** Labels for the notebook */
      labels?: Record<string, string>;
      /** Notebook resources */
      resources?: ai.ResourcesInput;
      /** SSH keys authorized to access the notebook */
      sshPublicKeys?: string[];
      /** Whether notebook is set to be restarted after timeout */
      timeoutAutoRestart?: boolean;
      /** Whether notebook api port can be accessed without any authentication token */
      unsecureHttp?: boolean;
      /** Notebook Data linked */
      volumes?: ai.volume.Volume[];
    }
    /** AI Solutions Notebook Workspace Object */
    export interface NotebookWorkspace {
      /** The number of storage bytes free of charges for notebook workspace */
      storageFree: number;
      /** The number of storage bytes currently used to persist notebook workspace */
      storageUsed: number;
    }
  }
  export namespace partner {
    /** Representation of a partner's contract with logged in user's tenant */
    export interface Contract {
      /** Contract signature date for the logged in user's tenant */
      signedAt?: string;
      /** Map of terms of service details per locale */
      termsOfService: Record<string, ai.partner.ContractTermsLocale>;
    }
    /** Representation of a partner's contract on a given language */
    export interface ContractTermsLocale {
      /** Contract file URL for a given language */
      url: string;
    }
    /** Representation of a partner */
    export interface Partner {
      /** Partner contract with logged in user's tenant */
      contract?: ai.partner.Contract;
      /** Partner creation date */
      createdAt: string;
      /** Partner Description */
      description: string;
      /** Partner Id */
      id: string;
      /** Partner Name */
      name: string;
    }
  }
  export namespace registry {
    /** Representation of a registry */
    export interface Registry {
      /** Registry creation date */
      createdAt: string;
      /** Registry Id */
      id: string;
      /** Docker registry password */
      password?: string;
      /** Region where the registry is available */
      region: string;
      /** Registry update date */
      updatedAt: string;
      /** Docker registry URL */
      url?: string;
      /** Registry user creator */
      user: string;
      /** Docker registry username */
      username?: string;
    }
    /** Docker registry update object */
    export interface RegistryEdition {
      /** Docker registry password */
      password?: string;
      /** Docker registry URL */
      url?: string;
      /** Docker registry username */
      username?: string;
    }

    /** Docker registry update object */
    export interface RegistryCreation {
      /** Docker registry password */
      password: string;
      /** Region where the registry is available */
      region: string;
      /** Docker registry URL */
      url: string;
      /** Docker registry username */
      username: string;
    }
  }
  export namespace token {
    /** AI Solutions Application Token */
    export interface Token {
      /** Application token creation date */
      createdAt: string;
      /** Application token Id */
      id: string;
      /** Application token spec */
      spec: ai.token.TokenSpec;
      /** Application token status */
      status: ai.token.TokenStatus;
      /** Application token update date */
      updatedAt: string;
    }
    /** AI Solutions Application Token Spec Object to create a notebook */
    export interface TokenSpec {
      /** Application token label selector */
      labelSelector?: string;
      /** Application token name */
      name: string;
      /** Public Cloud Storage Region */
      region: string;
      /** Role granted by this application token */
      role: ai.TokenRoleEnum;
    }
    /** AI Solutions Application Token Status Object */
    export interface TokenStatus {
      /** Application token value to use as a Bearer */
      value?: string;
      /** Application token version */
      version: number;
    }
  }
  export namespace volume {
    /** AI Solutions data store container Volume Object */
    export interface DataStore {
      /** Data store alias */
      alias: string;
      /** Name of the tar archive that needs to be saved */
      archive?: string;
      /** Data store container to attach */
      container: string;
      /** True if data is stored on OVHcloud AI's internal storage */
      internal?: boolean;
      /** Prefix to fetch only part of the volume */
      prefix?: string;
    }
    /** AI Solutions Data Sync */
    export interface DataSync {
      /** Data Sync creation date */
      createdAt: string;
      /** Data Sync Id */
      id: string;
      /** Data Sync specifications */
      spec: ai.volume.DataSyncSpec;
      /** Data Sync status */
      status: ai.volume.DataSyncStatus;
      /** Data Sync update date */
      updatedAt: string;
    }
    /** Data Sync Direction */
    export enum DataSyncEnum {
      'pull' = 'pull',
      'push' = 'push',
    }
    /** State of the progress sync */
    export enum DataSyncProgressStateEnum {
      'DONE' = 'DONE',
      'ERROR' = 'ERROR',
      'FAILED' = 'FAILED',
      'INTERRUPTED' = 'INTERRUPTED',
      'QUEUED' = 'QUEUED',
      'RUNNING' = 'RUNNING',
    }
    /** AI Solutions Data Sync Spec */
    export interface DataSyncSpec {
      /** Direction of the sync */
      direction: ai.volume.DataSyncEnum;
      /** True if the user has created the object */
      manual: boolean;
      /** Only sync this volume */
      volume?: string;
    }
    /** State of the data sync */
    export enum DataSyncStateEnum {
      'DONE' = 'DONE',
      'ERROR' = 'ERROR',
      'FAILED' = 'FAILED',
      'INTERRUPTED' = 'INTERRUPTED',
      'QUEUED' = 'QUEUED',
      'RUNNING' = 'RUNNING',
    }
    /** AI Solutions Data Sync Status */
    export interface DataSyncStatus {
      /** Date when the data sync ended */
      endedAt?: string;
      /** Information about the data sync */
      info: ai.Info;
      /** Progress status of the data sync */
      progress: ai.volume.Progress[];
      /** Date when the data sync was queued */
      queuedAt: string;
      /** Date when the data sync was started */
      startedAt?: string;
      /** State of the data sync */
      state: ai.volume.DataSyncStateEnum;
    }
    /** AI Solutions private Swift container Volume Object. Deprecated: Use DataStore instead */
    export interface PrivateSwift {
      /** Name of the tar archive that needs to be saved */
      archive?: string;
      /** Public Cloud Storage container to attach */
      container: string;
      /** True if data is stored on OVHcloud AI's internal storage */
      internal?: boolean;
      /** Prefix to fetch only part of the volume */
      prefix?: string;
      /** Public Cloud Storage Region */
      region: string;
    }
    /** AI Solutions Progress Object */
    export interface Progress {
      /** Number of completed files */
      completed: number;
      /** Progress creation date */
      createdAt: string;
      /** Number of deleted files */
      deleted: number;
      /** Direction of the progress sync */
      direction: ai.volume.DataSyncEnum;
      /** ETA to finish in seconds. Deprecated */
      eta?: number;
      /** Number of failed files */
      failed: number;
      /** Progress Id */
      id: string;
      /** Volume information */
      info: string;
      /** Number of processed files */
      processed: number;
      /** Number of skipped files */
      skipped: number;
      /** State of the progress sync */
      state: ai.volume.DataSyncProgressStateEnum;
      /** Total number of files */
      total: number;
      /** Transferred size in bytes */
      transferredBytes: number;
      /** Progress update date */
      updatedAt: string;
    }
    /** AI Solutions public Git repository Volume Object */
    export interface PublicGit {
      /** URL of the public git repository */
      url: string;
    }
    /** AI Solutions public Swift container Volume Object */
    export interface PublicSwift {
      /** URL of the public swift container */
      url: string;
    }
    /** AI Solutions No Source Volume Object */
    export interface Standalone {
      /** Name of the volume */
      name?: string;
    }
    /** AI Solutions Volume Object */
    export interface Volume {
      /** Enable/disable volume caching */
      cache: boolean;
      /** Public Cloud Storage container to attach */
      container?: string;
      /** Volume details for data store containers */
      dataStore?: ai.volume.DataStore;
      /** Volume Id. Deprecated: moved to status.volumes[] */
      id?: string;
      /** Path where to mount the data inside the container */
      mountPath: string;
      /** Permissions to use on the mounted volume */
      permission: ai.VolumePermissionEnum;
      /** Prefix to fetch only part of the volume */
      prefix?: string;
      /** Volume details for private swift containers. Deprecated: Use dataStore instead */
      privateSwift?: ai.volume.PrivateSwift;
      /** Volume details for public git repositories */
      publicGit?: ai.volume.PublicGit;
      /** Volume details for public swift containers */
      publicSwift?: ai.volume.PublicSwift;
      /** Public Cloud Storage Region */
      region?: string;
      /** Volume details for volumes that do not have a datasource */
      standalone?: ai.volume.Standalone;
      /** Target volume details for data store containers */
      targetDataStore?: ai.volume.DataStore;
      /** Target volume details for private swift containers. Deprecated: Use targetDataStore instead */
      targetPrivateSwift?: ai.volume.PrivateSwift;
    }
    /** AI Solutions Volume Object */
    export interface VolumeStatus {
      /** Volume Id */
      id: string;
      /** Path where the data is mounted inside the container */
      mountPath: string;
      /** User volume Id */
      userVolumeId: string;
    }
  } /** Authorization status */
  export interface AuthorizationStatus {
    /** True if project is authorized to use AI Solutions Platform */
    authorized: boolean;
  }
  /** AI Solutions basic auth credentials input */
  export interface BasicAuthCredentialsInput {
    /** Basic Auth Password */
    password: string;
    /** Basic Auth Username */
    username: string;
  }
  /** AI Solutions CLI command */
  export interface Command {
    /** AI Solutions CLI command */
    command: string;
  }
  /** AI Solutions data store container Volume Object */
  export interface DataStore {
    /** Data store alias */
    alias: string;
    /** Data store endpoint URL */
    endpoint: string;
    /** Owner type of the datastore */
    owner: ai.DataStoreOwnerEnum;
    /** Type of the datastore */
    type: ai.DataStoreTypeEnum;
  }
  /** AI Solutions data store auth */
  export interface DataStoreAuth {
    /** Access key to the datastore */
    accessKey?: string;
    /** Region of the datastore */
    region?: string;
    /** S3 Url of the datastore */
    s3Url?: string;
    /** Secret key to the datastore */
    secretKey?: string;
    /** Swift (or S3) Auth token */
    token?: string;
    /** Swift storage URL */
    url?: string;
  }
  /** AI Solutions data store credentials Object */
  export interface DataStoreCredentialsInput {
    /** Git data store credentials */
    git?: ai.GitCredentialsInput;
    /** S3 data store credentials */
    s3?: ai.S3CredentialsInput;
  }
  /** AI Solutions data store container Volume Object */
  export interface DataStoreInput {
    /** Data store alias */
    alias: string;
    /** Data store credentials */
    credentials: ai.DataStoreCredentialsInput;
    /** Datastore endpoint */
    endpoint: string;
    /** Data store owner */
    owner: ai.DataStoreOwnerEnum;
    /** Data store prefix */
    prefix?: string;
    /** Data store type */
    type: ai.DataStoreTypeEnum;
  }
  /** Data Store Owner */
  export enum DataStoreOwnerEnum {
    'customer' = 'customer',
    'ovhcloud' = 'ovhcloud',
  }
  /** Data Store Type */
  export enum DataStoreTypeEnum {
    'git' = 'git',
    's3' = 's3',
    'swift' = 'swift',
  }
  /** Basic model with a single message field */
  export interface GenericResponse {
    /** message */
    message: string;
  }
  /** AI Solutions data store git credentials input */
  export interface GitCredentialsInput {
    /** Basic Auth data store credentials */
    basicAuth?: ai.BasicAuthCredentialsInput;
    /** SSH data store credentials */
    sshKeypair?: ai.SshCredentialsInput;
  }
  /** Information about the state of this entity */
  export interface Info {
    /** Info code identifier */
    code: ai.InfoCodeEnum;
    /** Formatted message */
    message: string;
  }
  /** Code enum for Info object */
  export enum InfoCodeEnum {
    'APP_CREATE_ERROR' = 'APP_CREATE_ERROR',
    'APP_ERROR' = 'APP_ERROR',
    'APP_FAILED' = 'APP_FAILED',
    'APP_INITIALIZING' = 'APP_INITIALIZING',
    'APP_INTERRUPTED_BY_PLATFORM' = 'APP_INTERRUPTED_BY_PLATFORM',
    'APP_QUEUED' = 'APP_QUEUED',
    'APP_RUNNING' = 'APP_RUNNING',
    'APP_SCALING' = 'APP_SCALING',
    'APP_STOPPED' = 'APP_STOPPED',
    'APP_STOPPING' = 'APP_STOPPING',
    'COMPATIBILITY' = 'COMPATIBILITY',
    'DATASYNC_AUTHENTICATE_FAILED' = 'DATASYNC_AUTHENTICATE_FAILED',
    'DATASYNC_DATA_STORE_NOT_FOUND' = 'DATASYNC_DATA_STORE_NOT_FOUND',
    'DATASYNC_DONE' = 'DATASYNC_DONE',
    'DATASYNC_ERROR' = 'DATASYNC_ERROR',
    'DATASYNC_FAILED' = 'DATASYNC_FAILED',
    'DATASYNC_INTERRUPTED' = 'DATASYNC_INTERRUPTED',
    'DATASYNC_INVALID_CONTAINER' = 'DATASYNC_INVALID_CONTAINER',
    'DATASYNC_QUEUED' = 'DATASYNC_QUEUED',
    'DATASYNC_RETRY_ERROR' = 'DATASYNC_RETRY_ERROR',
    'DATASYNC_RUNNING' = 'DATASYNC_RUNNING',
    'JOB_CREATE_CONTAINER_CONFIG_ERROR' = 'JOB_CREATE_CONTAINER_CONFIG_ERROR',
    'JOB_CREATE_CONTAINER_ERROR' = 'JOB_CREATE_CONTAINER_ERROR',
    'JOB_DONE' = 'JOB_DONE',
    'JOB_ERROR' = 'JOB_ERROR',
    'JOB_EVICTED' = 'JOB_EVICTED',
    'JOB_FAILED' = 'JOB_FAILED',
    'JOB_FAILED_WITH_MESSAGE' = 'JOB_FAILED_WITH_MESSAGE',
    'JOB_FINALIZING' = 'JOB_FINALIZING',
    'JOB_IMAGE_INSPECT_ERROR' = 'JOB_IMAGE_INSPECT_ERROR',
    'JOB_IMAGE_PULL' = 'JOB_IMAGE_PULL',
    'JOB_IMAGE_PULL_BACKOFF' = 'JOB_IMAGE_PULL_BACKOFF',
    'JOB_INITIALIZING' = 'JOB_INITIALIZING',
    'JOB_INTERRUPTED' = 'JOB_INTERRUPTED',
    'JOB_INTERRUPTED_BY_PLATFORM' = 'JOB_INTERRUPTED_BY_PLATFORM',
    'JOB_INTERRUPTING' = 'JOB_INTERRUPTING',
    'JOB_INVALID_IMAGE_NAME' = 'JOB_INVALID_IMAGE_NAME',
    'JOB_PENDING' = 'JOB_PENDING',
    'JOB_QUEUED' = 'JOB_QUEUED',
    'JOB_REGISTRY_UNAVAILABLE' = 'JOB_REGISTRY_UNAVAILABLE',
    'JOB_RUNNING' = 'JOB_RUNNING',
    'JOB_SYNC_FAILED' = 'JOB_SYNC_FAILED',
    'JOB_TIMEOUT' = 'JOB_TIMEOUT',
    'NOTEBOOK_FAILED' = 'NOTEBOOK_FAILED',
    'NOTEBOOK_FAILED_WITH_MESSAGE' = 'NOTEBOOK_FAILED_WITH_MESSAGE',
    'NOTEBOOK_FINALIZING' = 'NOTEBOOK_FINALIZING',
    'NOTEBOOK_INITIALIZING' = 'NOTEBOOK_INITIALIZING',
    'NOTEBOOK_PENDING' = 'NOTEBOOK_PENDING',
    'NOTEBOOK_RUNNING' = 'NOTEBOOK_RUNNING',
    'NOTEBOOK_STARTING' = 'NOTEBOOK_STARTING',
    'NOTEBOOK_STOPPED' = 'NOTEBOOK_STOPPED',
    'NOTEBOOK_STOPPING' = 'NOTEBOOK_STOPPING',
    'NOTEBOOK_SYNC_FAILED' = 'NOTEBOOK_SYNC_FAILED',
  }
  /** AI Solutions Label Object */
  export interface Label {
    /** Name of the label to update/add */
    name: string;
    /** Value of the label to update/add, is there is no value the label is deleted */
    value?: string;
  }
  /** Log line */
  export interface LogLine {
    /** Content of the log */
    content?: string;
    /** Datetime of the log */
    timestamp?: Date;
  }
  /** Instance Logs */
  export interface Logs {
    /** Last activity date */
    lastActivity?: string;
    /** Logs lines */
    logs: ai.LogLine[];
  }
  /** Possible value to order result */
  export enum OrderEnum {
    'asc' = 'asc',
    'desc' = 'desc',
  }
  /** AI Solutions Resource Object */
  export interface Resources {
    /** Number of vCPU resources requested */
    cpu: number;
    /** The amount of ephemeral storage in bytes */
    ephemeralStorage: number;
    /** Current instance flavor */
    flavor: string;
    /** Number of GPU resources requested */
    gpu: number;
    /** The GPU Brand */
    gpuBrand?: string;
    /** The GPU Memory in bits */
    gpuMemory?: number;
    /** The GPU Model */
    gpuModel?: string;
    /** The amount of memory in bytes */
    memory: number;
    /** The guarantee private bandwidth in bytes per seconds */
    privateNetwork: number;
    /** The guarantee public bandwidth in bytes per seconds */
    publicNetwork: number;
  }
  /** AI Solutions Resource Object */
  export interface ResourcesInput {
    /** Number of vCPU resources requested */
    cpu?: number;
    /** The amount of ephemeral storage in bytes */
    ephemeralStorage?: number;
    /** Instance flavor */
    flavor?: string;
    /** Number of GPU resources requested */
    gpu?: number;
    /** The GPU Brand */
    gpuBrand?: string;
    /** The GPU Memory in bytes */
    gpuMemory?: number;
    /** The GPU Model */
    gpuModel?: string;
    /** The amount of memory in bytes */
    memory?: number;
    /** The private network bandwidth in bits per seconds */
    privateNetwork?: number;
    /** The public network bandwidth in bits per seconds */
    publicNetwork?: number;
  }
  /** AI Solutions S3 credentials */
  export interface S3CredentialsInput {
    /** S3 Access Key */
    accessKey: string;
    /** S3 Region */
    region: string;
    /** S3 Private Key */
    secretKey: string;
  }
  /** Shutdown strategy of an instance */
  export enum ShutdownStrategyEnum {
    'Stop' = 'Stop',
  }
  /** AI Solutions SSH credentials input */
  export interface SshCredentialsInput {
    /** SSH private key */
    privateKey: string;
    /** SSH public key */
    publicKey: string;
  }
  /** Role granted with an application token */
  export enum TokenRoleEnum {
    'ai_training_operator' = 'ai_training_operator',
    'ai_training_read' = 'ai_training_read',
  }
  /** Permissions to apply on a volume */
  export enum VolumePermissionEnum {
    'RO' = 'RO',
    'RW' = 'RW',
    'RWD' = 'RWD',
  }
}
