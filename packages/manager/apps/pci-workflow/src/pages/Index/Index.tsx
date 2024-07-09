import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ListPage } from '@/pages/Index/List.page';
import { OnboardingPage } from '@/pages/Index/Onboarding.page';
import { DeletePage } from '@/pages/Delete.page';

export const IndexPage = () => {
  const [ready, setReady] = useState<boolean>(false);
  const [items, setItems] = useState<Array<number>>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready) {
      if (location.pathname.includes('onboarding') && items.length > 0) {
        navigate('../workflow', { relative: 'path' });
      } else if (
        !location.pathname.includes('onboarding') &&
        items.length === 0
      ) {
        navigate('onboarding');
      }
    }
  }, [location.pathname, ready]);

  useEffect(() => {
    const hasItems = true;
    setTimeout(() => {
      setItems(hasItems ? [1, 2, 3] : []);
      setReady(true);
    }, 1000);
  }, []);

  return (
    <>
      {ready ? (
        <Routes>
          <Route path="*">
            {items.length ? (
              <Route path="*" element={<ListPage />}>
                <Route path="delete" element={<DeletePage />} />
              </Route>
            ) : (
              <Route path="onboarding" element={<OnboardingPage />} />
            )}
            <Route path="*" element={<>Not found page</>} />
          </Route>
        </Routes>
      ) : (
        <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
      )}
    </>
  );
};
