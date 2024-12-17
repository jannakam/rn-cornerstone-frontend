import React, { useState, useEffect } from "react";
import { Keyboard, Platform, KeyboardAvoidingView, Dimensions } from "react-native";
import { YStack, Avatar, Text, Sheet, Label, Input, Button, useTheme } from "tamagui";

const AddFriendButton = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const theme = useTheme();

  return (
    <YStack ai="center" space="$2">
      <Avatar
        circular
        size="$6"
        borderWidth={1}
        borderColor="$color"
        onPress={() => setIsAddFriendOpen(true)}
      >
        <Avatar.Fallback backgroundColor="transparent" jc="center" ai="center">
          <YStack ai="center" jc="center">
            <Button unstyled fontSize={8} color="$color">
              Add
            </Button>
          </YStack>
        </Avatar.Fallback>
      </Avatar>
      
      <Sheet
        modal
        open={isAddFriendOpen}
        onOpenChange={setIsAddFriendOpen}
        snapPoints={[60]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          
            <YStack p="$4" space="$4">
              <Text fontSize={16} fontWeight="bold">Add a friend by searching their username:</Text>

              <YStack space="$2">
                <Label htmlFor="username" fontSize={14}>Friend Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={friendUsername}
                  onChangeText={setFriendUsername}
                  backgroundColor="$background"
                  borderColor="$color4"
                  padding="$3"
                  color="$color"
                  fontSize={16}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                />
              </YStack>

              <Button
                theme="active"
                onPress={() => {
                  Keyboard.dismiss();
                  setIsAddFriendOpen(false);
                  setFriendUsername("");
                }}
                disabled={!friendUsername.trim()}
                fontSize={14}
                backgroundColor={theme.background.val}
                borderColor={theme.color6.val}
                color={theme.color.val}
              >
                Add Friend
              </Button>
            </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default AddFriendButton;
