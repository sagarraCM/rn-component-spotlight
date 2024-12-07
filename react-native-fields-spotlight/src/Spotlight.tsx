import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Text,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Target {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SpotlightProps {
  isVisible: boolean;
  onClose: () => void;
  target: Target | null;
  bgColor?: string | undefined;
  slText?: string;
  textColor?: string;
  fontSize?: number;
}

const Spotlight: React.FC<SpotlightProps> = ({
  isVisible,
  onClose,
  target,
  bgColor = 'rgba(0,0,0,0.6)',
  slText = 'Click anywhere to close',
  textColor = '#FFF',
  fontSize = 18,
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [animation, isVisible]);

  if (!target) return null;

  const spotlightStyle = {
    top: target.y,
    left: target.x,
    width: target.width,
    height: target.height,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.overlay, { opacity: animation }]}>
            <View style={{ backgroundColor: bgColor, height: target.y }}>
              <View
                style={{
                  backgroundColor: bgColor,
                  height: target.height,
                  top: target.y,
                  width: target.x,
                }}
              />
              <View style={[styles.spotlight, spotlightStyle]} />
              <View
                style={{
                  backgroundColor: bgColor,
                  height: target.height,
                  top: target.y - target.height,
                  left: target.width + target.x,
                }}
              />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/*Bottom overlay View */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={{
              height: height,
              backgroundColor: bgColor,
              width: width,
              top: target.height + target.y,
            }}
          />
        </TouchableWithoutFeedback>
        <Text
          numberOfLines={2}
          style={[
            styles.textStyle,
            {
              fontSize: fontSize,
              color: textColor,
              top:
                target.y < height / 2
                  ? target.y + target.height + 10
                  : target.y - 100,
              width: width,
            },
          ]}
        >
          {slText}
        </Text>
      </>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  spotlight: {
    position: 'absolute',
  },
  textStyle: { position: 'absolute', textAlign: 'left', padding: 16 },
});

export default Spotlight;
