import { Route, Routes } from 'react-router-dom';
import ListingPage from '@/pages/list/List.page';
import OnBoardingPage from '@/pages/onboarding/OnBoarding.page';

export default function OnBoardingListPage() {
  return (
    <div>
      OnBoardingListPage
      <Routes>
        <Route path={'/'} Component={ListingPage}></Route>
        <Route path={'/onboarding'} Component={OnBoardingPage}></Route>
      </Routes>
    </div>
  );
}
