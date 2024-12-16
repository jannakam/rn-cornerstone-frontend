import React from "react";
import {
  YStack,
  XStack,
  Text,
  Card,
  H2,
  Avatar,
} from "tamagui";
import { ScrollView } from "react-native";
import DrawerSceneWrapper from "../components/DrawerSceneWrapper";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";

const Challenge = () => {
  const navigation = useNavigation();

  const participants = [
    { id: 1, name: "Salem", progress: 80, color: "#40E0D0" },  // Turquoise
    { id: 2, name: "Mike", progress: 65, color: "#98FB98" },   // Pale Green
    { id: 3, name: "Emma", progress: 45, color: "#DDA0DD" },   // Plum
    { id: 4, name: "James", progress: 30, color: "#40E0D0" },  // Turquoise
  ];

  return (
    <DrawerSceneWrapper>
      <YStack f={1} bg="$background">
        <Header navigation={navigation} />
        
        <ScrollView>
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
                <H2>Challenge Progress</H2>
              </Card.Header>
              <Card.Footer padded>
                <YStack space="$4" width="100%">
                  {participants.map((participant) => (
                    <XStack 
                      key={participant.id} 
                      space="$3" 
                      alignItems="center"
                      width="100%"
                    >
                      <Avatar circular size="$4">
                        <Avatar.Fallback backgroundColor="$blue10" />
                      </Avatar>
                      <YStack flex={1}>
                        <Text color="white" fontSize={16} marginBottom="$1">
                          {participant.name}
                        </Text>
                        <XStack width="100%" height={8} backgroundColor="#333" borderRadius="$4">
                          <XStack 
                            width={`${participant.progress}%`} 
                            backgroundColor={participant.color}
                            borderRadius="$4"
                          />
                        </XStack>
                      </YStack>
                      <Text color="white" fontSize={14}>
                        {participant.progress}%
                      </Text>
                    </XStack>
                  ))}
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
                <XStack space="$2" alignItems="center">
                  <Text fontSize={20} fontWeight="bold" color="white">
                    The winner of this challenge is
                  </Text>
                </XStack>
              </Card.Header>
              <Card.Footer padded>
                <YStack space="$2" alignItems="center">
                  <Text fontSize={24} fontWeight="bold" color="white">
                    SALEM!
                  </Text>
                  <Text color="gray">5000 steps</Text>
                  <Text color="gray">22.4%</Text>
                </YStack>
              </Card.Footer>
            </Card>
          </YStack>
        </ScrollView>
      </YStack>
    </DrawerSceneWrapper>
  );
};

export default Challenge;
