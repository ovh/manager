import { useParams } from 'react-router';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useVrack } from '@/hooks/useVrack';
import { Network, NetworkTypeEnum } from '@/models/network';

interface NetworkOptionsProps {
  region: string;
  networkType: NetworkTypeEnum;
  onNetworkTypeChange: (newNetwork: NetworkTypeEnum) => void;
}
const NetworkOptions = ({
  region,
  networkType,
  onNetworkTypeChange,
}: NetworkOptionsProps) => {
  const { projectId } = useParams();
  const vrack = useVrack(projectId, region);
  return (
    <>
      <RadioGroup
        className="mb-2"
        name="network-type"
        value={networkType}
        onValueChange={(newNetworkValue) =>
          onNetworkTypeChange(newNetworkValue as NetworkTypeEnum)
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="public-network" />
          <Label htmlFor="public-network">Réseau public (Internet)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="private" id="private-network" />
          <Label htmlFor="private-network">Réseau privé (vRack)</Label>
        </div>
      </RadioGroup>
      {networkType === 'private' && (
        <div>
          <div>
            {vrack.networkQuery.isLoading && (
              <div className="flex items-center mb-2">
                <label className="mr-2">Network:</label>
                <Skeleton className="h-10 w-32" />
              </div>
            )}
            {vrack.networkQuery.isSuccess &&
              (vrack.networks.length > 0 ? (
                <div className="flex items-center mb-2">
                  <label className="mr-2">Network:</label>
                  <select
                    name="networkId"
                    className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
                    value={vrack.selectedNetwork}
                    onChange={(event) =>
                      vrack.setSelectedNetwork(event.target.value)
                    }
                  >
                    {vrack.networks.map((network: Network, index: number) => (
                      <option key={index} value={network.id}>
                        {network.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p>You don't have a network for this region</p>
              ))}
          </div>
          <div>
            {vrack.subnetQuery.isLoading && (
              <div className="flex items-center mb-2">
                <label className="mr-2">Subnet:</label>
                <Skeleton className="h-10 w-32" />
              </div>
            )}
            {vrack.subnetQuery.isSuccess &&
              (vrack.subnets.length > 0 ? (
                <div className="flex items-center mb-2">
                  <label className="mr-2">Subnet:</label>
                  <select
                    name="subnetId"
                    className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-between"
                    value={vrack.selectedSubnet}
                    onChange={(event) =>
                      vrack.setSelectedSubnet(event.target.value)
                    }
                  >
                    {vrack.subnets.map((subnet, index) => (
                      <option key={index} value={subnet.id}>
                        {subnet.cidr}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p>You don't have a subnet for this region</p>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NetworkOptions;
