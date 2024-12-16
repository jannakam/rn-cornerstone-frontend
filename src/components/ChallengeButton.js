import React, { useState } from "react";
import {
  YStack,
  Avatar,
  Text,
  Sheet,
  Label,
  Select,
  Button,
  XStack,
  ScrollView,
  Checkbox,
  LinearGradient,
  Adapt,
} from "tamagui";
import { ChevronDown, ChevronUp, Check } from "@tamagui/lucide-icons";

const ChallengeButton = ({ friends }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengeSteps, setChallengeSteps] = useState(null);

  return (
    <YStack ai="center" space="$2">
      <Avatar
        circular
        size="$6"
        borderWidth={1}
        borderColor="$color"
        onPress={() => setIsOpen(true)}
      >
        <Avatar.Fallback backgroundColor="transparent" jc="center" ai="center">
          <YStack ai="center" jc="center">
            <Button unstyled fontSize={8} color="$color">
              Challenge
            </Button>
          </YStack>
        </Avatar.Fallback>
      </Avatar>

      <Sheet
        modal
        open={isOpen}
        onOpenChange={setIsOpen}
        snapPoints={[85]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <YStack padding="$4" space="$4">
            <Text fontSize={11}>Challenge</Text>

            {/* Steps Selection */}
            <YStack space="$2">
              <Label fontSize={14}>Set Challenge Steps</Label>
              <Select
                value={String(challengeSteps)}
                onValueChange={(val) => setChallengeSteps(Number(val))}
                disablePreventBodyScroll
              >
                <Select.Trigger
                  width="100%"
                  backgroundColor="$background"
                  borderColor="$color4"
                  padding="$3"
                  iconAfter={ChevronDown}
                >
                  <Select.Value
                    placeholder="Select target steps"
                    color="$color"
                    fontSize={16}
                  />
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

                <Select.Content
                  zIndex={200000}
                  backgroundColor="$background"
                  borderWidth={1}
                  borderColor="$color4"
                  overflow="hidden"
                >
                  <Select.ScrollUpButton
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    width="100%"
                    height="$3"
                    backgroundColor="$background"
                  >
                    <YStack zIndex={10}>
                      <ChevronUp size={20} color="$color" />
                    </YStack>
                    <LinearGradient
                      start={[0, 0]}
                      end={[0, 1]}
                      fullscreen
                      colors={["$background", "transparent"]}
                      borderRadius="$4"
                    />
                  </Select.ScrollUpButton>

                  <Select.Viewport minWidth={200} backgroundColor="$background">
                    <Select.Group>
                      {[5000, 10000, 15000, 20000, 25000].map((steps, i) => (
                        <Select.Item
                          index={i}
                          key={steps}
                          value={String(steps)}
                          backgroundColor="$background"
                          hoverStyle={{
                            backgroundColor: "$color4",
                          }}
                          pressStyle={{
                            backgroundColor: "$color5",
                          }}
                        >
                          <Select.ItemText color="$color" fontSize={16}>
                            {steps.toLocaleString()} steps
                          </Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={16} color="$color" />
                          </Select.ItemIndicator>
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
                    backgroundColor="$background"
                  >
                    <YStack zIndex={10}>
                      <ChevronDown size={20} color="$color" />
                    </YStack>
                    <LinearGradient
                      start={[0, 0]}
                      end={[0, 1]}
                      fullscreen
                      colors={["transparent", "$background"]}
                      borderRadius="$4"
                    />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select>
            </YStack>

            {/* Friends Selection */}
            <Text fontSize={14} fontWeight="600">Select up to 4 friends</Text>
            <ScrollView>
              {friends.map((friend) => (
                <XStack
                  key={friend.id}
                  space="$4"
                  padding="$3"
                  alignItems="center"
                >
                  <Checkbox
                    checked={selectedFriends.includes(friend.id)}
                    onCheckedChange={(checked) => {
                      setSelectedFriends((prev) => {
                        if (checked) {
                          if (prev.length >= 4) return prev;
                          return [...prev, friend.id];
                        } else {
                          return prev.filter((id) => id !== friend.id);
                        }
                      });
                    }}
                    disabled={
                      selectedFriends.length >= 4 &&
                      !selectedFriends.includes(friend.id)
                    }
                  >
                    <Checkbox.Indicator>
                      <Check />
                    </Checkbox.Indicator>
                  </Checkbox>

                  <Avatar circular size="$4">
                    <Avatar.Image source={{ uri: friend.avatar }} />
                    <Avatar.Fallback backgroundColor="$blue10" />
                  </Avatar>

                  <Text fontSize={16}>{friend.name}</Text>
                </XStack>
              ))}
            </ScrollView>

            <Button
              onPress={() => setIsOpen(false)}
              theme="active"
              disabled={!challengeSteps || selectedFriends.length === 0}
              fontSize={14}
            >
              Create Challenge
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default ChallengeButton;
