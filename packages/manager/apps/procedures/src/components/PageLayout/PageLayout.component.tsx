import React, { FunctionComponent } from 'react';
import ovhCloudLogo from '@/assets/logo-ovhcloud.png';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const PageLayout: FunctionComponent<Props> = ({ children }) => (
  <div className="sm:container mx-auto px-6">
    <div className="md:py-12 p-6">
      <div className="inline-block pb-6 md:pb-12">
        <img src={ovhCloudLogo} alt="ovh-cloud-logo" className="app-logo" />
      </div>
      <div className="flex justify-center app-content lg:w-8/12 mx-auto min-h-[500px] sm:shadow sm:border-none border-t-[1px] border-gray-300 px-6">
        <div className="md:p-8 w-full">{children}</div>
      </div>
    </div>
  </div>
);
