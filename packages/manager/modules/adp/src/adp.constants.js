export const ADP_PUBLIC_CLOUD_STATUS = Object.freeze({
  CREATING: 'creating',
  DELETED: 'deleted',
  DELETING: 'deleting',
  OK: 'ok',
  SUSPENDED: 'suspended',
});

export const ADP_NODE_TYPES = Object.freeze({
  MASTER: 'MASTER',
  WORKER: 'SLAVE',
  EDGE: 'EDGE',
  UTILITY: 'UTILITY',
  BASTION: 'BASTION',
});

export const ADP_GUIDE_LINKS = Object.freeze({
  general_link: 'https://docs.ovh.com/gb/en/analytics/',
});

export const ADP_CLUSTER_MANAGE = Object.freeze({
  AMBARI: 'https://knox.serviceName.datalake.ovh/gateway/default/ambari',
  FREEIPA: 'https://ipa.serviceName.datalake.ovh',
  RANGER: 'https://knox.serviceName.datalake.ovh/gateway/default/ranger/login.jsp',
});

export const ADP_NODE_NAMES = ['worker', 'edge', 'master', 'utility', 'bastion'];

export const ADP_CLOUD_CATALOG_NAME = 'cloud';

export const ADP_FLAVOR_TYPES = Object.freeze([
  {
    id: 'balanced',
    types: ['ovh.ceph.eg', 'ovh.ssd.eg'],
  },
  {
    id: 'cpu',
    types: ['ovh.cpu', 'ovh.ssd.cpu', 'ovh.ceph.hg'],
  },
  {
    id: 'ram',
    types: ['ovh.ram', 'ovh.ssd.ram'],
  },
  {
    id: 'accelerated',
    types: ['ovh.ssd.gpu', 'ovh.ssd.gpu2', 'ovh.ssd.gpu3', 'ovh.ssd.fpga2', 'ovh.raid-nvme.t1'],
  },
  {
    id: 'vps',
    types: ['ovh.vps-ssd'],
  },
]);

export const ADP_CREDENTIALS_INFO = Object.freeze({
  credentials: [{
    key: 'admin_password',
    login: 'admin',
    service: 'Ambari',
    password: 'Not generated',
  },
  {
    key: 'admin_password',
    login: 'admin',
    service: 'FreeIPA',
    password: 'Not generated',
  },
  {
    key: 'kerberos',
    login: 'admin',
    service: 'Kerberos KDC',
    password: 'Not generated',
  },
  {
    key: 'kms_passwd',
    login: 'admin',
    service: 'Ranger KMS',
    password: 'Not generated',
  },
  {
    key: 'admin_password_guacamole',
    login: 'guacadmin',
    service: 'Guacamole',
    password: 'Not generated',
  },
  {
    key: 'mysql_root_password',
    login: 'root',
    service: 'MariaDB SQL server',
    password: 'Not generated',
  },
  {
    key: 'hive',
    login: 'hive',
    service: 'Hive BDD',
    password: 'Not generated',
  },
  {
    key: 'oozie',
    login: 'oozie',
    service: 'Oozie BDD',
    password: 'Not generated',
  },
  {
    key: 'ambari',
    login: 'ambari',
    service: 'Ambari BDD',
    password: 'Not generated',
  },
  {
    key: 'guacamole',
    login: 'guacamole',
    service: 'Guacamole BDD',
    password: 'Not generated',
  }],
  rounds: 100000,
  dkLen: 32,
  passwordLength: 18,
});

