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
  getOrderDataFromModel,
  getTerraformDataFromModel,
};
