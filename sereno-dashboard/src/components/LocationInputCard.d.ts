import { FC } from 'react';

interface LocationInputCardProps {
  onSubmit: (from: string, to: string) => void;
}

declare const LocationInputCard: FC<LocationInputCardProps>;
export default LocationInputCard; 