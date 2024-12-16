import React, { useState } from "react";
import {
  YStack,
  Avatar,
  Text,
  Sheet,
  H2,
  Label,
  Select,
  Button,
  XStack,
  ScrollView,
  Checkbox,
  LinearGradient,
  Adapt,
} from "tamagui";
import { Trophy, ChevronDown, ChevronUp, Check } from "@tamagui/lucide-icons";

const ChallengeButton = ({ friends }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengeSteps, setChallengeSteps] = useState(null);

  return (
    <YStack ai="center">
      <Avatar
        circular
        size="$6"
        borderWidth={1}
        borderColor="$color"
        onPress={() => setIsOpen(true)}
      >
        <Avatar.Fallback backgroundColor="transparent" jc="center" ai="center">
          <Trophy size={24} color="$color" />
        </Avatar.Fallback>
      </Avatar>
      <Text color="$color" fontSize={12} marginTop="$1">
        Challenge
      </Text>

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
            <H2>Create Challenge</H2>

            {/* Steps Selection */}
            <YStack space="$2">
              <Label>Set Challenge Steps</Label>
              <Select
                value={String(challengeSteps)}
                onValueChange={(val) => setChallengeSteps(Number(val))}
                disablePreventBodyScroll
              >
                <Select.Trigger
                  width="100%"
                  backgroundColor="$background"
                  borderColor="#333"
                  padding="$3"
                  iconAfter={ChevronDown}
                >
                  <Select.Value
                    placeholder="Select target steps"
                    color="$color"
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
                  borderColor="#333"
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
                      <ChevronUp size={20} color="white" />
                    </YStack>
                    <LinearGradient
                      start={[0, 0]}
                      end={[0, 1]}
                      fullscreen
                      colors={["#2A2A2A", "transparent"]}
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
                            backgroundColor: "#333",
                          }}
                          pressStyle={{
                            backgroundColor: "#404040",
                          }}
                        >
                          <Select.ItemText color="$color" fontSize={16}>
                            {steps.toLocaleString()} steps
                          </Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={16} color="white" />
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
                    backgroundColor="#2A2A2A"
                  >
                    <YStack zIndex={10}>
                      <ChevronDown size={20} color="white" />
                    </YStack>
                    <LinearGradient
                      start={[0, 0]}
                      end={[0, 1]}
                      fullscreen
                      colors={["transparent", "#2A2A2A"]}
                      borderRadius="$4"
                    />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select>
            </YStack>

            {/* Friends Selection */}
            <H2>Select up to 4 friends</H2>
            <ScrollView>
              {friends.map((friend) => (
                <XStack
                  key={friend.id}
                  space="$4"
                  padding="$2"
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

                  <Text>{friend.name}</Text>
                </XStack>
              ))}
            </ScrollView>

            <Button
              onPress={() => setIsOpen(false)}
              theme="active"
              disabled={!challengeSteps || selectedFriends.length === 0}
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
