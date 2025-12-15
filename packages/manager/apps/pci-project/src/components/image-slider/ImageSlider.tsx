import { useImageSlider } from '@/hooks/use-image-slider/useImageSlider';

export default function ImageSlider() {
  const { currentImage } = useImageSlider();

  return (
    <img
      src={currentImage}
      alt="Public Cloud service"
      className="max-h-full max-w-full rounded-lg object-contain"
      style={{
        transition: 'opacity 1s ease-in-out',
        maxWidth: '300px',
        maxHeight: '200px',
      }}
    />
  );
}
