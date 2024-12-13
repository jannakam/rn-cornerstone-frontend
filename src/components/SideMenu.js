import React from 'react';
import { XStack, YStack, Switch, Label } from 'tamagui';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SideMenu = (props) => {
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flex: 1,
        paddingTop: insets.top,
      }}
    >
      <DrawerItemList {...props} />

      <YStack space="$8" paddingVertical="$6" px="$4">
        <XStack height="$6" space="$4" ai="center">
          <Label color="$color" fontSize={16}>Theme</Label>
          <Switch size="$5" color="$white" bg="$gray" defaultChecked={true}>
            <Switch.Thumb animation="bouncy" />
          </Switch>
        </XStack>

        <XStack height="$6" space="$4" ai="center">
          <Label color="$color" fontSize={16}>Metric</Label>
          <Switch size="$5" color="$white" bg="$gray" defaultChecked={true}>
            <Switch.Thumb animation="bouncy" />
          </Switch>
        </XStack>
      </YStack>
    </DrawerContentScrollView>
  );
};
