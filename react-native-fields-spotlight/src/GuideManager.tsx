import React, {
  useState,
  createContext,
  useContext,
  useRef,
  useCallback,
} from 'react';
import Spotlight from './Spotlight';
import Tooltip from './Tooltip';
import { View } from 'react-native';
import type { ReactNode } from 'react';

// Define Position type
interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

// GuideContextProps defines the functions available in the context
interface GuideContextProps {
  showSpotlight: (
    targetPosition: Position,
    backgroundColor?: string,
    slText?: string,
    colorText?: string,
    sizeFont?: number
  ) => void;
  hideSpotlight: () => void;
  showTooltip: (message: string, position: Position, ttStyle?: object) => void;
  hideTooltip: () => void;
}

interface GuideProviderProps {
  children: ReactNode;
}

// Creating the context for Spotlight and Tooltip functionality
const GuideContext = createContext<GuideContextProps | undefined>(undefined);

// useSpotlight hook to measure and show spotlight
export const useSpotlight = () => {
  const { showSpotlight } = useGuide();
  const targetRef = useRef<View | null>(null); // Type ref to View for compatibility

  const showTargetSpotlight = useCallback(
    (
      backgroundColor?: string,
      slText?: string,
      colorText?: string,
      sizeFont?: number
    ) => {
      targetRef.current?.measure((fx, fy, width, height, px, py) => {
        const targetPosition: Position = { x: px, y: py, width, height };
        showSpotlight(
          targetPosition,
          backgroundColor,
          slText,
          colorText,
          sizeFont
        ); // Trigger the spotlight effect
      });
    },
    [showSpotlight]
  );

  return {
    targetRef, // Ref to be attached to the component you want to spotlight
    showTargetSpotlight, // Function to trigger the spotlight
  };
};

// useTooltip hook to measure and show tooltip
export const useTooltip = () => {
  const { showTooltip } = useGuide();
  const targetRef = useRef<View | null>(null); // Type ref to View for compatibility

  const showTargetTooltip = useCallback(
    (message: string, ttStyle?: object) => {
      targetRef.current?.measure((fx, fy, width, height, px, py) => {
        const position: Position = { x: px, y: py, width, height };
        showTooltip(message, position, ttStyle); // Trigger the tooltip effect
      });
    },
    [showTooltip]
  );

  return {
    targetRef, // Ref to be attached to the component you want to show the tooltip
    showTargetTooltip, // Function to trigger the tooltip
  };
};

// useGuide hook to consume the Guide context
export const useGuide = (): GuideContextProps => {
  const context = useContext(GuideContext);
  if (!context) {
    throw new Error('useGuide must be used within a GuideProvider');
  }
  return context;
};

// GuideProvider component to wrap your app and provide context
const GuideProvider: React.FC<GuideProviderProps> = ({ children }) => {
  const [spotlightVisible, setSpotlightVisible] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [spotlightTarget, setSpotlightTarget] = useState<Position | null>(null);
  const [tooltipMessage, setTooltipMessage] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<Position | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<any>(null);

  // Default styling for spotlight
  const [bgColor, setBgColor] = useState<string>('rgba(0,0,0,0.5)');
  const [spotlightText, setSpotlightText] = useState<string>(
    'Click anywhere to close...'
  );
  const [textColor, setTextColor] = useState<string>('#FFF');
  const [fontSize, setFontSize] = useState<number>(18);

  const showSpotlight = (
    targetPosition: Position,
    backgroundColor: string = bgColor,
    slText: string = spotlightText,
    colorText: string = textColor,
    sizeFont: number = fontSize
  ) => {
    setSpotlightTarget(targetPosition);
    setSpotlightVisible(true);
    setBgColor(backgroundColor);
    setSpotlightText(slText);
    setTextColor(colorText);
    setFontSize(sizeFont);
  };

  const hideSpotlight = () => {
    setSpotlightVisible(false);
    setSpotlightTarget(null);
  };

  const showTooltip = (
    message: string,
    position: Position,
    ttStyle: object = tooltipStyle
  ) => {
    setTooltipMessage(message);
    setTooltipPosition(position);
    setTooltipVisible(true);
    setTooltipStyle(ttStyle);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
    setTooltipMessage('');
    setTooltipPosition(null);
  };

  return (
    <GuideContext.Provider
      value={{
        showSpotlight,
        hideSpotlight,
        showTooltip,
        hideTooltip,
      }}
    >
      {children}
      <Spotlight
        isVisible={spotlightVisible}
        onClose={hideSpotlight}
        target={spotlightTarget}
        bgColor={bgColor}
        slText={spotlightText}
        textColor={textColor}
        fontSize={fontSize}
      />
      <Tooltip
        isVisible={tooltipVisible}
        onClose={hideTooltip}
        message={tooltipMessage}
        position={tooltipPosition}
        ttStyle={tooltipStyle}
      />
    </GuideContext.Provider>
  );
};

export { GuideProvider };
