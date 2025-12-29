import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { ConfigurationTransferBadgeColorAndContent } from '@/domain/constants/configuration.card';

export function transferStatusFromState(
  protectionStateCurrent: ProtectionStateEnum,
  protectionStateTarget: ProtectionStateEnum,
) {
  const result = ConfigurationTransferBadgeColorAndContent.find((r) => {
    return (
      r.requiredStatus.currentState === protectionStateCurrent &&
      r.requiredStatus.targetState === protectionStateTarget
    );
  });
  return result ? result.result : undefined;
}
