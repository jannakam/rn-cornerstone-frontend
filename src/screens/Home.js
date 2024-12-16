import React, { useState } from "react";
import {
  YStack,
  XStack,
  Text,
  Card,
  Button,
  H2,
  Paragraph,
  Label,
  Avatar,
  ZStack,
  Sheet,
  Checkbox,
  Select,
  LinearGradient,
  Adapt,
  Input,
} from "tamagui";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import { useNavigation } from "@react-navigation/native";
import {
  Menu,
  Flame,
  Footprints,
  MapPin,
  Plus,
  ChevronRight,
  ChevronDown,
  BicepsFlexed,
  Trophy,
  Check,
  ChevronUp,
} from "@tamagui/lucide-icons";
import { TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import ActivityRings from "react-native-activity-rings";
import Header from "../components/Header";

const activityRingConfig = {
  width: 150,
  height: 150,
  ringSize: 10,
  radius: 32,
  padAngle: 0.02,
  cornerRadius: 5,
  startAngle: 0,
  endAngle: 2 * Math.PI,
  animationDuration: 1000,
  animated: true,
  labelFontSize: 24,
  valueFormatter: (value) => `${Math.round(value * 100)}%`,
};

const Home = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [challengeSteps, setChallengeSteps] = useState(null);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");

  const activityData = [
    {
      label: "ACTIVITY",
      value: 0.6,
      color: "lime",
      backgroundColor: "#000000",
      valueFormatter: (value) => `${Math.round(value * 100)}%`,
      labelFontSize: 24,
    },
    {
      value: 0.6,
      color: "violet",
      backgroundColor: "#000000",
      valueFormatter: (value) => `${Math.round(value * 100)}%`,
      labelFontSize: 24,
    },
    {
      label: "RINGS",
      value: 0.5,
      color: "cyan",
      backgroundColor: "#000000",
      valueFormatter: (value) => `${Math.round(value * 100)}%`,
      labelFontSize: 24,
    },
  ];

  const friends = [
    { id: 1, name: "Sarah Chen", avatar: "https://github.com/tamagui.png" },
    { id: 2, name: "Mike Johnson", avatar: "https://github.com/tamagui.png" },
    { id: 3, name: "Emma Wilson", avatar: "https://github.com/tamagui.png" },
    { id: 4, name: "James Smith", avatar: "https://github.com/tamagui.png" },
    { id: 5, name: "James Smith", avatar: "https://github.com/tamagui.png" },
    { id: 6, name: "James Smith", avatar: "https://github.com/tamagui.png" },
  ];

  const events = [
    {
      id: 1,
      name: "City Park Trail",
      steps: 8000,
      approx_distance: 5.2,
      latitude: 37.7749,
      longitude: -122.4194,
      checkpoints: [
        {
          id: 1,
          name: "Entrance Gate",
          points: 50,
          steps: 0,
          latitude: 37.7749,
          longitude: -122.4194,
          approx_distance: 0,
        },
        {
          id: 2,
          name: "Lake View",
          points: 100,
          steps: 2000,
          latitude: 37.775,
          longitude: -122.4195,
          approx_distance: 1.2,
        },
      ],
    },
    {
      id: 2,
      name: "Downtown Walk",
      steps: 6000,
      approx_distance: 3.8,
      latitude: 37.7833,
      longitude: -122.4167,
      checkpoints: [
        {
          id: 1,
          name: "Start Point",
          points: 50,
          steps: 0,
          latitude: 37.7833,
          longitude: -122.4167,
          approx_distance: 0,
        },
        {
          id: 2,
          name: "City Square",
          points: 100,
          steps: 1500,
          latitude: 37.7834,
          longitude: -122.4168,
          approx_distance: 0.8,
        },
      ],
    },
  ];

  const handleEventPress = (event) => {
    navigation.navigate("EventDetail", { location: event });
  };

  const handleViewAllPress = () => {
    navigation.navigate("Events");
  };

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />

        <YStack f={1} space="$4" margin="$2">
          <Card
            elevate
            size="$4"
            bordered
            animation="bouncy"
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            pressStyle={{ scale: 0.95 }}
            color="$background"
          >
            <Card.Header padded>
              <H2>Your daily activity summary</H2>
            </Card.Header>
            <Card.Footer padded>
              <YStack flex={1} jc="center" ai="center">
                <XStack>
                  <ActivityRings
                    data={activityData}
                    config={activityRingConfig}
                  />
                </XStack>

                <XStack space="$4" jc="space-between">
                  <XStack ai="center" jc="space-between" space="$2">
                    <Footprints size={18} color="$color" />
                    <Label color="$color" theme="alt2">
                      5647
                    </Label>
                  </XStack>
                  <XStack ai="center" jc="space-between" space="$2">
                    <Flame size={18} color="$color" />
                    <Label color="$color">1245</Label>
                  </XStack>
                  <XStack ai="center" jc="space-between" space="$2">
                    <MapPin size={18} color="$color" />
                    <Label color="$color" theme="alt2">
                      3.45km
                    </Label>
                  </XStack>
                </XStack>
              </YStack>
            </Card.Footer>
          </Card>

          <Card
            elevate
            size="$4"
            bordered
            animation="bouncy"
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            color="$background"
          >
            <Card.Header padded>
              <H2>Friends</H2>
            </Card.Header>
            <Card.Footer padded>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$4">
                  <YStack ai="center">
                    <Avatar
                      circular
                      size="$6"
                      borderWidth={1}
                      borderColor="$color"
                      onPress={() => setIsAddFriendOpen(true)}
                    >
                      <Avatar.Fallback
                        backgroundColor="transparent"
                        jc="center"
                        ai="center"
                      >
                        <Plus size={24} color="$color" />
                      </Avatar.Fallback>
                    </Avatar>
                    <Text color="$color" fontSize={12} marginTop="$1">
                      Add Friend
                    </Text>
                    <Sheet
                      modal
                      open={isAddFriendOpen}
                      onOpenChange={setIsAddFriendOpen}
                      snapPoints={[40]}
                      position={0}
                      dismissOnSnapToBottom
                    >
                      <Sheet.Overlay />
                      <Sheet.Frame>
                        <Sheet.Handle />
                        <YStack padding="$4" space="$4">
                          <H2>Add Friend</H2>

                          <YStack space="$2">
                            <Label htmlFor="username">Friend Username</Label>
                            <Input
                              id="username"
                              placeholder="Enter username"
                              value={friendUsername}
                              onChangeText={setFriendUsername}
                              backgroundColor="#2A2A2A"
                              borderColor="#333"
                              padding="$3"
                              color="white"
                            />
                          </YStack>

                          <Button
                            theme="active"
                            onPress={() => {
                              // Add your friend adding logic here
                              setIsAddFriendOpen(false);
                              setFriendUsername("");
                            }}
                            disabled={!friendUsername.trim()}
                          >
                            Add Friend
                          </Button>
                        </YStack>
                      </Sheet.Frame>
                    </Sheet>
                  </YStack>

                  <YStack ai="center">
                    <Avatar
                      circular
                      size="$6"
                      borderWidth={1}
                      borderColor="$color"
                      onPress={() => setIsOpen(true)}
                    >
                      <Avatar.Fallback
                        backgroundColor="transparent"
                        jc="center"
                        ai="center"
                      >
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

                          <YStack space="$2">
                            <Label>Set Challenge Steps</Label>
                            <Select
                              value={String(challengeSteps)}
                              onValueChange={(val) =>
                                setChallengeSteps(Number(val))
                              }
                              disablePreventBodyScroll
                            >
                              <Select.Trigger
                                width="100%"
                                backgroundColor="#2A2A2A"
                                borderColor="#333"
                                padding="$3"
                                iconAfter={ChevronDown}
                              >
                                <Select.Value
                                  placeholder="Select target steps"
                                  color="white"
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
                                backgroundColor="#2A2A2A"
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
                                  backgroundColor="#2A2A2A"
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

                                <Select.Viewport
                                  minWidth={200}
                                  backgroundColor="#2A2A2A"
                                >
                                  <Select.Group>
                                    {[5000, 10000, 15000, 20000, 25000].map(
                                      (steps, i) => (
                                        <Select.Item
                                          index={i}
                                          key={steps}
                                          value={String(steps)}
                                          backgroundColor="#2A2A2A"
                                          hoverStyle={{
                                            backgroundColor: "#333",
                                          }}
                                          pressStyle={{
                                            backgroundColor: "#404040",
                                          }}
                                        >
                                          <Select.ItemText
                                            color="white"
                                            fontSize={16}
                                          >
                                            {steps.toLocaleString()} steps
                                          </Select.ItemText>
                                          <Select.ItemIndicator marginLeft="auto">
                                            <Check size={16} color="white" />
                                          </Select.ItemIndicator>
                                        </Select.Item>
                                      )
                                    )}
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
                                        return prev.filter(
                                          (id) => id !== friend.id
                                        );
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
                                    source={{ uri: friend.avatar }}
                                  />
                                  <Avatar.Fallback backgroundColor="$blue10" />
                                </Avatar>

                                <Text>{friend.name}</Text>
                              </XStack>
                            ))}
                          </ScrollView>

                          <Button
                            onPress={() => setIsOpen(false)}
                            theme="active"
                            disabled={
                              !challengeSteps || selectedFriends.length === 0
                            }
                          >
                            Create Challenge
                          </Button>
                        </YStack>
                      </Sheet.Frame>
                    </Sheet>
                  </YStack>

                  {friends.map((friend) => (
                    <YStack key={friend.id} ai="center">
                      <Avatar circular size="$6">
                        <Avatar.Image source={{ uri: friend.avatar }} />
                        <Avatar.Fallback backgroundColor="$blue10" />
                      </Avatar>
                    </YStack>
                  ))}
                </XStack>
              </ScrollView>
            </Card.Footer>
          </Card>

          <Card
            elevate
            size="$4"
            bordered
            animation="bouncy"
            scale={0.9}
            hoverStyle={{ scale: 0.925 }}
            color="$background"
          >
            <Card.Header padded>
              <XStack jc="space-between" ai="center">
                <H2>Events</H2>
                <Button
                  size="$3"
                  variant="outlined"
                  onPress={handleViewAllPress}
                  iconAfter={ChevronRight}
                >
                  View all
                </Button>
              </XStack>
            </Card.Header>
            <Card.Footer padded>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space="$3">
                  {events.map((event) => (
                    <TouchableOpacity
                      key={event.id}
                      onPress={() => handleEventPress(event)}
                    >
                      <Card bordered size="$2">
                        <Card.Header padded>
                          <XStack jc="space-between" ai="center">
                            <Text fontSize={16} fontWeight="bold">
                              {event.name}{" "}
                            </Text>
                            <XStack space="$2" ai="center">
                              <Footprints size={16} color="$color" />
                              <Text>{event.steps}</Text>
                              <MapPin size={16} color="$color" />
                              <Text>{event.approx_distance}km</Text>
                            </XStack>
                          </XStack>
                        </Card.Header>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </ScrollView>
            </Card.Footer>
          </Card>
        </YStack>
      </YStack>
    </DrawerSceneWrapper>
  );
};

export default Home;
