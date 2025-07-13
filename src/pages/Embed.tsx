import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SolarCalculator from '../SolarCalculator';

const Embed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const apiKey = searchParams.get('apiKey');

  if (!apiKey) {
    return <div>Fehler: API-Schlüssel nicht angegeben.</div>;
  }

  return <SolarCalculator apiKey={apiKey} />;
};

export default Embed; 