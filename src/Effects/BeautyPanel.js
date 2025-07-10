// DEPENDENCY: Import React và components
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-community/picker";
import Slider from "@react-native-community/slider";
import EffectsConfig from "../Effects/EffectConfig";

// UI/UX: Component BeautyPanel để điều chỉnh beauty effects
const BeautyPanel = ({ onSelected, onSliderEnd }) => {
  // STATE: Quản lý trạng thái các cấp selection
  const [firstLevel, setFirstLevel] = useState("");
  const [secondLevel, setSecondLevel] = useState("");
  const [thirdLevel, setThirdLevel] = useState("");
  const [sliderValue, setSliderValue] = useState(0);

  // STATE: Lưu trữ các item đã chọn
  const [selectedFirstItem, setSelectedFirstItem] = useState(null);
  const [selectedSecondItem, setSelectedSecondItem] = useState(null);
  const [selectedThirdItem, setSelectedThirdItem] = useState(null);

  // FUNCTIONALITY: Xử lý thay đổi cấp 1
  const handleFirstLevelChange = (itemIndex) => {
    const selectedItem = EffectsConfig[itemIndex];
    setSelectedFirstItem(selectedItem);
    setFirstLevel(itemIndex.toString());
    
    // NOTE: Reset các cấp phụ thuộc
    setSecondLevel("");
    setThirdLevel("");
    setSelectedSecondItem(null);
    setSelectedThirdItem(null);
    setSliderValue(0);
  };

  // FUNCTIONALITY: Xử lý thay đổi cấp 2
  const handleSecondLevelChange = (itemIndex) => {
    if (!selectedFirstItem?.items) return;
    
    const selectedItem = selectedFirstItem.items[itemIndex];
    setSelectedSecondItem(selectedItem);
    setSecondLevel(itemIndex.toString());
    setThirdLevel("");
    setSelectedThirdItem(null);
    setSliderValue(selectedItem?.intensity ?? 0);
    
    // FEATURE: Gọi callback khi chọn item cấp 2
    if (selectedFirstItem && selectedItem) {
      onSelected(selectedFirstItem, selectedItem);
    }
  };
  // FUNCTIONALITY: Xử lý thay đổi cấp 3
  const handleThirdLevelChange = (itemIndex) => {
    if (!selectedSecondItem?.items) return;
    
    const selectedItem = selectedSecondItem.items[itemIndex];
    setSelectedThirdItem(selectedItem);
    setThirdLevel(itemIndex.toString());
    setSliderValue(selectedItem?.intensity ?? selectedSecondItem.intensity ?? 0);
    
    // FEATURE: Gọi callback khi chọn item cấp 3
    if (selectedSecondItem && selectedItem) {
      onSelected(selectedSecondItem, selectedItem);
    }
  };

  // FUNCTIONALITY: Xử lý thay đổi slider
  const handleSliderChange = (value) => {
    setSliderValue(value);
    
    // NOTE: Cập nhật intensity cho item đã chọn
    if (selectedSecondItem) {
      selectedSecondItem.intensity = value;
    }
    if (selectedThirdItem) {
      selectedThirdItem.intensity = value;
    }
  };

  // FUNCTIONALITY: Xử lý khi kết thúc kéo slider
  const handleSliderComplete = () => {
    if (selectedThirdItem && selectedSecondItem) {
      // FEATURE: Gọi callback cho cấp 2 và 3
      onSliderEnd(selectedSecondItem, selectedThirdItem, sliderValue);
    } else if (selectedFirstItem && selectedSecondItem) {
      // FEATURE: Gọi callback cho cấp 1 và 2
      onSliderEnd(selectedFirstItem, selectedSecondItem, sliderValue);
    }
  };

  // FUNCTIONALITY: Lấy range cho slider
  const getSliderRange = () => {
    if (selectedSecondItem?.range) {
      return selectedSecondItem.range;
    }
    return [0, 100];
  };

  return (
    <View style={styles.container}>
      {/* FEATURE: Slider điều chỉnh cường độ */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>
          Cường độ: {Math.round(sliderValue)}%
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={getSliderRange()[0]}
          maximumValue={getSliderRange()[1]}
          step={5}
          value={sliderValue}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor="#FF0050"
          maximumTrackTintColor="#rgba(255,255,255,0.3)"
          thumbStyle={styles.sliderThumb}
        />
      </View>

      {/* FEATURE: Picker cấp 1 - Nhóm chính */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Nhóm:</Text>
        <Picker
          selectedValue={firstLevel}
          style={styles.picker}
          onValueChange={handleFirstLevelChange}
          dropdownIconColor="#FF0050"
        >
          <Picker.Item label="Chọn nhóm..." value="" />
          {EffectsConfig.map((item, index) => (
            <Picker.Item 
              key={`group_${index}`} 
              label={item.name} 
              value={index} 
            />
          ))}
        </Picker>
      </View>

      {/* FEATURE: Picker cấp 2 - Hiệu ứng cụ thể */}
      {firstLevel !== "" && selectedFirstItem?.items && (
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Hiệu ứng:</Text>
          <Picker
            selectedValue={secondLevel}
            style={styles.picker}
            enabled={firstLevel !== ""}
            onValueChange={handleSecondLevelChange}
            dropdownIconColor="#FF0050"
          >
            <Picker.Item label="Chọn hiệu ứng..." value="" />
            {selectedFirstItem.items.map((item, index) => (
              <Picker.Item 
                key={`effect_${index}`} 
                label={item.name} 
                value={index} 
              />
            ))}
          </Picker>
        </View>
      )}

      {/* FEATURE: Picker cấp 3 - Kiểu dáng cụ thể (nếu có) */}
      {secondLevel !== "" && selectedSecondItem?.items && (
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Kiểu dáng:</Text>
          <Picker
            selectedValue={thirdLevel}
            style={styles.picker}
            enabled={secondLevel !== "" && !!selectedSecondItem?.items}
            onValueChange={handleThirdLevelChange}
            dropdownIconColor="#FF0050"
          >
            <Picker.Item label="Chọn kiểu dáng..." value="" />
            {selectedSecondItem.items.map((item, index) => (
              <Picker.Item 
                key={`style_${index}`} 
                label={item.name} 
                value={index} 
              />
            ))}
          </Picker>
        </View>
      )}

      {/* FEATURE: Nút reset */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          setFirstLevel("");
          setSecondLevel("");
          setThirdLevel("");
          setSliderValue(0);
          setSelectedFirstItem(null);
          setSelectedSecondItem(null);
          setSelectedThirdItem(null);
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.resetButtonText}>🔄 Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

// UI/UX: Styles cho BeautyPanel
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  slider: {
    height: 40,
    borderRadius: 20,
  },
  sliderThumb: {
    backgroundColor: '#FF0050',
    width: 20,
    height: 20,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#ffffff',
    height: 50,
  },
  resetButton: {
    backgroundColor: 'rgba(255,0,80,0.8)',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BeautyPanel;