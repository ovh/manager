import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import { Pen } from 'lucide-react';
import { useAppData } from '../../App.context';

const DockerCommand = () => {
  const { app } = useAppData();
  const { t } = useTranslation('ai-tools/apps/app/dashboard');
  const navigate = useNavigate();
  return (
    <>
      <h5>{t('dockerCommandTitle')}</h5>
      <div className="flex flex-row justify-between gap-2 mt-4">
        <ul
          data-testid="docker-command-list"
          className="list-disc break-words w-1/2"
        >
          {app.spec?.command?.map((command, index) => (
            <li key={index} className="ml-8 text-sm">
              {command}
            </li>
          ))}
        </ul>
        <Button
          data-testid="update-docker-command-button"
          size="sm"
          mode="outline"
          onClick={() => navigate('./update-docker-command')}
        >
          <span>{t('modifyLabel')}</span>
          <Pen className="ml-2 size-4" />
        </Button>
      </div>
    </>
  );
};

export default DockerCommand;
