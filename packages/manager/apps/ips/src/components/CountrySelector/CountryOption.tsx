import React from 'react';

export const CountryOption: React.FC<{
  countryName: string;
  countryCode: string;
}> = ({ countryName, countryCode }) => (
  <div className="flex gap-2 items-center">
    <span
      className="w-[22px] h-[16px] bg-cover mr-3"
      style={{
        backgroundImage: `url('flags/${countryCode?.toLowerCase()}.svg')`,
      }}
    />
    <span>{countryName}</span>
  </div>
);
