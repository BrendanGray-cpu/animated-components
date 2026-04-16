import * as LucideIcons from 'lucide-react';

// Map of Fabric icon names to lucide-react icons
const iconMap: Record<string, any> = {
  'sparkles-regular': LucideIcons.Sparkles,
  'sparkle-regular': LucideIcons.Sparkles,
  'pen-ruler-regular': LucideIcons.PenTool,
  'face-smile-regular': LucideIcons.Smile,
  'rotate-right-regular': LucideIcons.RotateCw,
  'angles-right-regular': LucideIcons.ChevronsRight,
  'angle-right-regular': LucideIcons.ChevronRight,
  'angle-left-regular': LucideIcons.ChevronLeft,
  'angles-left-regular': LucideIcons.ChevronsLeft,
  'circle-xmark-solid': LucideIcons.XCircle,
  'egg-solid': LucideIcons.Egg,
  'bird-solid': LucideIcons.Bird,
  'hand-solid': LucideIcons.Hand,
  'turtle-solid': LucideIcons.Turtle,
  'sparkle-solid': LucideIcons.Sparkles,
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 16, color }: IconProps) {
  const IconComponent = iconMap[name] || LucideIcons.Circle;

  // Map Fabric color names to actual colors
  const colorMap: Record<string, string> = {
    'neutral-forced-white': '#ffffff',
  };

  const actualColor = color && colorMap[color] ? colorMap[color] : color;

  return <IconComponent size={size} color={actualColor} />;
}
