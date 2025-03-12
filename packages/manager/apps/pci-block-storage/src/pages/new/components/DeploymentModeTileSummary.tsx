import { TDeployment, DeploymentTilesInput } from '@ovh-ux/manager-pci-common';

interface DeploymentModeTileSummaryProps {
  group: TDeployment;
}

export function DeploymentModeTileSummary({
  group,
}: Readonly<DeploymentModeTileSummaryProps>) {
  return (
    <fieldset className="border-0 p-0" disabled>
      <DeploymentTilesInput
        deployments={[group]}
        value={group}
        onChange={() => {}}
        name="deployements-summary"
      />
    </fieldset>
  );
}
