import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Code, docker } from '@datatr-ux/uxlib';
import { Pen } from 'lucide-react';
import { useAppData } from '../../App.context';

const DockerCommand = () => {
  const { app } = useAppData();
  const { t } = useTranslation('ai-tools/apps/app/dashboard');
  const navigate = useNavigate();
  return (
    <>
      <h5 className="mb-2">{t('dockerCommandTitle')}</h5>
      {app.spec?.command.length === 0 ? (
        <Button
          data-testid="update-docker-command-button"
          size="sm"
          mode="outline"
          onClick={() => navigate('./update-docker-command')}
        >
          <span>{t('addLabel')}</span>
          <Pen className="ml-2 size-4" />
        </Button>
      ) : (
        <Code
          className="text-sm"
          label={
            <div className="flex justify-end w-full">
              <Button
                size="xs"
                variant="neutral"
                className="bg-neutral-700 hover:bg-neutral-800"
                onClick={() => navigate('./update-docker-command')}
              >
                <Pen className="size-3 mr-1" />
                {t('modifyLabel')}
              </Button>
            </div>
          }
          code={app.spec?.command.join(' ')}
          lang={docker}
        ></Code>
      )}
    </>
  );
};

export default DockerCommand;
