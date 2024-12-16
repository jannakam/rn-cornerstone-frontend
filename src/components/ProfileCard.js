import React, { useState, useEffect } from "react";
import { Card, YStack, XStack, Text, Avatar, Button, Sheet, useTheme } from "tamagui";
import { History, ChevronRight, Store, Footprints, Flame, Edit2, Check, X } from "@tamagui/lucide-icons";
import { useNavigation } from '@react-navigation/native';
import { Platform, DeviceEventEmitter, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Predefined list of avatars
const avatarOptions = [
  { id: 1, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Felix" },
  { id: 2, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Aneka" },
  { id: 3, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Bailey" },
  { id: 4, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Charlie" },
  { id: 5, url: "https://api.dicebear.com/7.x/avataaars/png?seed=David" },
  { id: 6, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Eva" },
  { id: 7, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Finn" },
  { id: 8, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Grace" },
  { id: 9, url: "https://api.dicebear.com/7.x/avataaars/png?seed=Henry" },
];

const ProfileCard = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].url);

  useEffect(() => {
    // Load saved avatar on component mount
    const loadSavedAvatar = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem('userAvatar');
        if (savedAvatar) {
          setSelectedAvatar(savedAvatar);
        }
      } catch (error) {
        console.log('Error loading avatar:', error);
      }
    };
    loadSavedAvatar();
  }, []);

  const handleAvatarSelect = async (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
    try {
      await AsyncStorage.setItem('userAvatar', avatarUrl);
      // Emit event for avatar change
      DeviceEventEmitter.emit('avatarChanged', { avatarUrl });
    } catch (error) {
      console.log('Error saving avatar:', error);
    }
    setIsAvatarModalOpen(false);
  };

  const navigateToStore = () => {
    navigation.navigate('Store', {
      animation: 'slide_from_right',
      ...Platform.select({
        ios: {
          options: {
            transitionSpec: {
              open: {
                animation: 'spring',
                config: {
                  stiffness: 1000,
                  damping: 500,
                  mass: 3,
                  overshootClamping: true,
                  restDisplacementThreshold: 0.01,
                  restSpeedThreshold: 0.01,
                }
              },
              close: {
                animation: 'spring',
                config: {
                  stiffness: 1000,
                  damping: 500,
                  mass: 3,
                }
              }
            }
          }
        },
        android: {
          options: {
            animation: 'slide_from_right',
            animationDuration: 300,
          }
        }
      })
    });
  };

  return (
    <>
      <Card
        elevate
        size="$4"
        bordered
        animation="bouncy"
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        color="$background"
        borderColor="$color4"
        bw={1}
      >
        <Card.Header padded>
          <XStack jc="space-between" ai="center">
            <Text color="$color" fontSize="$8" fontWeight="bold">
              Fulan Al-Fulani
            </Text>
            <Button
              size="$3"
              variant="outlined"
              onPress={navigateToStore}
              icon={Store}
              borderRadius="$10"
              bw={1}
              backgroundColor="$background"
              borderColor={theme.color8.val}
              color={theme.color.val}
            >Store</Button>
          </XStack>
        </Card.Header>

        <Card.Footer padded f={1} pt="$0">
          <YStack space="$5" width="100%">
            <XStack space="$2">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack space="$2" ai="center">
                  <Button
                    size="$3"
                    variant="outlined"
                    icon={Footprints}
                    borderRadius="$10"
                    bw={1}
                    backgroundColor="$background"
                    borderColor={theme.magenta7.val}
                    color={theme.magenta7.val}
                  >
                    99999 KM walked
                  </Button>
                  <Button
                    size="$3" 
                    variant="outlined"
                    icon={Flame}
                    borderRadius="$10"
                    bw={1}
                    backgroundColor="$background"
                    borderColor={theme.cyan8.val}
                    color={theme.cyan8.val}
                  >
                    2657Cal burned!
                  </Button>
                </XStack>
              </ScrollView>
            </XStack>

            {/* Centered Avatar */}
            <YStack ai="center" space="$4">
              <Avatar circular size="$10" backgroundColor={theme.cyan10.val}>
                <Avatar.Image
                  source={{ uri: selectedAvatar }}
                />
                <Avatar.Fallback backgroundColor={theme.cyan10.val} />
              </Avatar>
              <Button
                size="$2"
                borderRadius="$10"
                backgroundColor="$background"
                color={theme.color.val}
                onPress={() => setIsAvatarModalOpen(true)}
              >
                Edit Avatar
              </Button>
            </YStack>

            {/* Points Section */}
            <YStack ai="center" jc="center">
              <Text color={theme.color11.val} fontSize="$3">
                Total points:
              </Text>
              <Text color="$color" fontSize="$9" fontWeight="bold">
                7632
              </Text>
            </YStack>
          </YStack>
        </Card.Footer>
      </Card>

      {/* Avatar Selection Sheet */}
      <Sheet
        forceRemoveScrollEnabled={isAvatarModalOpen}
        modal={true}
        open={isAvatarModalOpen}
        onOpenChange={setIsAvatarModalOpen}
        snapPoints={[85]}
        dismissOnSnapToBottom={true}
        zIndex={100000}
        animation="medium"
      >
        <Sheet.Overlay />
        <Sheet.Frame 
          backgroundColor="$background"
          f={1}
          padding="$4"
          space="$4"
        >
          <Sheet.Handle />
          <YStack f={1} space="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$2" ai="center">
                <Text color="$color" fontSize="$6" fontWeight="bold">
                  Choose Avatar
                </Text>
              </XStack>
              <Button
                size="$3"
                variant="outlined"
                icon={X}
                circular
                bw={1}
                backgroundColor="$background"
                borderColor={theme.color8.val}
                color={theme.color.val}
                onPress={() => setIsAvatarModalOpen(false)}
              />
            </XStack>
            
            <YStack f={1} jc="center">
              <XStack flexWrap="wrap" gap="$4" jc="center">
                {avatarOptions.map((avatar) => (
                  <Button
                    key={avatar.id}
                    size="$6"
                    circular
                    backgroundColor="$background"
                    borderColor={selectedAvatar === avatar.url ? theme.cyan8.val : theme.color4.val}
                    borderWidth={2}
                    pressStyle={{ scale: 0.95 }}
                    onPress={() => handleAvatarSelect(avatar.url)}
                  >
                    <Avatar circular size="$6" backgroundColor={theme.cyan10.val}>
                      <Avatar.Image source={{ uri: avatar.url }} />
                      <Avatar.Fallback backgroundColor={theme.cyan10.val} />
                    </Avatar>
                    {selectedAvatar === avatar.url && (
                      <XStack
                        position="absolute"
                        right={-2}
                        bottom={-2}
                        backgroundColor={theme.cyan8.val}
                        borderRadius="$round"
                        padding="$1"
                      >
                        <Check size={12} color="white" />
                      </XStack>
                    )}
                  </Button>
                ))}
              </XStack>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default ProfileCard;
