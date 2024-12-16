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
import { participateInFriendChallenge } from "../api/Auth";

const ChallengeButton = ({ friends }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengeSteps, setChallengeSteps] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChallenge = async () => {
    try {
      setIsLoading(true);
      // You might need to adjust the challengeId based on your API requirements
      const challengeId = 1; // This should come from your API or be generated
      await participateInFriendChallenge(challengeId, selectedFriends);
      setIsOpen(false);
      // Reset selections
      setSelectedFriends([]);
      setChallengeSteps(null);
    } catch (error) {
      console.error("Error creating challenge:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Text fontSize={20} fontWeight="bold">
              Create Challenge
            </Text>

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

                <Select.Content>
                  <Select.ScrollUpButton>
                    <ChevronUp size={20} />
                  </Select.ScrollUpButton>

                  <Select.Viewport>
                    <Select.Group>
                      {[5000, 10000, 15000, 20000, 25000].map((steps, i) => (
                        <Select.Item
                          index={i}
                          key={steps}
                          value={String(steps)}
                        >
                          <Select.ItemText>
                            {steps.toLocaleString()} steps
                          </Select.ItemText>
                          <Select.ItemIndicator>
                            <Check size={16} />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Viewport>

                  <Select.ScrollDownButton>
                    <ChevronDown size={20} />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select>
            </YStack>

            {/* Friends Selection */}
            <YStack space="$2">
              <Text fontSize={14} fontWeight="600">
                Select up to 4 friends ({selectedFriends.length}/4)
              </Text>
              <ScrollView maxHeight={300}>
                {friends?.map((friend) => (
                  <XStack
                    key={friend.id}
                    space="$4"
                    padding="$3"
                    alignItems="center"
                    backgroundColor="$background"
                    borderRadius="$4"
                    marginVertical="$1"
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
                      <Avatar.Image
                        source={{
                          uri: "https://github.com/hello-world.png",
                        }}
                      />
                      <Avatar.Fallback backgroundColor="$blue10" />
                    </Avatar>

                    <YStack>
                      <Text fontSize={16} fontWeight="500">
                        {friend.username}
                      </Text>
                      {friend.city && (
                        <Text fontSize={12} color="$gray10">
                          {friend.city}
                        </Text>
                      )}
                    </YStack>
                  </XStack>
                ))}
              </ScrollView>
            </YStack>

            <Button
              onPress={handleCreateChallenge}
              theme="active"
              disabled={
                !challengeSteps || selectedFriends.length === 0 || isLoading
              }
              fontSize={14}
            >
              {isLoading ? "Creating..." : "Create Challenge"}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default ChallengeButton;
