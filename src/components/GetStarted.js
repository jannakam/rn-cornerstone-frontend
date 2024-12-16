import React, { useState } from "react";
import { ScrollView } from "react-native";
import { ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { XStack, YStack, Text, Button, Select, Switch, Sheet, Adapt, LinearGradient } from "tamagui";

const GetStarted = () => {
  const [isMetric, setIsMetric] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  // Generate height options (4ft/120cm to 7ft/215cm)
  const heightOptions = isMetric
    ? Array.from({ length: 96 }, (_, i) => ({
        value: `${i + 120}`,
        label: `${i + 120} cm`,
      }))
    : Array.from({ length: 37 }, (_, i) => ({
        value: `${i + 48}`,
        label: `${i + 48} in`,
      }));

  // Generate weight options (80lb/35kg to 300lb/135kg)
  const weightOptions = isMetric
    ? Array.from({ length: 101 }, (_, i) => ({
        value: `${i + 35}`,
        label: `${i + 35} kg`,
      }))
    : Array.from({ length: 221 }, (_, i) => ({
        value: `${i + 80}`,
        label: `${i + 80} lb`,
      }));

  // Generate age options (16-100 years)
  const ageOptions = Array.from({length: 85}, (_, i) => ({
    value: `${i + 16}`,
    label: `${i + 16} years`
  }))

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#1A1A1A" }}>
      <YStack padding="$4" space="$4" width="100%" minHeight="100%">
        <XStack padding="$4">
          <Text color="#333" fontSize={50}>
            ×
          </Text>
        </XStack>

        <YStack space="$6" marginTop="$8">
          <Text
            color="white"
            fontSize={32}
            fontWeight="bold"
            textAlign="center"
            marginBottom="$4"
          >
            Get Started
          </Text>

          <Text color="gray" fontSize={14} textAlign="center" marginBottom="$8">
            Input your height and weight to get accurate measurements of
            calories burnt!
          </Text>

          <YStack space="$4" marginTop="$4">
            <Select
              value={height}
              onValueChange={setHeight}
              disablePreventBodyScroll
            >
              <Select.Trigger width="100%" backgroundColor="#2A2A2A" borderColor="#333" padding="$3" iconAfter={ChevronDown}>
                <Select.Value placeholder="Height" color="white" />
              </Select.Trigger>

              <Adapt when="sm" platform="touch">
                <Sheet modal dismissOnSnapToBottom>
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay 
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['$background', 'transparent']}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>

                <Select.Viewport minWidth={200}>
                  <Select.Group>
                    {heightOptions.map((item, i) => (
                      <Select.Item
                        index={i}
                        key={item.value}
                        value={item.value}
                      >
                        <Select.ItemText color="white">{item.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['transparent', '$background']}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>

            <Select
              value={weight}
              onValueChange={setWeight}
              disablePreventBodyScroll
            >
              <Select.Trigger width="100%" backgroundColor="#2A2A2A" borderColor="#333" padding="$3" iconAfter={ChevronDown}>
                <Select.Value placeholder="Weight" color="white" />
              </Select.Trigger>

              <Adapt when="sm" platform="touch">
                <Sheet modal dismissOnSnapToBottom>
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay 
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['$background', 'transparent']}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>

                <Select.Viewport minWidth={200}>
                  <Select.Group>
                    {weightOptions.map((item, i) => (
                      <Select.Item
                        index={i}
                        key={item.value}
                        value={item.value}
                      >
                        <Select.ItemText color="white">{item.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['transparent', '$background']}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>

            <Select
              value={age}
              onValueChange={setAge}
              disablePreventBodyScroll
            >
              <Select.Trigger width="100%" backgroundColor="#2A2A2A" borderColor="#333" padding="$3" iconAfter={ChevronDown}>
                <Select.Value placeholder="Age" color="white" />
              </Select.Trigger>

              <Adapt when="sm" platform="touch">
                <Sheet modal dismissOnSnapToBottom>
                  <Sheet.Frame>
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Overlay 
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>

              <Select.Content zIndex={200000}>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronUp size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['$background', 'transparent']}
                    borderRadius="$4"
                  />
                </Select.ScrollUpButton>

                <Select.Viewport minWidth={200}>
                  <Select.Group>
                    {ageOptions.map((item, i) => (
                      <Select.Item
                        index={i}
                        key={item.value}
                        value={item.value}
                      >
                        <Select.ItemText color="white">{item.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>

                <Select.ScrollDownButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3"
                >
                  <YStack zIndex={10}>
                    <ChevronDown size={20} />
                  </YStack>
                  <LinearGradient
                    start={[0, 0]}
                    end={[0, 1]}
                    fullscreen
                    colors={['transparent', '$background']}
                    borderRadius="$4"
                  />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select>

            <XStack alignItems="center" justifyContent="space-between" paddingVertical="$2">
              <Text color="gray" fontSize={14}>ft/lb</Text>
              <Switch
                backgroundColor="#333"
                size="$3"
                checked={isMetric}
                onCheckedChange={(checked) => {
                  setIsMetric(checked)
                  setHeight('')
                  setWeight('')
                }}
              >
                <Switch.Thumb animation="quick" />
              </Switch>
            </XStack>

            <Button 
              backgroundColor="#333"
              color="white"
              size="$4"
              marginTop="$6"
            >
              Start Earning!
            </Button>

            <Text 
              color="gray" 
              fontSize={12} 
              textAlign="center"
              marginTop="$4"
              marginBottom="$4"
            >
              By confirming you agree to all <Text color="white">terms</Text>
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default GetStarted;
