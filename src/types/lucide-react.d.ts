declare module 'lucide-react' {
  import * as React from 'react';

  export type LucideProps = React.SVGProps<SVGSVGElement> & {
    color?: string;
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  };

  export type LucideIcon = React.FC<LucideProps>;

  // Original icons
  export const AlertTriangle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Clock: LucideIcon;
  export const Cloud: LucideIcon;
  export const CloudLightning: LucideIcon;
  export const CloudRain: LucideIcon;
  export const CloudSnow: LucideIcon;
  export const Droplets: LucideIcon;
  export const Leaf: LucideIcon;
  export const LocateFixed: LucideIcon;
  export const MapPin: LucideIcon;
  export const Recycle: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Sun: LucideIcon;
  export const Tag: LucideIcon;
  export const Thermometer: LucideIcon;
  export const Trash2: LucideIcon;
  export const Wind: LucideIcon;

  // UrbanSync demo icons
  export const ArrowRightLeft: LucideIcon;
  export const Box: LucideIcon;
  export const DollarSign: LucideIcon;
  export const Navigation: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Truck: LucideIcon;
}
