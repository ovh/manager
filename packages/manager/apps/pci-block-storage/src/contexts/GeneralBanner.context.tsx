import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

type BannerName = string;
type BannerValue = FC<{ onRemove: () => void }> | null;

type TGeneralBannerValue = {
  addBanner: (name: BannerName, bannerContent: BannerValue) => void;
  getBanner: (name: BannerName) => JSX.Element | null;
};

const GeneralBannerContext = createContext<TGeneralBannerValue>({
  addBanner: () => {},
  getBanner: () => null,
});

export const GeneralBannerContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [banners, setBanners] = useState({});

  const removeBanner = (name: BannerName) =>
    setBanners((prev) => ({ ...prev, [name]: null }));

  const addBanner = (name: BannerName, bannerValue: BannerValue) => {
    setBanners((prev) => ({ [name]: bannerValue, ...prev }));
  };

  const getBanner = (name: BannerName) => {
    const BannerValue = banners[name];

    return BannerValue ? (
      <BannerValue onRemove={() => removeBanner(name)} />
    ) : null;
  };

  return (
    <GeneralBannerContext.Provider value={{ addBanner, getBanner }}>
      {children}
    </GeneralBannerContext.Provider>
  );
};

export const useGeneralBannerContext = () => useContext(GeneralBannerContext);
