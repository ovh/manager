import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Pen } from 'lucide-react';
import { useAppData } from '../../App.context';
import { Button } from '@/components/ui/button';

const ScalingStrat = () => {
  const { app } = useAppData();
  const { t } = useTranslation('pci-ai-deploy/apps/app/dashboard');
  const navigate = useNavigate();
  return (
    <>
      <h5>{t('ScalingTitle')}</h5>
      <div className="flex flex-row justify-between gap-2 mt-4">
        <p className="mb-2 font-semibold">
          {app.spec.scalingStrategy.fixed?.replicas
            ? t('fixedScalingLabel')
            : t('autoScalingLabel')}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('./update-scaling')}
        >
          <span>{t('modifyLabel')}</span>
          <Pen className="ml-2 size-4" />
        </Button>
      </div>
      <ul className="list-disc">
        {app.spec.scalingStrategy.fixed?.replicas ? (
          <li className="ml-8">
            Replicas : {app.spec.scalingStrategy.fixed.replicas}
          </li>
        ) : (
          <>
            <li className="ml-8">
              Minimum de replicas :{' '}
              {app.spec.scalingStrategy.automatic.replicasMin}
            </li>
            <li className="ml-8">
              Maximum de replicas :{' '}
              {app.spec.scalingStrategy.automatic.replicasMax}
            </li>
            <li className="ml-8">
              Métrique surveillée :{' '}
              {app.spec.scalingStrategy.automatic.resourceType}
            </li>
            <li className="ml-8">
              Seuil de déclenchement :{' '}
              {app.spec.scalingStrategy.automatic.averageUsageTarget} %
            </li>
          </>
        )}
      </ul>
    </>
  );
};

export default ScalingStrat;
