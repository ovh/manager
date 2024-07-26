import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import errorImgSrc from '@/../public/assets/oops.png';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

const ErrorBoundary = () => {
  const error = useRouteError();
  const { t } = useTranslation('error');
  const nav = useNavigation();

  const navigateToHomepage = () => {
    nav.navigateTo('public-cloud', '', {});
  };
  const reloadPage = () => {
    nav.reload();
  };

  if (error instanceof Error) {
    return (
      <div
        style={{
          backgroundColor: '#F5FEFF',
        }}
        className="w-auto h-screen overflow-auto flex justify-center"
      >
        <div className="bg-white w-3/5 h-100 p-6 md:p-12">
          <div className="text-center mb-3">
            <img src={errorImgSrc} alt="" className="mw-100 inline mb-4" />
          </div>
          <h2>{t('manager_error_page_title')}</h2>
          <Alert variant={'error'} className="mt-4 mb-4">
            <AlertDescription>
              <p className="text-red-500">{t('manager_error_page_default')}</p>
              <p className="text-red-500 font-semibold">{error.message}</p>
              {'xOvhQueryId' in error && (
                <p className="text-red-500 font-semibold">
                  {t('manager_error_page_detail_code', {
                    code: error.xOvhQueryId,
                  })}
                </p>
              )}
            </AlertDescription>
          </Alert>

          <div className="flex flex-col items-stretch md:items-center md:flex-row justify-end gap-2">
            <Button
              variant={'ghost'}
              size={'sm'}
              className="inline"
              onClick={() => navigateToHomepage()}
              data-testid="errorBoundaryGoToHomepage"
            >
              {t('manager_error_page_action_home_label')}
            </Button>
            <Button
              variant={'outline'}
              size={'sm'}
              className="inline"
              onClick={() => reloadPage()}
              data-testid="errorBoundaryReload"
            >
              {t('manager_error_page_action_reload_label')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};

export default ErrorBoundary;
