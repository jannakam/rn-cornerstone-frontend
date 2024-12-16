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
  useTheme,
} from "tamagui";
import { ChevronDown, ChevronUp, Check, Play } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useChallenge } from "../context/ChallengeContext";

const ChallengeButton = ({ friends }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengeSteps, setChallengeSteps] = useState(null);
  const navigation = useNavigation();
  const theme = useTheme();
  const { activeChallenge, startChallenge } = useChallenge();

  const handleCreateChallenge = () => {
    if (!challengeSteps || !selectedFriends.length) return;
    
    const selectedFriend = friends.find(f => f.id === selectedFriends[0]);
    setIsOpen(false);
    
    startChallenge(selectedFriend, Number(challengeSteps));
    
    navigation.navigate('Friend Challenge');
  };

  if (activeChallenge) {
    return (
      <YStack ai="center" space="$2">
        <Avatar
          circular
          size="$6"
          borderWidth={2}
          borderColor={theme.cyan8.val}
          onPress={() => navigation.navigate('Friend Challenge')}
        >
          <Avatar.Fallback 
            backgroundColor={theme.cyan10.val}
            jc="center" 
            ai="center"
          >
            <YStack ai="center" jc="center">
              <Button 
                fontSize={8} 
                color={theme.color.val}
                icon={Play}
                backgroundColor={theme.cyan8.val}
                circular
                size="$6"
                onPress={() => navigation.navigate('Friend Challenge')}
              >
              </Button>
            </YStack>
          </Avatar.Fallback>
        </Avatar>
      </YStack>
    );
  }

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

            {/* Steps Selection */}
            <YStack space="$2">
              <Label fontSize={16} fontWeight="bold">Set Challenge Steps</Label>
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
                  <Sheet modal dismissOnSnapToBottom >
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
                      {[100, 1000, 5000, 10000, 15000, 20000, 25000].map((steps, i) => (
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
            <Text fontSize={14} fontWeight="600">Select a friend to challenge</Text>
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
                          return [friend.id];
                        } else {
                          return prev.filter((id) => id !== friend.id);
                        }
                      });
                    }}
                    disabled={
                      selectedFriends.length >= 1 &&
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
              onPress={handleCreateChallenge}
              theme="active"
              disabled={!challengeSteps || selectedFriends.length === 0}
              fontSize={14}
              backgroundColor={theme.background.val}
              borderColor={theme.color6.val}
              color={theme.color.val}
            >
              Start Challenge
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default ChallengeButton;
