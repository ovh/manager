/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-namespace */
export namespace database {
  export namespace availability {
    export namespace specifications {
      /** Specifications of the nodes for availabilities of databases engines on cloud projects */
      export interface Nodes {
        /** Maximum number of nodes of the availability */
        maximum: number;
        /** Minimum number of nodes of the availability */
        minimum: number;
      }
      /** Specifications of the storage for availabilities of databases engines on cloud projects */
      export interface Storage {
        /** Maximum storage of the availability */
        maximum: {
          unit: string;
          value: number;
        };
        /** Minimum storage of the availability */
        minimum: {
          unit: string;
          value: number;
        };
        /** Memory step that can be added between minimum and maximum */
        step?: {
          unit: string;
          value: number;
        };
      }
    }
    /** Possible action to restrict availabilities */
    export enum ActionEnum {
      'fork' = 'fork',
      'update' = 'update',
    }
    /** Backups availability of databases engines on cloud projects */
    export interface Backups {
      /** Defines whether the backups are available for this offer */
      available: boolean;
      /** Number of retention days for the backups */
      retentionDays?: number;
    }
    /** Availability of databases engines on cloud projects */
    export interface Lifecycle {
      /** End of life of the product */
      endOfLife?: string;
      /** End of sale of the product */
      endOfSale?: string;
      /** Date of the release of the product */
      startDate: string;
      /** Status of the availability */
      status: database.availability.StatusEnum;
    }
    /** Specifications of the availability of databases engines on cloud projects */
    export interface Specifications {
      /** Flavor name */
      flavor: string;
      /** Type of network */
      network: database.NetworkTypeEnum;
      /** Specification of the nodes */
      nodes: database.availability.specifications.Nodes;
      /** Specification of the storage */
      storage?: database.availability.specifications.Storage;
    }
    /** Possible status for the availability */
    export enum StatusEnum {
      'BETA' = 'BETA',
      'DEPRECATED' = 'DEPRECATED',
      'END_OF_LIFE' = 'END_OF_LIFE',
      'END_OF_SALE' = 'END_OF_SALE',
      'STABLE' = 'STABLE',
      'UNAVAILABLE' = 'UNAVAILABLE',
    }
  }
  /** Possible target to restrict availabilities */
  export enum TargetEnum {
    'flavor' = 'flavor',
    'plan' = 'plan',
    'version' = 'version',
  }
  export namespace backup {
    /** Cloud database backup region definition */
    export interface Region {
      /** Name of the region where the backup is stored */
      name: string;
    }
  }
  export namespace capabilities {
    export namespace advancedConfiguration {
      export namespace property {
        /** Possible type of the advanced configuration properties */
        export enum TypeEnum {
          'boolean' = 'boolean',
          'double' = 'double',
          'long' = 'long',
          'string' = 'string',
        }
      } /** Specific database engine capability */
      export interface Property {
        /** Description of the property */
        description: string;
        /** Maximum value for the property if numeric and applicable */
        maximum?: number;
        /** Minimum value for the property if numeric and applicable */
        minimum?: number;
        /** Property name */
        name: string;
        /** Data type of the property */
        type: database.capabilities.advancedConfiguration.property.TypeEnum;
        /** Possible values for the property if string and applicable */
        values?: string[];
      }
    }
    export namespace engine {
      export namespace storage {
        /** Possible storage strategy for an engine */
        export enum StrategyEnum {
          'distributed' = 'distributed',
          'n/a' = 'n/a',
          'replicated' = 'replicated',
        }
      }
    }
    export namespace flavor {
      /** Cloud Database flavor specifications definition */
      export interface Specifications {
        /** Flavor core number */
        core: number;
        /** Flavor ram size */
        memory: {
          unit: string;
          value: number;
        };
        /** Flavor disk size */
        storage: {
          unit: string;
          value: number;
        };
      }
    }
    export namespace integration {
      export namespace parameter {
        /** Possible type of an integration capability parameter */
        export enum TypeEnum {
          'integer' = 'integer',
          'string' = 'string',
        }
      } /** Integration capability parameter */
      export interface Parameter {
        /** Name of the integration parameter */
        name: string;
        /** Type of the integration parameter */
        type: database.capabilities.integration.parameter.TypeEnum;
      }
    } /** Specific database engine capability */
    export interface Engine {
      /** Category of the engine */
      category: CategoryEnum;
      /** Default version used for the engine */
      defaultVersion: string;
      /** Description of the engine */
      description: string;
      /** Engine name */
      name: string;
      /** SSL modes for this engine */
      sslModes: string[];
      /** Storage strategy of the engine */
      storage: database.capabilities.engine.storage.StrategyEnum;
      /** Versions available for this engine */
      versions: string[];
    }
    /** Cloud Database flavor definition */
    export interface Flavor {
      /** Flavor core number. @deprecated: use specifications.core */
      core: number;
      /** Defines the lifecycle of the flavor */
      lifecycle: availability.Lifecycle;
      /** Flavor ram size in GB. @deprecated: use specifications.memory */
      memory: number;
      /** Name of the flavor */
      name: string;
      /** Display order */
      order: number;
      /** Technical specifications of the flavor */
      specifications: database.capabilities.flavor.Specifications;
      /** Flavor disk size in GB. @deprecated: use specifications.storage */
      storage: number;
      /** Display tags */
      tags: string[];
    }
    /** Integration capability between database engines */
    export interface Integration {
      /** Destination engine for the integration */
      destinationEngine: database.EngineEnum;
      /** Parameters for the integration capability */
      parameters?: database.capabilities.integration.Parameter[];
      /** Source engine for the integration */
      sourceEngine: database.EngineEnum;
      /** Type of the integration */
      type: database.service.integration.TypeEnum;
    }
    /** Cloud Database option definition */
    export interface Option {
      /** Name of the option */
      name: string;
      /** Type of the option */
      type: database.TypeEnum;
    }
    /** Cloud Database plan definition */
    export interface Plan {
      /** Automatic backup retention duration */
      backupRetention: string;
      /** Description of the plan */
      description: string;
      /** Defines the lifecycle of the availability */
      lifecycle: availability.Lifecycle;
      /** Name of the plan */
      name: string;
      /** Display order */
      order: number;
      /** Display tags */
      tags: string[];
    }
  }
  export namespace kafka {
    export namespace user {
      /** Cloud databases kafka user access definition */
      export interface Access {
        /** User cert */
        cert: string;
        /** User key for the cert */
        key: string;
      }
    } /** Cloud databases kafka permissions definition */
    export interface Permissions {
      /** Names of the topic permissions (@deprecated) */
      names: string[];
      /** Names of the schema registry permissions */
      schemaRegistry: string[];
      /** Names of the topic permissions */
      topic: string[];
    }
    /** Cloud databases kafka schema registry acl definition */
    export interface SchemaRegistryAcl {
      /** Acl ID */
      id: string;
      /** Permission to give to this username on this resource. Permissions values can be retrieved using /cloud/project/{serviceName}/database/kafka/{clusterId}/permissions */
      permission: string;
      /** Resource affected by this acl */
      resource: string;
      /** Username affected by this acl */
      username: string;
    }
    /** Cloud database kafka service definition */
    export interface Service {
      /** Time on which backups start every day */
      backupTime: string;
      /** Capabilities of the services */
      capabilities: Record<service.CapabilityEnum, service.CapabilityActions>;
      /** Category of the engine */
      category: CategoryEnum;
      /** Date of the creation of the cluster */
      createdAt: string;
      /** Description of the cluster */
      description: string;
      /** Disk attributes of the cluster. @deprecated: use storage */
      disk: database.service.Disk;
      /** List of all endpoints of the service */
      endpoints: database.service.Endpoint[];
      /** Name of the engine of the service */
      engine: database.EngineEnum;
      /** The VM flavor used for this cluster */
      flavor: string;
      /** Service ID */
      id: string;
      /** IP Blocks authorized to access to the cluster */
      ipRestrictions: database.service.IpRestriction[];
      /** Time on which maintenances can start every day */
      maintenanceTime: string;
      /** Private network ID in which the cluster is */
      networkId?: string;
      /** Type of network of the cluster */
      networkType: database.NetworkTypeEnum;
      /** Number of nodes in the cluster. @deprecated: useNodes */
      nodeNumber: number;
      /** Nodes of the cluster */
      nodes: database.service.Node[];
      /** Plan of the cluster */
      plan: string;
      /** Defines whether the REST API is enabled on the cluster */
      restApi: boolean;
      /** Defines whether the schema registry is enabled on the cluster */
      schemaRegistry: boolean;
      /** Current status of the cluster */
      status: database.StatusEnum;
      /** Storage attributes of the cluster */
      storage?: database.service.Storage;
      /** Private subnet ID in which the cluster is */
      subnetId?: string;
      /** Version of the engine deployed on the cluster */
      version: string;
    }
    /** Cloud database kafka topic definition */
    export interface Topic {
      /** Topic ID */
      id: string;
      /** Minimum insync replica accepted for this topic */
      minInsyncReplicas: number;
      /** Name of the topic */
      name: string;
      /** Number of partitions for this topic */
      partitions: number;
      /** Number of replication for this topic */
      replication: number;
      /** Number of bytes for the retention of the data for this topic */
      retentionBytes: number;
      /** Number of hours for the retention of the data for this topic */
      retentionHours: number;
    }
    /** Cloud databases kafka topic acl definition */
    export interface TopicAcl {
      /** Acl ID */
      id: string;
      /** Permission to give to this username on this topic. Permissions values can be retrieved using /cloud/project/{serviceName}/database/kafka/{clusterId}/permissions */
      permission: string;
      /** Topic affected by this acl */
      topic: string;
      /** Username affected by this acl */
      username: string;
    }
    /** Cloud database kafka topic creation definition */
    export interface TopicCreation {
      /** Topic ID */
      id: string;
      /** Minimum insync replica accepted for this topic */
      minInsyncReplicas: number;
      /** Name of the topic */
      name: string;
      /** Number of partitions for this topic */
      partitions: number;
      /** Number of replication for this topic */
      replication: number;
      /** Number of bytes for the retention of the data for this topic */
      retentionBytes: number;
      /** Number of hours for the retention of the data for this topic */
      retentionHours: number;
    }
  }
  export namespace kafkaConnect {
    export namespace capabilities {
      export namespace connector {
        export namespace configuration {
          /** KafkaConnect connector config property definition */
          export interface Property {
            /** Defines the default value is exists */
            defaultValue?: string;
            /** Description of the property */
            description: string;
            /** Pretty name of the property */
            displayName: string;
            /** Group to which belongs the property */
            group: string;
            /** Importance of the property */
            importance: database.kafkaConnect.capabilities.connector.property.ImportanceEnum;
            /** Name of the property */
            name: string;
            /** Defines whether the property is required */
            required: boolean;
            /** Type of data of the property */
            type: database.kafkaConnect.connector.property.TypeEnum;
            /** Possible values for the property if string and applicable */
            values?: string[];
          }
        }
        export namespace property {
          /** Possible importance for the kafka connectors properties */
          export enum ImportanceEnum {
            'high' = 'high',
            'low' = 'low',
            'medium' = 'medium',
          }
        } /** KafkaConnect connector transform definition */
        export interface Transform {
          /** Description of the transform */
          description: string;
          /** Pretty name of the transform */
          displayName: string;
          /** Name of the transform */
          name: string;
          /** Defines whether the transform is required */
          required: boolean;
          /** Transform type this transform relates to */
          transformType: string;
          /** Type of data of the transform */
          type: database.kafkaConnect.connector.property.TypeEnum;
          /** Possible values for the transform if applicable */
          values?: string[];
        }
        /** Possible types for the kafka connectors */
        export enum TypeEnum {
          'sink' = 'sink',
          'source' = 'source',
        }
      } /** KafkaConnect connector capability definition */
      export interface Connector {
        /** Name of the connector's author */
        author: string;
        /** URL of the official documentation of the connector */
        documentationUrl: string;
        /** Connector ID */
        id: string;
        /** Defines whether this connector and version is the latest available */
        latest: boolean;
        /** Name of the connector */
        name: string;
        /** Defines whether the connector is in preview */
        preview: boolean;
        /** Type of connector */
        type: database.kafkaConnect.capabilities.connector.TypeEnum;
        /** Version of the connector */
        version: string;
      }
    }
    export namespace connector {
      export namespace property {
        /** Possible types for the kafka connectors properties */
        export enum TypeEnum {
          'boolean' = 'boolean',
          'class' = 'class',
          'double' = 'double',
          'int16' = 'int16',
          'int32' = 'int32',
          'int64' = 'int64',
          'list' = 'list',
          'password' = 'password',
          'string' = 'string',
          'transform' = 'transform',
        }
      }
      export namespace task {
        /** Possible state of connector task */
        export enum StatusEnum {
          'FAILED' = 'FAILED',
          'PAUSED' = 'PAUSED',
          'RUNNING' = 'RUNNING',
        }
      } /** Possible state of connector */
      export enum StatusEnum {
        'CREATING' = 'CREATING',
        'FAILED' = 'FAILED',
        'PAUSED' = 'PAUSED',
        'RUNNING' = 'RUNNING',
        'UNASSIGNED' = 'UNASSIGNED',
      }
      /** KafkaConnect connector definition */
      export interface Task {
        /** Task ID */
        id: number;
        /** Status of the task */
        status: database.kafkaConnect.connector.task.StatusEnum;
        /** Trace of the task */
        trace: string;
      }
    } /** KafkaConnect connector definition */
    export interface Connector {
      /** Configuration of the connector */
      configuration: Record<string, string>;
      /** Connector capability ID */
      connectorId: string;
      /** Connector ID */
      id: string;
      /** Name of the connector */
      name: string;
      /** Status of the connector */
      status: database.kafkaConnect.connector.StatusEnum;
    }
    /** KafkaConnect connector definition */
    export interface ConnectorCreation {
      /** Configuration of the connector */
      configuration: Record<string, string>;
      /** Connector capability ID */
      connectorId: string;
      /** Name of the connector */
      name: string;
    }
  }
  export namespace m3db {
    export namespace namespace {
      /** M3db namespace retention definition */
      export interface Retention {
        /** Controls how long we wait before expiring stale data */
        blockDataExpirationDuration?: string;
        /** Controls how long to keep a block in memory before flushing to a fileset on disk */
        blockSizeDuration?: string;
        /** Controls how far into the future writes to the namespace will be accepted */
        bufferFutureDuration?: string;
        /** Controls how far into the past writes to the namespace will be accepted */
        bufferPastDuration?: string;
        /** Controls the duration of time that M3DB will retain data for the namespace */
        periodDuration: string;
      }
      /** Possible type of the service integration */
      export enum TypeEnum {
        'aggregated' = 'aggregated',
        'unaggregated' = 'unaggregated',
      }
    } /** M3db Namespace definition */
    export interface Namespace {
      /** Namespace ID */
      id: string;
      /** Name of the namespace */
      name: string;
      /** Resolution for an aggregated namespace */
      resolution?: string;
      /** Retention configuration */
      retention: database.m3db.namespace.Retention;
      /** Defines whether M3db will create snapshot files for this namespace */
      snapshotEnabled: boolean;
      /** Type of namespace */
      type: database.m3db.namespace.TypeEnum;
      /** Defines whether M3db will include writes to this namespace in the commit log */
      writesToCommitLogEnabled: boolean;
    }
    /** M3db Namespace creation definition */
    export interface NamespaceCreation {
      /** Namespace ID */
      id: string;
      /** Name of the namespace */
      name: string;
      /** Resolution for an aggregated namespace */
      resolution: string;
      /** Retention configuration */
      retention: database.m3db.namespace.Retention;
      /** Defines whether M3db will create snapshot files for this namespace */
      snapshotEnabled: boolean;
      /** Type of namespace */
      type: database.m3db.namespace.TypeEnum;
      /** Defines whether M3db will include writes to this namespace in the commit log */
      writesToCommitLogEnabled: boolean;
    }
    /** M3db User definition */
    export interface User {
      /** Date of the creation of the user */
      createdAt: string;
      /** Group of the user */
      group: string;
      /** User ID */
      id: string;
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
    /** User creation definition */
    export interface UserCreation {
      /** Group of the user */
      group: string;
      /** Name of the user */
      name: string;
    }
    /** M3db User definition */
    export interface UserWithPassword {
      /** Date of the creation of the user */
      createdAt: string;
      /** Group of the user */
      group: string;
      /** User ID */
      id: string;
      /** Password of the user */
      password: string;
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
  }
  export namespace mysql {
    export namespace querystatistics {
      /** Cloud database mysql single query statistic definition */
      export interface Query {
        /** Average wait time of the summarized timed events, in milliseconds */
        avgTimerWait: number;
        /** Number of summarized events. This value includes all events, whether timed or nontimed */
        countStar: number;
        /** Digest of the summarized events */
        digest: string;
        /** Text of the summarized digest events */
        digestText: string;
        /** First appearance of the events */
        firstSeen: string;
        /** Last appearance of the events */
        lastSeen: string;
        /** Maximum wait time of the summarized timed events, in milliseconds */
        maxTimerWait: number;
        /** Mininum wait time of the summarized timed events, in milliseconds */
        minTimerWait: number;
        /** 95th percentile of the statement latency, in picoseconds */
        quantile95: number;
        /** 99th percentile of the statement latency, in picoseconds */
        quantile99: number;
        /** 99.9th percentile of the statement latency, in picoseconds */
        quantile999: number;
        /** Datetime when the querySampleText column was seen */
        querySampleSeen: string;
        /** Sample SQL statement that produces the digest value in the row */
        querySampleText: string;
        /** Wait time for the sample statement in the querySampleText column, in milliseconds */
        querySampleTimerWait: number;
        /** SchemaName of the summarized events */
        schemaName: string;
        /** Number of internal on-disk temporary tables created */
        sumCreatedTmpDiskTables: number;
        /** Number of internal temporary tables created */
        sumCreatedTmpTables: number;
        /** Number of errors */
        sumErrors: number;
        /** Sum of lock time of the summarized timed events, in milliseconds */
        sumLockTime: number;
        /** Sum of not good indexes of the summarized timed events */
        sumNoGoodIndexUsed: number;
        /** Sum of no indexes of the summarized timed events */
        sumNoIndexUsed: number;
        /** Sum of rows affected of the summarized timed events */
        sumRowsAffected: number;
        /** Sum of rows examined of the summarized timed events */
        sumRowsExamined: number;
        /** Sum of rows sent of the summarized timed events */
        sumRowsSent: number;
        /** Sum of select full join of the summarized timed events */
        sumSelectFullJoin: number;
        /** Sum of select full range join of the summarized timed events */
        sumSelectFullRangeJoin: number;
        /** Sum of select range of the summarized timed events */
        sumSelectRange: number;
        /** Sum of select range check of the summarized timed events */
        sumSelectRangeCheck: number;
        /** Sum of select scan of the summarized timed events */
        sumSelectScan: number;
        /** Sum of sorted merge passes of the summarized timed events */
        sumSortMergePasses: number;
        /** Sum of sorted range of the summarized timed events */
        sumSortRange: number;
        /** Sum of sorted rows of the summarized timed events */
        sumSortRows: number;
        /** Sum of sort scan of the summarized timed events */
        sumSortScan: number;
        /** Sum of wait time of the summarized timed events, in milliseconds */
        sumTimerWait: number;
        /** Number of warnings */
        sumWarnings: number;
      }
    } /** Cloud database mysql query statistics response body definition */
    export interface QueryStatistics {
      /** Statistics of the queries */
      queries: database.mysql.querystatistics.Query[];
    }
  }
  export namespace opensearch {
    /** Cloud database opensearch index definition */
    export interface Index {
      /** Date of the creation of the index */
      createdAt: string;
      /** Number of documents hold by the index */
      documents: number;
      /** Index ID */
      id: string;
      /** Name of the index */
      name: string;
      /** Number of replicas of the index */
      replicasNumber: number;
      /** Number of shards of the index */
      shardsNumber: number;
      /** Size of the index */
      size: number;
    }
    /** Cloud database opensearch pattern definition */
    export interface Pattern {
      /** Pattern ID */
      id: string;
      /** Maximum number of index for this pattern */
      maxIndexCount: number;
      /** Pattern format */
      pattern: string;
    }
    /** Cloud database opensearch permissions definition */
    export interface Permissions {
      /** Possible values for the permissions */
      names: string[];
    }
    /** Cloud database opensearch service definition */
    export interface Service {
      /** Defines whether the acls are enabled on the cluster */
      aclsEnabled: boolean;
      /** Time on which backups start every day. @deprecated: use backups.time */
      backupTime: string;
      /** Information related to the backups, null if the engine does not support backups */
      backups?: database.service.Backup;
      /** Capabilities of the services */
      capabilities: Record<service.CapabilityEnum, service.CapabilityActions>;
      /** Category of the engine */
      category: CategoryEnum;
      /** Date of the creation of the cluster */
      createdAt: string;
      /** Description of the cluster */
      description: string;
      /** Disk attributes of the cluster. @deprecated: use storage */
      disk: database.service.Disk;
      /** List of all endpoints of the service */
      endpoints: database.service.Endpoint[];
      /** Name of the engine of the service */
      engine: database.EngineEnum;
      /** The VM flavor used for this cluster */
      flavor: string;
      /** Service ID */
      id: string;
      /** IP Blocks authorized to access to the cluster */
      ipRestrictions: database.service.IpRestriction[];
      /** Time on which maintenances can start every day */
      maintenanceTime: string;
      /** Private network ID in which the cluster is */
      networkId?: string;
      /** Type of network of the cluster */
      networkType: database.NetworkTypeEnum;
      /** Number of nodes in the cluster. @deprecated: use nodes */
      nodeNumber: number;
      /** Nodes of the cluster */
      nodes: database.service.Node[];
      /** Plan of the cluster */
      plan: string;
      /** Current status of the cluster */
      status: database.StatusEnum;
      /** Storage attributes of the cluster */
      storage?: database.service.Storage;
      /** Private subnet ID in which the cluster is */
      subnetId?: string;
      /** Version of the engine deployed on the cluster */
      version: string;
    }
    /** Opensearch user definition */
    export interface User {
      /** Acls of the user */
      acls: database.opensearch.UserAcl[];
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
    /** Opensearch user acl definition */
    export interface UserAcl {
      /** Pattern of the ACL */
      pattern: string;
      /** Permission of the ACL */
      permission: string;
    }
    /** Opensearch user creation definition */
    export interface UserCreation {
      /** Acls of the user */
      acls: database.opensearch.UserAcl[];
      /** Name of the user */
      name: string;
    }
    /** Opensearch user definition */
    export interface UserWithPassword {
      /** Acls of the user */
      acls: database.opensearch.UserAcl[];
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Password of the user */
      password: string;
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
  }
  export namespace postgresql {
    export namespace connectionpool {
      /** Possible modes for the connection pools */
      export enum ModeEnum {
        'session' = 'session',
        'statement' = 'statement',
        'transaction' = 'transaction',
      }
      /** Possible ssl modes for the connection pools */
      export enum SslModeEnum {
        'require' = 'require',
      }
    }
    export namespace querystatistics {
      /** Cloud database postgresql single query statistic definition */
      export interface Query {
        /** Time spent reading data file blocks by backends in this database, in milliseconds */
        blkReadTime: number;
        /** Time spent writing data file blocks by backends in this database, in milliseconds */
        blkWriteTime: number;
        /** Number of times this function has been called */
        calls: number;
        /** Name of the database */
        databaseName: string;
        /** Total number of local blocks dirtied by the statement */
        localBlksDirtied: number;
        /** Total number of local block cache hits by the statement */
        localBlksHit: number;
        /** Total number of local blocks read by the statement */
        localBlksRead: number;
        /** Total number of local blocks written by the statement */
        localBlksWritten: number;
        /** Maximum time spent planning the statement, in milliseconds */
        maxPlanTime: number;
        /** Maximum time spent for the statement, in milliseconds */
        maxTime: number;
        /** Mean time spent planning the statement, in milliseconds */
        meanPlanTime: number;
        /** Mean time spent for the statement, in milliseconds */
        meanTime: number;
        /** Minimum time spent planning the statement, in milliseconds */
        minPlanTime: number;
        /** Minimum time spent for the statement, in milliseconds */
        minTime: number;
        /** Text of a representative statement */
        query: string;
        /** Total number of rows retrieved or affected by the statement */
        rows: number;
        /** Total number of shared blocks dirtied by the statement */
        sharedBlksDirtied: number;
        /** Total number of shared block cache hits by the statement */
        sharedBlksHit: number;
        /** Total number of shared blocks read by the statement */
        sharedBlksRead: number;
        /** Total number of shared blocks written by the statement */
        sharedBlksWritten: number;
        /** Population standard deviation of time spent planning the statement, in milliseconds */
        stddevPlanTime: number;
        /** Population standard deviation of time spent for the statement, in milliseconds */
        stddevTime: number;
        /** Total number of temp blocks read by the statement */
        tempBlksRead: number;
        /** Total number of temp blocks written by the statement */
        tempBlksWritten: number;
        /** Total time spent planning the statement, in milliseconds */
        totalPlanTime: number;
        /** Total time spent for the statement, in milliseconds */
        totalTime: number;
        /** Name of the user who executed the statement */
        username: string;
        /** Total amount of WAL generated by the statement in bytes */
        walBytes: {
          unit: string;
          value: number;
        };
        /** Total number of WAL full page images generated by the statement */
        walFpi: number;
        /** Total number of WAL records generated by the statement */
        walRecords: number;
      }
    } /** Cloud database postgresql connection pool response body definition */
    export interface ConnectionPool {
      /** Database used for the connection pool */
      databaseId: string;
      /** ID of the connection pool */
      id: string;
      /** Connection mode to the connection pool */
      mode: database.postgresql.connectionpool.ModeEnum;
      /** Name of the connection pool */
      name: string;
      /** Port of the connection pool */
      port: number;
      /** Size of the connection pool */
      size: number;
      /** Ssl connection mode for the pool */
      sslMode?: database.postgresql.connectionpool.SslModeEnum;
      /** Connection URI to the pool */
      uri: string;
      /** User authorized to connect to the pool, if none all the users are allowed */
      userId?: string;
    }
    /** Cloud database postgresql connection pool creation body definition */
    export interface ConnectionPoolCreation {
      /** Database used for the connection pool */
      databaseId: string;
      /** Connection mode to the connection pool */
      mode: database.postgresql.connectionpool.ModeEnum;
      /** Name of the connection pool */
      name: string;
      /** Size of the connection pool */
      size: number;
      /** User authorized to connect to the pool, if none all the users are allowed */
      userId?: string;
    }
    /** Cloud database postgresql query statistics response body definition */
    export interface QueryStatistics {
      /** Statistics of the queries */
      queries: database.postgresql.querystatistics.Query[];
    }
  }
  export namespace redis {
    /** Redis user definition */
    export interface User {
      /** Categories of the user */
      categories: string[];
      /** Channels of the user */
      channels: string[];
      /** Commands of the user */
      commands: string[];
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Keys of the user */
      keys: string[];
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
    /** Redis user definition */
    export interface UserCreation {
      /** Categories of the user */
      categories: string[];
      /** Channels of the user */
      channels: string[];
      /** Commands of the user */
      commands: string[];
      /** Keys of the user */
      keys: string[];
      /** Name of the user */
      name: string;
    }
    /** Redis user with password definition */
    export interface UserWithPassword {
      /** Categories of the user */
      categories: string[];
      /** Channels of the user */
      channels: string[];
      /** Commands of the user */
      commands: string[];
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Keys of the user */
      keys: string[];
      /** Password of the user */
      password: string;
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
  }
  export namespace service {
    export namespace capability {
      /** State of the service capability for the service */
      export enum StateEnum {
        'disabled' = 'disabled',
        'enabled' = 'enabled',
      }
    }
    export namespace creation {
      /** Defines the source to fork a cluster from a backup. @deprecated: use forkFrom */
      export interface BackupFork {
        /** Backup ID (not compatible with pointInTime) */
        id: string;
        /** Point in time to restore from (not compatible with id) */
        pointInTime: string;
        /** Service ID to which the backups belong to */
        serviceId: string;
      }
      /** Defines the source to fork a cluster from a backup */
      export interface ForkFrom {
        /** Backup ID (not compatible with pointInTime) */
        backupId: string;
        /** Point in time to restore from (not compatible with id) */
        pointInTime: string;
        /** Service ID to which the backups belong to */
        serviceId: string;
      }
    }
    export namespace currentqueries {
      export namespace query {
        /** Cloud database service current queries query cancel request */
        export interface CancelRequest {
          /** Database server connection ID */
          pid: number;
          /** Request immediate termination instead of soft cancel */
          terminate: boolean;
        }
        /** Cloud database service current queries query cancel response */
        export interface CancelResponse {
          /** Status reported by the database server */
          success: boolean;
        }
      } /** Cloud database service current queries query definition */
      export interface Query {
        /** Application name */
        applicationName: string;
        /** Backend start timestamp */
        backendStart?: string;
        /** Backend type */
        backendType?: string;
        /** XID for current backend */
        backendXid?: number;
        /** Xmin for current backend */
        backendXmin?: number;
        /** Client hostname */
        clientHostname?: string;
        /** Client ip address */
        clientIp?: string;
        /** Client port */
        clientPort?: number;
        /** Database ID */
        databaseId?: number;
        /** Database name */
        databaseName: string;
        /** Leader process ID */
        leaderPid?: number;
        /** Connection process ID */
        pid: number;
        /** Current query running on this connection */
        query: string;
        /** Duration of the query in seconds */
        queryDuration: number;
        /** Query start timestamp */
        queryStart?: string;
        /** Connection state */
        state: database.service.currentqueries.StateEnum;
        /** Connection state change timestamp */
        stateChange?: string;
        /** Transaction start timestamp */
        transactionStart?: string;
        /** User ID */
        userId?: number;
        /** User name */
        userName: string;
        /** Connection wait event */
        waitEvent?: string;
        /** Connection wait event type */
        waitEventType?: database.service.currentqueries.WaitEventTypeEnum;
      }
      /** Possible state of a query */
      export enum StateEnum {
        'ACTIVE' = 'ACTIVE',
        'DISABLED' = 'DISABLED',
        'FASTPATH_FUNCTION_CALL' = 'FASTPATH_FUNCTION_CALL',
        'IDLE' = 'IDLE',
        'IDLE_IN_TRANSACTION' = 'IDLE_IN_TRANSACTION',
        'IDLE_IN_TRANSACTION_ABORTED' = 'IDLE_IN_TRANSACTION_ABORTED',
      }
      /** Possible event type on which the backend is waiting */
      export enum WaitEventTypeEnum {
        'ACTIVITY' = 'ACTIVITY',
        'BUFFER_PIN' = 'BUFFER_PIN',
        'CLIENT' = 'CLIENT',
        'EXTENSION' = 'EXTENSION',
        'IO' = 'IO',
        'IPC' = 'IPC',
        'LOCK' = 'LOCK',
        'LWLOCK' = 'LWLOCK',
        'TIMEOUT' = 'TIMEOUT',
      }
    }
    export namespace endpoint {
      /** Defines all the values for the component in the service endpoints */
      export enum ComponentEnum {
        'cassandra' = 'cassandra',
        'grafana' = 'grafana',
        'graphite' = 'graphite',
        'influxdb' = 'influxdb',
        'kafka' = 'kafka',
        'kafkaConnect' = 'kafkaConnect',
        'kafkaRestApi' = 'kafkaRestApi',
        'kafkaSASL' = 'kafkaSASL',
        'kafkaSchemaRegistry' = 'kafkaSchemaRegistry',
        'kibana' = 'kibana',
        'm3coordinator' = 'm3coordinator',
        'mongodb' = 'mongodb',
        'mongodbAnalytics' = 'mongodbAnalytics',
        'mongodbSrv' = 'mongodbSrv',
        'mongodbSrvAnalytics' = 'mongodbSrvAnalytics',
        'mysql' = 'mysql',
        'mysqlRead' = 'mysqlRead',
        'mysqlx' = 'mysqlx',
        'opensearch' = 'opensearch',
        'postgresql' = 'postgresql',
        'postgresqlRead' = 'postgresqlRead',
        'postgresqlReadReplica' = 'postgresqlReadReplica',
        'prometheusRead' = 'prometheusRead',
        'prometheusWrite' = 'prometheusWrite',
        'redis' = 'redis',
      }
    }
    export namespace integration {
      /** Possible state of the integration */
      export enum StatusEnum {
        'READY' = 'READY',
      }
      /** Possible type of the service integration */
      export enum TypeEnum {
        'grafanaDashboard' = 'grafanaDashboard',
        'grafanaDatasource' = 'grafanaDatasource',
        'kafkaConnect' = 'kafkaConnect',
        'kafkaLogs' = 'kafkaLogs',
        'kafkaMirrorMaker' = 'kafkaMirrorMaker',
        'm3aggregator' = 'm3aggregator',
        'm3dbMetrics' = 'm3dbMetrics',
        'opensearchLogs' = 'opensearchLogs',
        'postgresqlMetrics' = 'postgresqlMetrics',
      }
    }
    export namespace maintenance {
      /** Possible status of a service maintenance */
      export enum StatusEnum {
        'APPLIED' = 'APPLIED',
        'APPLYING' = 'APPLYING',
        'ERROR' = 'ERROR',
        'PENDING' = 'PENDING',
        'SCHEDULED' = 'SCHEDULED',
      }
    }
    export namespace node {
      /** Node role values */
      export enum RoleEnum {
        'ANALYTICS' = 'ANALYTICS',
        'STANDARD' = 'STANDARD',
      }
    }
    export namespace replication {
      /** Possible type of the service integration */
      export enum PolicyClassEnum {
        'org.apache.kafka.connect.mirror.DefaultReplicationPolicy' = 'org.apache.kafka.connect.mirror.DefaultReplicationPolicy',
        'org.apache.kafka.connect.mirror.IdentityReplicationPolicy' = 'org.apache.kafka.connect.mirror.IdentityReplicationPolicy',
      }
    } /** Cloud database service backups definition */
    export interface Backup {
      /** Date until PITR is available */
      pitr?: string;
      /** Regions on which the backups are stored */
      regions: string[];
      /** Number of retention days for the backups */
      retentionDays?: number;
      /** Time on which backups start every day */
      time: string;
    }
    /** Cloud database service capability actions definition */
    export interface CapabilityActions {
      /** Defines if the capability can be created */
      create?: service.capability.StateEnum;
      /** Defines if the capability can be deleted */
      delete?: service.capability.StateEnum;
      /** Defines if the capability can be read */
      read?: service.capability.StateEnum;
      /** Defines if the capability can be updated */
      update?: service.capability.StateEnum;
    }
    /** List of capabilities available for services */
    export enum CapabilityEnum {
      'backups' = 'backups',
      'currentQueries' = 'currentQueries',
      'databases' = 'databases',
      'namespaces' = 'namespaces',
      'queryStatistics' = 'queryStatistics',
      'users' = 'users',
    }
    /** Certificates definition for cloud project databases */
    export interface Certificates {
      /** CA certificate used for the service */
      ca: string;
    }
    /** Cloud database current queries */
    export interface CurrentQueries {
      /** Current queries list */
      queries: database.service.currentqueries.Query[];
    }
    /** A single value from a metric */
    export interface DataPoint {
      /** Timestamp in seconds since epoch time */
      timestamp: number;
      /** Value of this datapoint */
      value: number;
    }
    /** Defines the database object in a cluster */
    export interface Database {
      /** Defines if the database has been created by default */
      default: boolean;
      /** Database ID */
      id: string;
      /** Database name */
      name: string;
    }
    /** Defines the disk attributes of a service */
    export interface Disk {
      /** Service disk size  */
      size: number;
      /** Service disk size  */
      type?: string;
    }
    /** Defines the endpoint object in a cluster */
    export interface Endpoint {
      /** Type of component the URI relates to */
      component: database.service.endpoint.ComponentEnum;
      /** Domain of the cluster */
      domain: string;
      /** Path of the endpoint */
      path?: string;
      /** Connection port for the endpoint */
      port?: number;
      /** Scheme used to generate the URI */
      scheme?: string;
      /** Defines whether the endpoint uses SSL */
      ssl: boolean;
      /** SSL mode used to connect to the service if the SSL is enabled */
      sslMode?: string;
      /** URI of the endpoint */
      uri?: string;
    }
    /** Metrics datapoints from a specific host */
    export interface HostMetric {
      /** List of metric's samples */
      dataPoints: database.service.DataPoint[];
      /** Name of the originating host */
      hostname: string;
    }
    /** Cloud database service integration definition */
    export interface Integration {
      /** ID of the destination service */
      destinationServiceId: string;
      /** Service ID */
      id: string;
      /** Parameters for the integration */
      parameters?: Record<string, string>;
      /** ID of the source service */
      sourceServiceId: string;
      /** Current status of the integration */
      status: database.service.integration.StatusEnum;
      /** Type of the integration */
      type: database.service.integration.TypeEnum;
    }
    /** Ip Restriction definition for cloud project databases */
    export interface IpRestriction {
      /** Description of the ip restriction */
      description: string;
      /** Whitelisted IP */
      ip: string;
      /** Current status of the ip restriction */
      status: database.StatusEnum;
    }
    /** A single log entry */
    export interface LogEntry {
      /** Host from which the log is coming from */
      hostname: string;
      /** The log message */
      message: string;
      /** Timestamp in seconds since epoch time */
      timestamp: number;
    }
    /** Cloud database service maintenance definition */
    export interface Maintenance {
      /** Date of the application of the maintenance */
      appliedAt?: string;
      /** Description of the maintenance */
      description: string;
      /** ID of the maintenance */
      id: string;
      /** Date of the planification of the maintenance */
      scheduledAt?: string;
      /** Status of the maintenance */
      status: database.service.maintenance.StatusEnum;
    }
    /** Metric definition for cloud project databases */
    export interface Metric {
      /** Metric values for each cluster's host */
      metrics: database.service.HostMetric[];
      /** Name of the metric */
      name: string;
      /** Unit of the metric */
      units: database.service.MetricUnitEnum;
    }
    /** Supported metrics query period */
    export enum MetricPeriodEnum {
      'lastHour' = 'lastHour',
      'lastDay' = 'lastDay',
      'lastWeek' = 'lastWeek',
      'lastMonth' = 'lastMonth',
      'lastYear' = 'lastYear',
    }
    /** Supported unit types for metrics */
    export enum MetricUnitEnum {
      'BYTES' = 'BYTES',
      'BYTES_PER_SECOND' = 'BYTES_PER_SECOND',
      'GIGABYTES' = 'GIGABYTES',
      'GIGABYTES_PER_HOUR' = 'GIGABYTES_PER_HOUR',
      'MEGABYTES' = 'MEGABYTES',
      'MEGABYTES_PER_SECOND' = 'MEGABYTES_PER_SECOND',
      'MILLISECONDS' = 'MILLISECONDS',
      'PERCENT' = 'PERCENT',
      'SCALAR' = 'SCALAR',
      'SCALAR_PER_SECOND' = 'SCALAR_PER_SECOND',
      'SECONDS' = 'SECONDS',
      'UNKNOWN' = 'UNKNOWN',
    }
    /** Cloud databases cluster node definition */
    export interface Node {
      /** Date of the creation of the node */
      createdAt: string;
      /** Flavor of the node */
      flavor: string;
      /** Node ID */
      id: string;
      /** Name of the node */
      name: string;
      /** Connection port for the node */
      port: number;
      /** Region of the node */
      region: string;
      /** Role of the node */
      role?: database.service.node.RoleEnum;
      /** Current status of the node */
      status: database.StatusEnum;
    }
    /** Cloud databases cluster new node definition */
    export interface NodeCreation {
      /** Date of the creation of the node */
      createdAt: string;
      /** Flavor of the node */
      flavor: string;
      /** Node ID */
      id: string;
      /** Name of the node */
      name: string;
      /** Connection port for the node */
      port: number;
      /** Region of the node */
      region: string;
      /** Role of the node */
      role?: database.service.node.RoleEnum;
      /** Current status of the node */
      status: database.StatusEnum;
    }
    /** Node pattern definition */
    export interface NodePattern {
      /** Flavor of the nodes */
      flavor: string;
      /** Number of nodes to create */
      number: number;
      /** Region of the nodes */
      region: string;
    }
    /** Cloud database service replication definition */
    export interface Replication {
      /** Defines whether heartbeats are emitted */
      emitHeartbeats: boolean;
      /** Defines whether the replication is actived */
      enabled: boolean;
      /** Service ID */
      id: string;
      /** ReplicationPolicyClass used for the replication */
      replicationPolicyClass: database.service.replication.PolicyClassEnum;
      /** ID of the integration source */
      sourceIntegration: string;
      /** Defines whether the group offsets must be sync */
      syncGroupOffsets: boolean;
      /** Defines the interval in second between 2 sync */
      syncInterval: number;
      /** ID of the integration target */
      targetIntegration: string;
      /** Patterns of the topics to exclude from the replication */
      topicExcludeList: string[];
      /** Patterns of the topics to replicate */
      topics: string[];
    }
    /** Cloud database service replication definition */
    export interface ReplicationCreation {
      /** Defines whether heartbeats are emitted */
      emitHeartbeats: boolean;
      /** Defines whether the replication is actived */
      enabled: boolean;
      /** ReplicationPolicyClass used for the replication */
      replicationPolicyClass: database.service.replication.PolicyClassEnum;
      /** ID of the integration source */
      sourceIntegration: string;
      /** Defines whether the group offsets must be sync */
      syncGroupOffsets: boolean;
      /** Defines the interval in second between 2 sync */
      syncInterval: number;
      /** ID of the integration target */
      targetIntegration: string;
      /** Patterns of the topics to exclude from the replication */
      topicExcludeList: string[];
      /** Patterns of the topics to replicate */
      topics: string[];
    }
    /** Cloud database service restore specification */
    export interface Restore {
      /** point in time to restore from */
      pointInTime: string;
    }
    /** Defines the storage attributes of a service */
    export interface Storage {
      /** Service storage size */
      size: {
        unit: string;
        value: number;
      };
      /** Service storage type */
      type: string;
    }
    /** User definition */
    export interface User {
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
    /** User creation definition */
    export interface UserCreation {
      /** Name of the user */
      name: string;
    }
    /** User with password definition */
    export interface UserWithPassword {
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Password of the user */
      password: string;
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
    /** User with password definition */
    export interface UserWithPasswordAndRoles {
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Password of the user */
      password: string;
      /** Roles the user belongs to */
      roles: string[];
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
    /** User definition */
    export interface UserWithRoles {
      /** Date of the creation of the user */
      createdAt: string;
      /** User ID */
      id: string;
      /** Roles the user belongs to */
      roles: string[];
      /** Current status of the user */
      status: database.StatusEnum;
      /** Name of the user */
      username: string;
    }
    /** User creation definition */
    export interface UserWithRolesCreation {
      /** Name of the user */
      name: string;
      /** Roles the user belongs to */
      roles: string[];
    }
  } /** Availability of databases engines on cloud projects */
  export interface Availability {
    /** Defines the type of backup. @@deprecated: use backups.enable */
    backup: database.BackupTypeEnum;
    /** Backup retention time of the availability in days. @deprecated: use backups.retentionDays */
    backupRetentionDays: number;
    /** Defines backups strategy for the availability */
    backups: database.availability.Backups;
    /** Category of the engine */
    category: CategoryEnum;
    /** Whether this availability can be used by default */
    default: boolean;
    /** End of life of the product. @deprecated: use lifecycle.endOfLife */
    endOfLife?: string;
    /** Database engine name */
    engine: string;
    /** Flavor name. @deprecated: use specifications.flavor */
    flavor: string;
    /** Defines the lifecycle of the availability */
    lifecycle: database.availability.Lifecycle;
    /** Maximum possible disk size in GB. @deprecated: use specifications.storage.maximum */
    maxDiskSize: number;
    /** Maximum nodes of the cluster. @deprecated: use specifications.nodes.maximum */
    maxNodeNumber: number;
    /** Minimum possible disk size in GB. @deprecated: use specifications.storage.minimum */
    minDiskSize: number;
    /** Minimum nodes of the cluster. @deprecated: use specifications.nodes.minimum */
    minNodeNumber: number;
    /** Type of network. @deprecated: use specifications.network */
    network: database.NetworkTypeEnum;
    /** Plan name */
    plan: string;
    /** Region name */
    region: string;
    /** Defines the technical specifications of the availability */
    specifications: database.availability.Specifications;
    /** Date of the release of the product. @deprecated: use lifecycle.startDate */
    startDate: string;
    /** Status of the availability. @deprecated: use lifecycle.status */
    status: database.availability.StatusEnum;
    /** Flex disk size step in GB. @deprecated: use specifications.storage.step */
    stepDiskSize: number;
    /** End of life of the upstream product. @deprecated: use lifecycle */
    upstreamEndOfLife?: string;
    /** Version name */
    version: string;
  }
  /** Cloud database backup definition */
  export interface Backup {
    /** Date of the creation of the backup */
    createdAt: string;
    /** Description of the backup */
    description: string;
    /** Backup ID */
    id: string;
    /** Region where the backup is stored. @deprecated: use regions */
    region: string;
    /** Regions where the backup are stored */
    regions: database.backup.Region[];
    /** Size of the backup */
    size: {
      unit: string;
      value: number;
    };
    /** Current status of the backup */
    status: database.StatusEnum;
    /** Type of backup */
    type: database.BackupTypeEnum;
  }
  /** Type of backup for the cluster */
  export enum BackupTypeEnum {
    'automatic' = 'automatic',
    'manual' = 'manual',
    'none' = 'none',
    'pitr' = 'pitr',
    'snapshot' = 'snapshot',
  }
  /** Capabilities available for the databases engines on cloud projects */
  export interface Capabilities {
    /** Disks available */
    disks: string[];
    /** Database engines available */
    engines: database.capabilities.Engine[];
    /** Flavors available */
    flavors: database.capabilities.Flavor[];
    /** Options available */
    options: database.capabilities.Option[];
    /** Plans available */
    plans: database.capabilities.Plan[];
    /** Regions available */
    regions: string[];
  }
  /** Possible names of the engines */
  export enum EngineEnum {
    'cassandra' = 'cassandra',
    'grafana' = 'grafana',
    'kafka' = 'kafka',
    'kafkaConnect' = 'kafkaConnect',
    'kafkaMirrorMaker' = 'kafkaMirrorMaker',
    'm3aggregator' = 'm3aggregator',
    'm3db' = 'm3db',
    'mongodb' = 'mongodb',
    'mysql' = 'mysql',
    'opensearch' = 'opensearch',
    'postgresql' = 'postgresql',
    'redis' = 'redis',
  }
  /** Ip Restriction definition for cloud project databases (@deprecated) */
  export interface IpRestriction {
    /** Description of the ip restriction */
    description: string;
    /** Whitelisted IP */
    ip: string;
    /** Current status of the ip restriction */
    status: database.StatusEnum;
  }
  /** Ip Restriction creation definition for cloud project databases (@deprecated) */
  export interface IpRestrictionCreation {
    /** Description of the ip restriction */
    description: string;
    /** Whitelisted IP */
    ip: string;
  }
  /** Type of network in which the databases cluster are */
  export enum NetworkTypeEnum {
    'private' = 'private',
    'public' = 'public',
  }
  /** Cloud database service definition */
  export interface Service {
    /** Time on which backups start every day. @deprecated: use backups.time */
    backupTime: string;
    /** Information related to the backups, null if the engine does not support backups */
    backups?: database.service.Backup;
    /** Capabilities of the services */
    capabilities: Record<service.CapabilityEnum, service.CapabilityActions>;
    /** Category of the engine */
    category: CategoryEnum;
    /** Date of the creation of the cluster */
    createdAt: string;
    /** Description of the cluster */
    description: string;
    /** Disk attributes of the cluster. @deprecated: use storage */
    disk: database.service.Disk;
    /** List of all endpoints of the service */
    endpoints: database.service.Endpoint[];
    /** Name of the engine of the service */
    engine: database.EngineEnum;
    /** The VM flavor used for this cluster */
    flavor: string;
    /** Service ID */
    id: string;
    /** IP Blocks authorized to access to the cluster */
    ipRestrictions: database.service.IpRestriction[];
    /** Time on which maintenances can start every day */
    maintenanceTime: string;
    /** Private network ID in which the cluster is */
    networkId?: string;
    /** Type of network of the cluster */
    networkType: database.NetworkTypeEnum;
    /** Number of nodes in the cluster. @deprecated: use nodes */
    nodeNumber: number;
    /** Nodes of the cluster */
    nodes: database.service.Node[];
    /** Plan of the cluster */
    plan: string;
    /** Region of the cluster */
    region?: string;
    /** Current status of the cluster */
    status: database.StatusEnum;
    /** Storage attributes of the cluster */
    storage?: database.service.Storage;
    /** Private subnet ID in which the cluster is */
    subnetId?: string;
    /** Version of the engine deployed on the cluster */
    version: string;
  }
  /** Cloud databases cluster definition */
  export interface ServiceCreation {
    /** Backup from which the new service is created. @deprecated: use forkFrom */
    backup?: database.service.creation.BackupFork;
    /** Time on which backups start every day. @deprecated: use backups.time */
    backupTime?: string;
    /** Information related to the backups, null if the engine does not support backups */
    backups?: database.service.Backup;
    /** Description of the cluster */
    description: string;
    /** Disk attributes of the cluster */
    disk?: database.service.Disk;
    /** Backup from which the new service is created */
    forkFrom?: database.service.creation.ForkFrom;
    /** IP Blocks authorized to access to the cluster */
    ipRestrictions: database.service.IpRestriction[];
    /** Time on which maintenances can start every day */
    maintenanceTime?: string;
    /** Private network ID in which the cluster is */
    networkId?: string;
    /** List of nodes in the cluster, not compatible with nodesPattern */
    nodesList?: database.service.NodeCreation[];
    /** Pattern definition of the nodes in the cluster, not compatible with nodesList */
    nodesPattern?: database.service.NodePattern;
    /** Plan of the cluster */
    plan: string;
    /** Private subnet ID in which the cluster is */
    subnetId?: string;
    /** Version of the engine deployed on the cluster */
    version: string;
  }
  /** Possible state of the job */
  export enum StatusEnum {
    'CREATING' = 'CREATING',
    'DELETING' = 'DELETING',
    'ERROR' = 'ERROR',
    'ERROR_INCONSISTENT_SPEC' = 'ERROR_INCONSISTENT_SPEC',
    'LOCKED' = 'LOCKED',
    'LOCKED_PENDING' = 'LOCKED_PENDING',
    'LOCKED_UPDATING' = 'LOCKED_UPDATING',
    'PENDING' = 'PENDING',
    'READY' = 'READY',
    'UPDATING' = 'UPDATING',
  }
  /** Cloud databases temporary write deadline definition */
  export interface TemporaryWriteDeadline {
    /** Date on which the temporary write permissions would be lifted */
    until: string;
  }
  /** Type of data returned in the capabilities options */
  export enum TypeEnum {
    'boolean' = 'boolean',
    'double' = 'double',
    'duration' = 'duration',
    'long' = 'long',
    'string' = 'string',
  }
  /** Different categories of engines */
  export enum CategoryEnum {
    all = 'all',
    operational = 'operational',
    analysis = 'analysis',
    streaming = 'streaming',
  }
  /** Suggestion of availability selection */
  export interface Suggestion {
    default: boolean;
    engine: string;
    flavor: string;
    plan: string;
    region: string;
    version: string;
  }
  /** Engines Capabilites */
  export interface EngineCapabilities {
    category: CategoryEnum;
    description: string;
    lifecycle: database.availability.Lifecycle;
    name: string;
    order: number;
    sslModes: string[];
    storage: database.capabilities.engine.storage.StrategyEnum;
    tags: string[];
    versions: {
      default: boolean;
      lifecycle: database.availability.Lifecycle;
      name: string;
      tags: string[];
    }[];
  }
  /** Regions Capabilites */
  export interface RegionCapabilities {
    lifecycle: database.availability.Lifecycle;
    name: string;
    order: number;
    tags: string[];
  }
}
