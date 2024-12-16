import React, { useState } from 'react';
import { Card, YStack, XStack, Text, Button, Sheet, Tabs, Separator, SizableText, useTheme } from 'tamagui';
import { ChevronRight, ChevronDown, X, History } from '@tamagui/lucide-icons';
import { ScrollView, Dimensions } from 'react-native';

const HistoryCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = useTheme();
  const windowHeight = Dimensions.get('window').height;

  const historyData = {
    daily: [
      { id: 1, date: '2024-01-20', title: 'Daily Goal', points: '+500', description: 'Completed 10,000 steps' },
      { id: 2, date: '2024-01-19', title: 'Daily Goal', points: '+450', description: 'Completed 9,000 steps' },
      { id: 3, date: '2024-01-18', title: 'Daily Goal', points: '+600', description: 'Completed 12,000 steps' },
      { id: 4, date: '2024-01-17', title: 'Daily Goal', points: '+350', description: 'Completed 7,000 steps' },
    ],
    events: [
      { id: 1, date: '2024-01-20', title: 'City Park Trail', points: '+750', description: 'Won city park trail' },
      { id: 2, date: '2024-01-18', title: 'Downtown Walk', points: '+600', description: 'Completed downtown route' },
      { id: 3, date: '2024-01-16', title: 'Beach Run', points: '+800', description: 'Completed beach marathon' },
      { id: 4, date: '2024-01-15', title: 'Mountain Trek', points: '+900', description: 'Reached summit' },
    ],
    challenges: [
      { id: 1, date: '2024-01-19', title: 'Friend Challenge', points: '+300', description: 'Beat John in steps' },
      { id: 2, date: '2024-01-17', title: 'Group Challenge', points: '+400', description: 'Won weekly group challenge' },
      { id: 3, date: '2024-01-15', title: 'Team Challenge', points: '+500', description: 'Led team to victory' },
      { id: 4, date: '2024-01-14', title: 'Global Challenge', points: '+1000', description: 'Top 10% globally' },
    ],
  };

  const TabContent = ({ data, expanded = false }) => (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      style={{ 
        height: expanded ? windowHeight * 0.65 : '100%',
        flex: 1
      }}
      contentContainerStyle={{ 
        paddingBottom: expanded ? 20 : 0,
        flexGrow: expanded ? 1 : 0
      }}
    >
      <YStack space="$2" padding="$2">
        {data.map((item) => (
          <Card
            key={item.id}
            bordered
            animation="lazy"
            backgroundColor="$background"
            borderColor="$color4"
            bw={1}
            scale={0.95}
            hoverStyle={{ scale: 0.975 }}
            pressStyle={{ scale: 0.925 }}
          >
            <Card.Header padded p="$3">
              <YStack space="$2">
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$color" fontSize="$4" fontWeight="bold">
                    {item.title}
                  </Text>
                  <Text color={theme.lime7.val} fontSize="$4" fontWeight="bold">
                    {item.points}
                  </Text>
                </XStack>
                <Text color={theme.color11.val} fontSize="$2">
                  {item.date}
                </Text>
                <Text color="$color" fontSize="$3" opacity={0.9}>
                  {item.description}
                </Text>
              </YStack>
            </Card.Header>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  );

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
        f={1}
      >
        <Card.Header padded>
          <XStack jc="space-between" ai="center">
            <XStack space="$2" ai="center">
              <Text color="$color" fontSize="$6" fontWeight="bold">
                History
              </Text>
            </XStack>
            <Button
              size="$3"
              variant="outlined"
              onPress={() => setIsModalOpen(true)}
              icon={ChevronDown}
              borderRadius="$10"
              bw={1}
              backgroundColor="$background"
              borderColor={theme.color8.val}
              color={theme.color.val}
            >
              Show More
            </Button>
          </XStack>
        </Card.Header>

        <Card.Footer padded f={1} pt="$0">
          <Tabs
            defaultValue="daily"
            orientation="horizontal"
            flexDirection="column"
            width="100%"
            f={1}
            borderRadius="$4"
            borderWidth={1}
            overflow="hidden"
            borderColor={theme.color4.val}
          >
            <Tabs.List
              separator={<Separator vertical />}
              disablePassBorderRadius="bottom"
              aria-label="History tabs"
              backgroundColor="$background"
            >
              <Tabs.Tab flex={1} value="daily">
                <SizableText fontFamily="$body" color={theme.color.val}>Daily</SizableText>
              </Tabs.Tab>
              <Tabs.Tab flex={1} value="events">
                <SizableText fontFamily="$body" color={theme.color.val}>Events</SizableText>
              </Tabs.Tab>
              <Tabs.Tab flex={1} value="challenges">
                <SizableText fontFamily="$body" color={theme.color.val}>Friends</SizableText>
              </Tabs.Tab>
            </Tabs.List>
            
            <Separator />
            
            <Tabs.Content value="daily" f={1}>
              <TabContent data={historyData.daily.slice(0, 2)} />
            </Tabs.Content>

            <Tabs.Content value="events" f={1}>
              <TabContent data={historyData.events.slice(0, 2)} />
            </Tabs.Content>

            <Tabs.Content value="challenges" f={1}>
              <TabContent data={historyData.challenges.slice(0, 2)} />
            </Tabs.Content>
          </Tabs>
        </Card.Footer>
      </Card>

      <Sheet
        forceRemoveScrollEnabled={isModalOpen}
        modal={true}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
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
                  Full History
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
                onPress={() => setIsModalOpen(false)}
              />
            </XStack>

            <Tabs
              defaultValue="daily"
              orientation="horizontal"
              flexDirection="column"
              width="100%"
              f={1}
              borderRadius="$4"
              borderWidth={1}
              overflow="hidden"
              borderColor={theme.color4.val}
            >
              <Tabs.List
                separator={<Separator vertical />}
                disablePassBorderRadius="bottom"
                aria-label="History tabs"
                backgroundColor="$background"
              >
                <Tabs.Tab flex={1} value="daily">
                  <SizableText fontFamily="$body" color={theme.color.val}>Daily</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="events">
                  <SizableText fontFamily="$body" color={theme.color.val}>Events</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="challenges">
                  <SizableText fontFamily="$body" color={theme.color.val}>Challenges</SizableText>
                </Tabs.Tab>
              </Tabs.List>
              
              <Separator />
              
              <Tabs.Content value="daily" f={1}>
                <TabContent data={historyData.daily} expanded={true} />
              </Tabs.Content>

              <Tabs.Content value="events" f={1}>
                <TabContent data={historyData.events} expanded={true} />
              </Tabs.Content>

              <Tabs.Content value="challenges" f={1}>
                <TabContent data={historyData.challenges} expanded={true} />
              </Tabs.Content>
            </Tabs>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default HistoryCard;
