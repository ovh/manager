const loadNetworksWithSubnets = async () => {
  const loadNetworks = async () => {
    const response = await fetch(
      `https://www.ovh.com/engine/apiv6/cloud/project/5a6980507c0a40dca362eb9b22d79044/aggregated/network`,
    );
    const data = await response.json();
    return data.resources;
  };
  const networks = await loadNetworks();
  console.log('sid: networks loaded');
  // eslint-disable-next-line no-restricted-syntax
  for (const network of networks) {
    const response = await fetch(
      `https://www.ovh.com/engine/apiv6/cloud/project/5a6980507c0a40dca362eb9b22d79044/region/GRA5/network/3d4b1383-3e5c-43ca-ab80-42b86ce993af/subnet`,
    );
    network.subnets = await response.json();
    console.log(`sid: subnets for network ${network.id} loaded`);
  }
  return networks;
};
