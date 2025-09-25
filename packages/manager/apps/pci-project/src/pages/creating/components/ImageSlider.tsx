import { useImageSlider } from '../hooks/useImageSlider';

export default function ImageSlider() {
  const { currentImage } = useImageSlider();

  return (
    <img
      src={currentImage}
      alt="Public Cloud service"
      className="max-w-full max-h-full object-contain rounded-lg"
      style={{
        transition: 'opacity 1s ease-in-out',
        maxWidth: '300px',
        maxHeight: '200px',
      }}
    />
  );
}
