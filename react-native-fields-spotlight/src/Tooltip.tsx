// src/Tooltip.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TooltipProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  position: Position | null;
  ttStyle: object;
}

const Tooltip: React.FC<TooltipProps> = ({
  isVisible,
  onClose,
  message,
  position,
  ttStyle = {},
}) => {
  if (!position) return null;

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View
            style={[
              styles.tooltip,
              { top: position.y + position.height + 10, left: position.x },
              ttStyle,
            ]}
          >
            <Text style={styles.message}>{message}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    borderRadius: 5,
    maxWidth: 200,
  },
  message: {
    color: '#000',
  },
});

export default Tooltip;
