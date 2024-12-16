import React from "react";
import { Card, YStack, XStack, Text, Avatar, Button, useTheme } from "tamagui";
import { History } from "@tamagui/lucide-icons";
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';

const ProfileCard = () => {
  const navigation = useNavigation();

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
    <Card
      elevate
      bordered
      animation="bouncy"
      backgroundColor="$background"
      padding="$4"
      width="100%"
    >
      <YStack space="$4">
        {/* Name at top left */}
        <Text color="$color" fontSize="$6" fontWeight="bold">
          Fulan Al-Fulani
        </Text>

        {/* Centered Avatar */}
        <XStack
          justifyContent="center"
          alignItems="center"
          paddingVertical="$4"
        >
          <Avatar circular size="$10" backgroundColor="$gray6">
            <Avatar.Image
              source={{ uri: "https://github.com/hello-world.png" }}
            />
            <Avatar.Fallback backgroundColor="$gray6" />
          </Avatar>
        </XStack>

        {/* Points Section */}
        <YStack space="$2">
          <Text color="theme.lime10.val" fontSize="$3">
            Total points:
          </Text>
          <XStack space="$2" alignItems="baseline">
            <Text color="$color" fontSize="$9" fontWeight="bold">
              7632
            </Text>
            <Text color="$green10" fontSize="$3">
              26537 Kcal burned!
            </Text>
          </XStack>
          <Text color="$green10" fontSize="$3">
            99999 KM walked
          </Text>
        </YStack>

        {/* Buttons */}
        <XStack space="$4">
          <Button
            flex={1}
            backgroundColor="$green8"
            color="$color"
            size="$4"
            hoverStyle={{ backgroundColor: "$green9" }}
            pressStyle={{ scale: 0.95 }}
            animation="bouncy"
            onPress={navigateToStore}
          >
            Redeem
          </Button>
         
        </XStack>
      </YStack>
    </Card>
  );
};

export default ProfileCard;
