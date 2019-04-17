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
    instance_type: ['b2-7', 'b2-15', 'b2-30', 'b2-60', 'b2-120'],
    instance_min: 3,
    instance_max: 10,
    raw_storage_min_gb: 100,
    raw_storage_max_gb: 4000,
  },
  master_node: {
    instance_type: ['b2-30'],
    instance_min: 3,
    instance_max: 10,
    raw_storage_min_gb: 100,
    raw_storage_max_gb: 1000,
  },
  worker_node: {
    instance_type: ['b2-7', 'b2-15'],
    instance_min: 3,
    instance_max: 10,
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
    instance_min: 3,
    instance_max: 10,
    raw_storage_min_gb: 200,
    raw_storage_max_gb: 4000,
  },
  master_node: {
    instance_type: ['b2-30'],
    instance_min: 3,
    instance_max: 10,
    raw_storage_min_gb: 100,
    raw_storage_max_gb: 1000,
  },
  worker_node: {
    instance_type: ['b2-15'],
    instance_min: 3,
    instance_max: 10,
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
  '5b7a7fd3-4d0a-4eed-879c-167cd4658f80',
];

// TODO - remove this when API support is available
export const ADP_PLATFORMS_GET_DETAILS2 = {
  serviceName: '5b7a7fd3-4d0a-4eed-879c-167cd4658f80',
  admin_mail: 'mocked.mail@cluster.com',
  cluster_name: 'Big data 1',
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
  project_id: '5cf66fc2aaf044dfb87758652f068a1b',
  vrack_id: 'pn-16343',
  status: 'IN_PROGRESS',
};

// TODO - remove this when API support is available
export const ADP_PLATFORMS_GET_DETAILS = {
  serviceName: '4cc0cdc3-ffc8-4b62-a8e5-7960ded581c6',
  admin_mail: 'mocked.mail@cluster.com',
  cluster_name: 'Big data 2',
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
  project_id: '5cf66fc2aaf044dfb87758652f068a1b',
  vrack_id: 'pn-16343',
  status: 'DEPLOYED',
};

export const ADP_CLUSTER_DEPLOY_STATUS = [
  {
    percentage: 100,
    status: 'DONE',
    task: 'Node creation',
  },
  {
    percentage: 35,
    status: 'IN_PROGRESS',
    task: 'Server creation',
  },
  {
    percentage: 35,
    status: 'PENDING',
    task: 'Storage creation',
  },
  {
    percentage: 35,
    status: 'PENDING',
    task: 'Validating cluster',
  },
];

// TODO - remove this when API support is available
export const ADP_CLUSTER_NODES = {
  nodes: [
    {
      deployment_end_date: 123123123,
      deployment_start_date: 123123123,
      hostname: 'hostname',
      ip: '192.123.1.1',
      node_id: 'node_uuid',
      node_type: 'MASTER',
      status: 'PENDING',
      flavor_type: 's1-2',
      storage: 11,
      region: 'GRA3',
    },
    {
      deployment_end_date: 345345345,
      deployment_start_date: 345345345,
      hostname: 'hostname2',
      ip: '192.3.1.3',
      node_id: 'node_uuid',
      node_type: 'UTILITY',
      status: 'IN_PROGRESS',
      flavor_type: 'b2-15',
      storage: 345,
      region: 'GRA5',
    },
    {
      deployment_end_date: 345345345,
      deployment_start_date: 345345345,
      hostname: 'hostname2',
      ip: '192.3.1.3',
      node_id: 'node_uuid',
      node_type: 'SLAVE',
      status: 'DONE',
      flavor_type: 'b2-15',
      storage: 23,
      region: 'GRA5',
    },
    {
      deployment_end_date: 345345345,
      deployment_start_date: 345345345,
      hostname: 'hostname2',
      ip: '192.3.1.3',
      node_id: 'node_uuid',
      node_type: 'EDGE',
      status: 'ERROR',
      flavor_type: 'b2-15',
      storage: 288,
      region: 'GRA5',
    },
  ],
};

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

export default {
  ADP_CAPABILITIES,
  ADP_GET_ACTIVITIES,
  ADP_CLUSTER_DEPLOY_STATUS,
  ADP_CLUSTER_NODES,
  ADP_PLATFORMS_GET_DETAILS,
  ADP_PLATFORMS_GET_DETAILS2,
  ADP_PLATFORMS_GET_LIST,
};
