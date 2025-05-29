// Environment variable types
interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_SPOTIFY_CLIENT_ID: string;
  readonly VITE_SPOTIFY_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Custom type declarations
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

// Component prop types
interface TrafficBreatherPromptButtonProps {
  onClick: () => void;
  className?: string;
}

interface LocationInputCardProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
  placeholder?: string;
  className?: string;
} 