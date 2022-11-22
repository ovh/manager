export const NAME_PATTERN = /^([\w.-]*)$/;
export const MIN_NAME_LENGTH = 3;
export const MAX_NAME_LENGTH = 40;
export const ORDER_KEYS = [
  'description',
  'nodesPattern.flavor',
  'nodesPattern.number',
  'nodesPattern.region',
  'plan',
  'version',
  'networkId',
  'subnetId',
];
export const PRIVATE_NETWORK_GUIDE = {
  DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-vrack/',
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/public-cloud-vrack/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/public-cloud-vrack/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/public-cloud-vrack/',
  FR: 'https://docs.ovh.com/fr/public-cloud/public-cloud-vrack/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-vrack/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/public-cloud-vrack/',
  QC: 'https://docs.ovh.com/ca/fr/public-cloud/public-cloud-vrack/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/public-cloud-vrack/',
};

export function getOrderDataFromModel(model) {
  const orderData = {
    description: model.name,
    nodesPattern: {
      flavor: model.flavor.name,
      number: model.plan.nodesCount,
      region: model.region.name,
    },
    plan: model.plan.name,
    version: model.engine.selectedVersion.version,
  };
  if (model.usePrivateNetwork && model.subnet?.id?.length > 0) {
    orderData.networkId = model.privateNetwork.regions?.find(
      (region) => region.region === model.subnet?.ipPools[0].region,
    )?.openstackId;
    orderData.subnetId = model.subnet?.id;
  }
  return orderData;
}

export function getTerraformDataFromModel(projectId, model) {
  const terraformData = {
    key: 'resource',
    values: ['ovh_cloud_project_database', model.engine.name],
    nodes: [
      {
        key: 'service_name',
        values: [projectId],
        nodes: [],
      },
      {
        key: 'description',
        values: [model.name],
        nodes: [],
      },
      {
        key: 'engine',
        values: [model.engine.name],
        nodes: [],
      },
      {
        key: 'version',
        values: [model.engine.selectedVersion.version],
        nodes: [],
      },
      {
        key: 'plan',
        values: [model.plan.name],
        nodes: [],
      },

      {
        key: 'flavor',
        values: [model.flavor.name],
        nodes: [],
      },
    ],
  };
  for (let i = 0; i < model.plan.nodesCount; i += 1) {
    const nodeData = {
      key: 'nodes',
      values: [],
      nodes: [
        {
          key: 'region',
          values: [model.region.name],
          nodes: [],
        },
      ],
    };
    if (model.usePrivateNetwork && model.subnet?.id?.length > 0) {
      nodeData.nodes.push({
        key: 'networkId',
        values: [
          model.privateNetwork.regions?.find(
            (region) => region.region === model.subnet?.ipPools[0].region,
          )?.openstackId,
        ],
        nodes: [],
      });
      nodeData.nodes.push({
        key: 'subnetId',
        values: [model.subnet?.id],
        nodes: [],
      });
    }
    terraformData.nodes.push(nodeData);
  }
  return terraformData;
}

export default {
  NAME_PATTERN,
  MIN_NAME_LENGTH,
  MAX_NAME_LENGTH,
  ORDER_KEYS,
  PRIVATE_NETWORK_GUIDE,
  getOrderDataFromModel,
  getTerraformDataFromModel,
};
