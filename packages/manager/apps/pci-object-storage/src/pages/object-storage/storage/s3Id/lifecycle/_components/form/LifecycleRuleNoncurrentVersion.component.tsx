import { LifecycleRuleVersionOperations } from './LifecycleRuleVersionOperations.component';

export const LifecycleRuleNoncurrentVersion = () => (
  <LifecycleRuleVersionOperations
    transition={{
      hasFieldName: 'hasNoncurrentVersionTransitions',
      transitionsFieldName: 'noncurrentVersionTransitions',
      daysKey: 'noncurrentDays',
      checkboxId: 'has-noncurrent-transitions',
      checkboxLabelKey: 'formNoncurrentTransitionsLabel',
      daysLabelKey: 'formNoncurrentDaysLabel',
      addButtonLabelKey: 'formAddTransition',
    }}
    expiration={{
      hasFieldName: 'hasNoncurrentVersionExpiration',
      daysFieldName: 'noncurrentVersionExpirationDays',
      checkboxId: 'has-noncurrent-expiration',
      checkboxLabelKey: 'formNoncurrentExpirationLabel',
      daysLabelKey: 'formNoncurrentExpirationDaysLabel',
    }}
  />
);
