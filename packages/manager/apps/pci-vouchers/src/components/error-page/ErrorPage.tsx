import { useTranslation } from 'react-i18next';
import { Button, Message, Text } from '@ovhcloud/ods-react';

import oopsImage from './oops.png';

type ErrorPageProps = {
  errorMessage?: string;
  xOvhQueryId?: string;
  reloadPage: () => void;
  navigateToHomepage: () => void;
};

export default function ErrorPage({
  errorMessage,
  xOvhQueryId,
  reloadPage,
  navigateToHomepage,
}: ErrorPageProps) {
  const { t } = useTranslation('error');

  return (
    <div
      style={{
        backgroundColor: '#F5FEFF',
      }}
      className="w-auto h-screen overflow-auto flex justify-center"
    >
      <div className="bg-white w-3/5 h-100 p-6 md:p-12">
        <div className="text-center mb-3">
          <img src={oopsImage} alt="" className="mw-100 inline mb-4" />
        </div>
        <Text preset="heading-4">{t('manager_error_page_title')}</Text>
        <Message color="critical" className="mt-4 mb-4">
          <div>
            <Text color="critical">{t('manager_error_page_default')}</Text>
            {errorMessage && (
              <>
                <br />
                <Text color="critical">{errorMessage}</Text>
              </>
            )}
            {xOvhQueryId && (
              <>
                <br />
                <Text color="critical">
                  {t('manager_error_page_detail_code', { code: xOvhQueryId })}
                </Text>
              </>
            )}
          </div>
        </Message>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            color="primary"
            size="sm"
            onClick={() => navigateToHomepage()}
          >
            {t('manager_error_page_action_home_label')}
          </Button>
          <Button
            variant="outline"
            color="primary"
            size="sm"
            onClick={() => reloadPage()}
          >
            {t('manager_error_page_action_reload_label')}
          </Button>
        </div>
      </div>
    </div>
  );
}
