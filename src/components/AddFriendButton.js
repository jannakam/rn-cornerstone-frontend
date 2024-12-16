import React, { useState, useEffect } from "react";
import { Keyboard, Platform, KeyboardAvoidingView, Dimensions } from "react-native";
import { YStack, Avatar, Text, Sheet, Label, Input, Button } from "tamagui";

const AddFriendButton = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");

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
        snapPoints={[45]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "position" : "padding"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
            style={{ flex: 1 }}
          >
            <YStack p="$4" space="$4">
              <Text fontSize={16} fontWeight="bold">Add a friend!</Text>

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
              >
                Add Friend
              </Button>
            </YStack>
          </KeyboardAvoidingView>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default AddFriendButton;
