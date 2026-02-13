import { LifecycleRuleVersionOperations } from './LifecycleRuleVersionOperations.component';

export const LifecycleRuleNoncurrentVersion = () => (
  <LifecycleRuleVersionOperations
    transition={{
      hasFieldName: 'hasNoncurrentVersionTransitions',
      transitionsFieldName: 'noncurrentVersionTransitions',
      daysKey: 'noncurrentDays',
      checkboxId: 'has-noncurrent-transitions',
      checkboxLabelKey: 'formNoncurrentTransitionsLabel',
      checkboxDescriptionKey: 'formNoncurrentTransitionsDescription',
      daysLabelKey: 'formNoncurrentDaysLabel',
      addButtonLabelKey: 'formAddTransition',
    }}
    expiration={{
      hasFieldName: 'hasNoncurrentVersionExpiration',
      daysFieldName: 'noncurrentVersionExpirationDays',
      newerVersionsFieldName: 'noncurrentVersionExpirationNewerVersions',
      checkboxId: 'has-noncurrent-expiration',
      checkboxLabelKey: 'formNoncurrentExpirationLabel',
      daysLabelKey: 'formNoncurrentExpirationDaysLabel',
      newerVersionsLabelKey: 'formNewerNoncurrentVersionsLabel',
    }}
  />
);