// TODO - remove this when API support is available
export const ADP_CAPABILITIES = [{
  components: [{
    name: 'Apache Accumulo',
    version: '1.7.0',
  }, {
    name: 'Apache Atlas',
    version: '0.8.0',
  }, {
    name: 'Apache Calcite',
    version: '1.2.0',
  }, {
    name: 'Apache DataFu',
    version: '1.3.0',
  }, {
    name: 'Apache Falcon',
    version: '0.10.0',
  }, {
    name: 'Apache Flume',
    version: '1.5.2',
  }, {
    name: 'Apache Hadoop',
    version: '2.7.3',
  }, {
    name: 'Apache HBase',
    version: '1.1.2',
  }, {
    name: 'Apache Hive',
    version: '1.2.1',
  }, {
    name: 'Apache Hive',
    version: '2.1.0',
  }, {
    name: 'Apache Kafka',
    version: '1.0.0',
  }, {
    name: 'Apache Knox',
    version: '0.12.0',
  }, {
    name: 'Apache Livy',
    version: '0.4',
  }, {
    name: 'Apache Mahout',
    version: '0.9.0+',
  }, {
    name: 'Apache Oozie',
    version: '4.2.0',
  }, {
    name: 'Apache Phoenix',
    version: '4.7.0',
  }, {
    name: 'Apache Pig',
    version: '0.16.0',
  }, {
    name: 'Apache Ranger',
    version: '0.7.0',
  }, {
    name: 'Apache Slider',
    version: '0.92.0',
  }, {
    name: 'Apache Spark',
    version: '1.6.3',
  }, {
    name: 'Apache Spark',
    version: '2.3.0',
  }, {
    name: 'Apache Sqoop',
    version: '1.4.6',
  }, {
    name: 'Apache Storm',
    version: '1.1.0',
  }, {
    name: 'Apache TEZ',
    version: '0.7.0',
  }, {
    name: 'Apache Zeppelin',
    version: '0.7.3',
  }, {
    name: 'Apache ZooKeeper',
    version: '3.4.6',
  }],
  available_region: ['GRA5', 'SBG5'],
  bastion_node: {
    instance_type: ['b2-7', 'b2-15'],
    instance_min: 1,
    instance_max: 1,
    raw_storage_min_gb: 0,
    raw_storage_max_gb: 0,
  },
  edge_node: {
    instance_type: ['b2-15', 'b2-30', 'b2-60', 'b2-120'],
    instance_min: 4,
    instance_max: 10,
    raw_storage_min_gb: 100,
    raw_storage_max_gb: 4000,
  },
  master_node: {
    instance_type: ['b2-15', 'b2-30', 'b2-60', 'b2-120'],
    instance_min: 3,
    instance_max: 3,
    raw_storage_min_gb: 100,
    raw_storage_max_gb: 1000,
  },
  worker_node: {
    instance_type: ['b2-15'],
    instance_min: 3,
    instance_max: 3,
    raw_storage_min_gb: 100,
    raw_storage_max_gb: 1000,
  },
  utility_node: {
    instance_type: ['b2-15'],
    instance_min: 3,
    instance_max: 3,
    raw_storage_min_gb: 0,
    raw_storage_max_gb: 0,
  },
  hdfs_replication_factor: 3,
  requirements: { masterPassword: false },
  version: 'ADP V1.X',
  version_description: "OVH ADP is Based on HDP 2.6 and improve it's security with Kerberos while deploying on OVH's public cloud infrastructure",
}, {
  components: [{
    name: 'Apache Accumulo',
    version: '1.7.0',
  }, {
    name: 'Apache Atlas',
    version: '0.8.0',
  }, {
    name: 'Apache Calcite',
    version: '1.2.0',
  }, {
    name: 'Apache DataFu',
    version: '1.3.0',
  }, {
    name: 'Apache Falcon',
    version: '0.10.0',
  }, {
    name: 'Apache Flume',
    version: '1.5.2',
  }, {
    name: 'Apache Hadoop',
    version: '2.7.3',
  }, {
    name: 'Apache HBase',
    version: '1.1.2',
  }, {
    name: 'Apache Hive',
    version: '1.2.1',
  }, {
    name: 'Apache Hive',
    version: '2.1.0',
  }, {
    name: 'Apache Kafka',
    version: '1.0.0',
  }, {
    name: 'Apache Knox',
    version: '0.12.0',
  }, {
    name: 'Apache Livy',
    version: '0.4',
  }, {
    name: 'Apache Mahout',
    version: '0.9.0+',
  }, {
    name: 'Apache Oozie',
    version: '4.2.0',
  }, {
    name: 'Apache Phoenix',
    version: '4.7.0',
  }, {
    name: 'Apache Pig',
    version: '0.16.0',
  }, {
    name: 'Apache Ranger',
    version: '0.7.0',
  }, {
    name: 'Apache Slider',
    version: '0.92.0',
  }, {
    name: 'Apache Spark',
    version: '1.6.3',
  }, {
    name: 'Apache Spark',
    version: '2.3.0',
  }, {
    name: 'Apache Sqoop',
    version: '1.4.6',
  }, {
    name: 'Apache Storm',
    version: '1.1.0',
  }, {
    name: 'Apache TEZ',
    version: '0.7.0',
  }, {
    name: 'Apache Zeppelin',
    version: '0.7.3',
  }, {
    name: 'Apache ZooKeeper',
    version: '3.4.6',
  }],
  available_region: ['GRA5', 'SBG5'],
  bastion_node: {
    instance_type: ['b2-7'],
    instance_min: 1,
    instance_max: 1,
    raw_storage_min_gb: 0,
    raw_storage_max_gb: 0,
  },
  edge_node: {
    instance_type: ['b2-15', 'b2-30', 'b2-60', 'b2-120'],
    instance_min: 1,
    instance_max: 50,
    raw_storage_min_gb: 4000,
    raw_storage_max_gb: 100,
  },
  master_node: {
    instance_type: ['b2-30', 'b2-60', 'b2-120'],
    instance_min: 3,
    instance_max: 3,
    raw_storage_min_gb: 100,
    raw_storage_max_gb: 100,
  },
  worker_node: {
    instance_type: ['b2-15'],
    instance_min: 3,
    instance_max: 3,
    raw_storage_min_gb: 0,
    raw_storage_max_gb: 0,
  },
  utility_node: {
    instance_type: ['b2-15'],
    instance_min: 3,
    instance_max: 3,
    raw_storage_min_gb: 0,
    raw_storage_max_gb: 0,
  },
  hdfs_replication_factor: 3,
  requirements: null,
  version: 'Managed ADP V1.X',
  version_description: 'Managed ADP (for testing purpose only)',
}];

