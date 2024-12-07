// src/index.tsx
import React, { ReactNode } from 'react';
import {
  GuideProvider,
  useGuide,
  useSpotlight,
  useTooltip,
} from './GuideManager';

interface ReactNativeFieldsSpotlightProps {
  children: ReactNode;
}

const ReactNativeFieldsSpotlight: React.FC<ReactNativeFieldsSpotlightProps> = ({
  children,
}) => {
  return <GuideProvider>{children}</GuideProvider>;
};

export { ReactNativeFieldsSpotlight, useGuide, useSpotlight, useTooltip };
