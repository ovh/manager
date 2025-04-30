import React from 'react';

export const ByoipContext = React.createContext<{
  ipRir: string;
  setIpRir: React.Dispatch<React.SetStateAction<string>>;
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  ipRange: string;
  setIpRange: React.Dispatch<React.SetStateAction<string>>;
  as: string;
  setAs: React.Dispatch<React.SetStateAction<string>>;
}>({
  ipRir: '',
  setIpRir: () => {},
  selectedRegion: '',
  setSelectedRegion: () => {},
  ipRange: '',
  setIpRange: () => {},
  as: '',
  setAs: () => {},
});

export const ByoipContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [ipRir, setIpRir] = React.useState<string>('');
  const [selectedRegion, setSelectedRegion] = React.useState<string>('');
  const [ipRange, setIpRange] = React.useState<string>('');
  const [as, setAs] = React.useState<string>('');

  const value = React.useMemo(
    () => ({
      ipRir,
      setIpRir,
      selectedRegion,
      setSelectedRegion,
      ipRange,
      setIpRange,
      as,
      setAs,
    }),
    [
      ipRir,
      setIpRir,
      selectedRegion,
      setSelectedRegion,
      ipRange,
      setIpRange,
      as,
      setAs,
    ],
  );

  return (
    <ByoipContext.Provider value={value}>{children}</ByoipContext.Provider>
  );
};