// TODO - remove this when API support is available
export const ADP_PLATFORMS_GET_LIST = [
  '5b7a7fd3-4d0a-4eed-879c-167cd4658f89',
];

// TODO - remove this when API support is available
export const ADP_PLATFORMS_GET_DETAILS = {
  serviceName: '5b7a7fd3-4d0a-4eed-879c-167cd4658f89',
  admin_mail: 'mocked.mail@cluster.com',
  cluster_name: 'MockedClusterName::mockedProjectId::5b7a7fd3-4d0a-4eed-879c-167cd4658f89',
  cluster_type: 'ADP V1.X',
  deployment_start_date: 1553231333926,
  deployment_end_date: 1553231333926,
  domain: 'mockedDomain.datalake.ovh.com',
  nodes: [
    {
      node_id: 'c1a86407-d2d4-4f05-8c74-dd3fad085a00',
      hostname: 'mnode0.5b7a7fd3-4d0a-4eed-879c-167cd4658f89.datalake.ovh.com',
      node_type: 'MASTER',
      deployment_start_date: 1553231333926,
      deployment_end_date: 1553231333926,
      ip: '0.0.0.0',
      storage: 0,
      status: 'DEPLOYED',
    },
    {
      node_id: 'c1a86407-d2d4-4f05-8c74-dd3fad085a01',
      hostname: 'mnode1.5b7a7fd3-4d0a-4eed-879c-167cd4658f89.datalake.ovh.com',
      node_type: 'MASTER',
      deployment_start_date: 1553231333926,
      deployment_end_date: 1553231333926,
      ip: '1.1.1.1',
      storage: 0,
      status: 'DEPLOYED',
    },
    {
      node_id: '00097d50-da2c-4e64-8319-2af8254a0830',
      hostname: 'cnode0.5b7a7fd3-4d0a-4eed-879c-167cd4658f89.datalake.ovh.com',
      node_type: 'SLAVE',
      deployment_start_date: 1553231333926,
      deployment_end_date: 1553231333926,
      ip: '0.00.00.00',
      storage: 2000,
      status: 'DEPLOYED',
    },
    {
      node_id: '00097d50-da2c-4e64-8319-2af8254a0830',
      hostname: 'enode0.5b7a7fd3-4d0a-4eed-879c-167cd4658f89.datalake.ovh.com',
      node_type: 'EDGE',
      deployment_start_date: 1553231333926,
      deployment_end_date: 1553231333926,
      ip: '0.00.00.00',
      storage: 0,
      status: 'DEPLOYED',
    },
    {
      node_id: '00097d50-da2c-4e64-8319-2af8254a0830',
      hostname: 'unode0.5b7a7fd3-4d0a-4eed-879c-167cd4658f89.datalake.ovh.com',
      node_type: 'UTILITY',
      deployment_start_date: 1553231333926,
      deployment_end_date: 1553231333926,
      ip: '0.00.00.00',
      storage: 0,
      status: 'DEPLOYED',
    },
  ],
  os_region: 'GRA5',
  project_id: 'mockedProjectId',
  vrack_id: 'mockedVrackId',
  status: 'DEPLOYED',
};

// TODO - remove this when API support is available
export const ADP_GET_ACTIVITIES = [
  {
    timestamp: 1553491021320,
    description: 'Cluster deployment',
    user: 'Admin',
    status: 'DONE',
  },
  {
    timestamp: 1553491021320,
    description: 'Cluster scale up',
    user: 'Admin',
    status: 'DONE',
  },
];

export const ADP_URL_NAME = Object.freeze({
  AMBARI: 'AMBARI',
  FREEIPA: 'FREEIPA',
  RANGER: 'RANGER',
});

export default {
  ADP_PUBLIC_CLOUD_STATUS,
  ADP_CAPABILITIES,
  ADP_CLOUD_CATALOG_NAME,
  ADP_CLUSTER_MANAGE,
  ADP_CREDENTIALS_INFO,
  ADP_FLAVOR_TYPES,
  ADP_GET_ACTIVITIES,
  ADP_GUIDE_LINKS,
  ADP_NODE_NAMES,
  ADP_NODE_TYPES,
  ADP_PLATFORMS_GET_DETAILS,
  ADP_PLATFORMS_GET_LIST,
  ADP_URL_NAME,
};
