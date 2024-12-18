import React, { useState, useMemo } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  YStack,
  Avatar,
  Text,
  Sheet,
  ScrollView,
  XStack,
  Button,
} from "tamagui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, addFriend, getAllFriends } from "../api/Auth";
import { Plus } from "@tamagui/lucide-icons";

const AddFriendButton = () => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Fetch current friends
  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getAllFriends,
  });

  // Filter out existing friends from users list
  const availableUsers = useMemo(() => {
    if (!users || !friends) return [];

    // Create a set of friend IDs for faster lookup
    const friendIds = new Set(friends.map((friend) => friend.id));

    // Filter out users who are already friends
    return users.filter((user) => !friendIds.has(user.id));
  }, [users, friends]);

  const handleAddFriend = async (friendId) => {
    try {
      setError(null);
      await addFriend(friendId);
      // Invalidate and refetch friends list
      await queryClient.invalidateQueries(["friends"]);
      setIsAddFriendOpen(false);
    } catch (error) {
      console.error("Error adding friend:", error);
      setError("Failed to add friend. They might already be your friend.");
    }
  };

  const isLoading = isLoadingUsers || isLoadingFriends;

  return (
    <YStack ai="center">
      <YStack ai="center" jc="center">
        <Button
          circular
          icon={<Plus color="$color" size={16} />}
          size="$5"
          borderWidth={1}
          borderColor="$color"
        onPress={() => setIsAddFriendOpen(true)}
      >
        
      </Button>

      <Button unstyled fontSize="$2" mt="$1" color="$color">
            Add
        </Button>
      </YStack>

      <Sheet
        modal
        open={isAddFriendOpen}
        onOpenChange={setIsAddFriendOpen}
        snapPoints={[85]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />

          <YStack p="$4" space="$4">
            <Text fontSize={20} fontWeight="bold">
              Add Friends
            </Text>

            {error && (
              <Text color="$red10" fontSize={14}>
                {error}
              </Text>
            )}

            {isLoading ? (
              <Text>Loading users...</Text>
            ) : availableUsers.length === 0 ? (
              <Text>No new users to add</Text>
            ) : (
              <ScrollView maxHeight={600} showsVerticalScrollIndicator={false}>
                <YStack space="$2">
                  {availableUsers.map((user) => (
                    <XStack
                      key={user.id}
                      space="$4"
                      padding="$3"
                      alignItems="center"
                      backgroundColor="$background"
                      borderRadius="$4"
                      marginVertical="$1"
                    >
                      <Avatar circular size="$4">
                        <Avatar.Image
                          source={{
                            uri: "https://github.com/hello-world.png",
                          }}
                        />
                        <Avatar.Fallback backgroundColor="$blue10" />
                      </Avatar>
                      <Text flex={1} fontSize={16} fontWeight="500">
                        {user.username}
                      </Text>

                      <Button
                        size="$3"
                        theme="active"
                        onPress={() => handleAddFriend(user.id)}
                      >
                        Add
                      </Button>
                    </XStack>
                  ))}
                </YStack>
              </ScrollView>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
};

export default AddFriendButton;
