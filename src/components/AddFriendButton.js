import React, { useState } from "react";
import { YStack, Avatar, Text, Sheet, H2, Label, Input, Button } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";

const AddFriendButton = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");

  return (
    <YStack ai="center">
      <Avatar
        circular
        size="$6"
        borderWidth={1}
        borderColor="$color"
        onPress={() => setIsAddFriendOpen(true)}
      >
        <Avatar.Fallback backgroundColor="transparent" jc="center" ai="center">
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
                backgroundColor="$background"
                borderColor="#333"
                padding="$3"
                color="$color"
              />
            </YStack>

            <Button
              theme="active"
              onPress={() => {
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
  );
};

export default AddFriendButton;
