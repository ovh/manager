import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Pen } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import { useAppData } from '../../App.context';

const ScalingStrat = () => {
  const { app } = useAppData();
  const { t } = useTranslation('ai-tools/apps/app/dashboard');
  const navigate = useNavigate();
  return (
    <>
      <h5>{t('scalingTitle')}</h5>
      <div className="flex flex-row justify-between gap-2 mt-4">
        <p className="mb-2 font-semibold">
          {app.spec.scalingStrategy.fixed?.replicas
            ? t('fixedScalingLabel')
            : t('autoScalingLabel')}
        </p>
        <Button
          data-testid="update-scaling-button"
          size="sm"
          mode="outline"
          onClick={() => navigate('./update-scaling')}
        >
          <span>{t('modifyLabel')}</span>
          <Pen className="ml-2 size-4" />
        </Button>
      </div>
      <ul>
        {app.spec.scalingStrategy.fixed?.replicas ? (
          <li data-testid="fixed-list">
            {t('fixedReplicasLabel', {
              rep: app.spec.scalingStrategy.fixed.replicas,
            })}
          </li>
        ) : (
          <>
            <li data-testid="automatic-list">
              {t('minReplicasLabel', {
                rep: app.spec.scalingStrategy.automatic.replicasMin,
              })}
              {}
            </li>
            <li>
              {t('maxReplicasLabel', {
                rep: app.spec.scalingStrategy.automatic.replicasMax,
              })}
            </li>
            {app.spec.scalingStrategy.automatic.resourceType && (
              <li>
                {t('resourceTypeLabel', {
                  res: app.spec.scalingStrategy.automatic.resourceType,
                })}
              </li>
            )}
            {app.spec.scalingStrategy.automatic.customMetrics ? (
              <>
                <li className="break-all">
                  {t('customMetricsUrlLabel')}
                  {app.spec.scalingStrategy.automatic.customMetrics.apiUrl}
                </li>
                <li>
                  {t('customMetricsFormatLabel', {
                    for:
                      app.spec.scalingStrategy.automatic.customMetrics.format,
                  })}
                </li>
                <li className="break-all">
                  {t('customMetricsLocationLabel')}
                  {app.spec.scalingStrategy.automatic.customMetrics.valueLocation}
                </li>
                <li>
                  {t('customMetricsTargetValueLabel', {
                    val:
                      app.spec.scalingStrategy.automatic.customMetrics
                        .targetValue,
                  })}
                </li>
              </>
            ) : (
              <li>
                {t('averageUsegeLabel', {
                  val: app.spec.scalingStrategy.automatic.averageUsageTarget,
                })}
              </li>
            )}
          </>
        )}
      </ul>
    </>
  );
};

export default ScalingStrat;
