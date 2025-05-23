import React from 'react';

export const ByoipContext = React.createContext<{
  ipRir: string;
  setIpRir: React.Dispatch<React.SetStateAction<string>>;
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  selectedToken: string;
  setSelectedToken: React.Dispatch<React.SetStateAction<string>>;
  ipRange: string;
  setIpRange: React.Dispatch<React.SetStateAction<string>>;
  asType: string;
  setAsType: React.Dispatch<React.SetStateAction<string>>;
  asOwnRirType: string;
  setAsOwnRirType: React.Dispatch<React.SetStateAction<string>>;
  asOwnNumberType: number;
  setAsOwnNumberType: React.Dispatch<React.SetStateAction<number>>;
}>({
  ipRir: '',
  setIpRir: () => {},
  selectedRegion: '',
  setSelectedRegion: () => {},
  selectedToken: '',
  setSelectedToken: () => {},
  ipRange: '',
  setIpRange: () => {},
  asType: '',
  setAsType: () => {},
  asOwnRirType: '',
  setAsOwnRirType: () => {},
  asOwnNumberType: 0,
  setAsOwnNumberType: () => {},
});

export const ByoipContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [ipRir, setIpRir] = React.useState<string>('');
  const [selectedRegion, setSelectedRegion] = React.useState<string>('');
  const [selectedToken, setSelectedToken] = React.useState<string>('');
  const [ipRange, setIpRange] = React.useState<string>('');
  const [asType, setAsType] = React.useState<string>('');
  const [asOwnRirType, setAsOwnRirType] = React.useState<string>('');
  const [asOwnNumberType, setAsOwnNumberType] = React.useState<number>();
  const value = React.useMemo(
    () => ({
      ipRir,
      setIpRir,
      selectedRegion,
      setSelectedRegion,
      selectedToken,
      setSelectedToken,
      ipRange,
      setIpRange,
      asType,
      setAsType,
      asOwnRirType,
      setAsOwnRirType,
      asOwnNumberType,
      setAsOwnNumberType,
    }),
    [
      ipRir,
      selectedRegion,
      selectedToken,
      ipRange,
      asType,
      asOwnRirType,
      asOwnNumberType,
    ],
  );

  return (
    <ByoipContext.Provider value={value}>{children}</ByoipContext.Provider>
  );
};
