import icons from '@/../public/assets/icons.data.json';

interface IconProps {
  name: keyof typeof icons;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = '', size = 24 }: IconProps) {
  const iconSvg = icons[name as keyof typeof icons];

  if (!iconSvg) {
    return null;
  }

  return (
    <img
      src={iconSvg}
      alt={name}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
