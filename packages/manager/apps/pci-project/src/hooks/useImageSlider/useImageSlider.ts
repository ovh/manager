import { useState, useEffect, useCallback } from 'react';
import { SLIDE_ANIMATION_INTERVAL } from '@/constants';

export const SLIDE_IMAGES = [
  'public/assets/creating/Hero16-9_Data_ADP.png',
  'public/assets/creating/Hero16-9_Orchestration_Ks8.png',
  'public/assets/creating/Hero16-9_Orchestration_PrivateImageCatalogue.png',
  'public/assets/creating/Hero16-9_Stockage_BlockStorage.png',
  'public/assets/creating/Hero16-9_Stockage_CloudArchive.png',
  'public/assets/creating/Hero16-9_Stockage_InstanceBackup.png',
  'public/assets/creating/Hero16-9_Stockage_ObjectStorage.png',
  'public/assets/creating/Hero16-9_Stockage_SnapshotVolume.png',
];

export const useImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= SLIDE_IMAGES.length - 1 ? 0 : prevIndex + 1,
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, SLIDE_ANIMATION_INTERVAL);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return {
    currentImage: SLIDE_IMAGES[currentIndex],
  };
};
