type BannerImage = {
  src: string;
  width: number;
  height: number;
};

type BannerImages = {
  default: BannerImage;
  responsive: BannerImage;
};

export type Banner = {
  alt: string;
  images: BannerImages;
  link: string;
  tracker: string;
};
