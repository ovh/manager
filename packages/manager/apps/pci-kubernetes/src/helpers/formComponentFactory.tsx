import { Chip } from '@/components/oidc/Chip.component';
import { Input } from '@/components/oidc/Input.component';
import { Select } from '@/components/oidc/Select.component';

export const formComponentFactory = (name, props) => {
  const componentMap = {
    signingAlgorithms: Select,
    groupsClaim: Chip,
    requiredClaim: Chip,
  };

  const Component = componentMap[name] || Input;
  return <Component {...props} />;
};
