import { useState, useEffect, useCallback } from 'react';
import { SLIDE_ANIMATION_INTERVAL } from '@/constants';

export const SLIDE_IMAGES = [
  '/assets/creating/Hero16-9_Data_ADP.png',
  '/assets/creating/Hero16-9_Orchestration_Ks8.png',
  '/assets/creating/Hero16-9_Orchestration_PrivateImageCatalogue.png',
  '/assets/creating/Hero16-9_Stockage_BlockStorage.png',
  '/assets/creating/Hero16-9_Stockage_CloudArchive.png',
  '/assets/creating/Hero16-9_Stockage_InstanceBackup.png',
  '/assets/creating/Hero16-9_Stockage_ObjectStorage.png',
  '/assets/creating/Hero16-9_Stockage_SnapshotVolume.png',
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
