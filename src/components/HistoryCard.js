import React, { useState } from 'react';
import { Card, YStack, XStack, Text, Button, Sheet, Tabs, Separator, SizableText } from 'tamagui';
import { ChevronRight, ChevronDown, X } from '@tamagui/lucide-icons';
import { ScrollView } from 'react-native';

const HistoryCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const historyData = {
    daily: [
      { id: 1, date: '2024-01-20', title: 'Daily Goal', points: '+500', description: 'Completed 10,000 steps' },
      { id: 2, date: '2024-01-19', title: 'Daily Goal', points: '+450', description: 'Completed 9,000 steps' },
    ],
    events: [
      { id: 1, date: '2024-01-20', title: 'City Park Trail', points: '+750', description: 'Won city park trail' },
      { id: 2, date: '2024-01-18', title: 'Downtown Walk', points: '+600', description: 'Completed downtown route' },
    ],
    challenges: [
      { id: 1, date: '2024-01-19', title: 'Friend Challenge', points: '+300', description: 'Beat John in steps' },
      { id: 2, date: '2024-01-17', title: 'Group Challenge', points: '+400', description: 'Won weekly group challenge' },
    ],
  };

  const TabContent = ({ data }) => (
    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>
      <YStack space="$2" padding="$2">
        {data.map((item) => (
          <Card
            key={item.id}
            bordered
            animation="lazy"
            backgroundColor="$gray7"
            padding="$3"
          >
            <YStack>
              <XStack justifyContent="space-between" alignItems="center">
                <Text color="$color" fontSize="$4" fontWeight="bold">
                  {item.title}
                </Text>
                <Text color="$green10" fontSize="$4" fontWeight="bold">
                  {item.points}
                </Text>
              </XStack>
              <Text color="$gray11" fontSize="$2">
                {item.date}
              </Text>
              <Text color="$color" fontSize="$3" marginTop="$1">
                {item.description}
              </Text>
            </YStack>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  );

  return (
    <>
      <Card
        elevate
        bordered
        animation="bouncy"
        backgroundColor="$background"
        padding="$4"
        width="100%"
        marginBottom="$4"
      >
        <YStack space="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <Text color="$color" fontSize="$6" fontWeight="bold">
              History:
            </Text>
          </XStack>

          <Tabs
            defaultValue="daily"
            orientation="horizontal"
            flexDirection="column"
            width="100%"
            borderRadius="$4"
            borderWidth="$0.25"
            overflow="hidden"
            borderColor="$borderColor"
          >
            <Tabs.List
              separator={<Separator vertical />}
              disablePassBorderRadius="bottom"
              aria-label="History tabs"
            >
              <Tabs.Tab flex={1} value="daily">
                <SizableText fontFamily="$body">Daily</SizableText>
              </Tabs.Tab>
              <Tabs.Tab flex={1} value="events">
                <SizableText fontFamily="$body">Events</SizableText>
              </Tabs.Tab>
              <Tabs.Tab flex={1} value="challenges">
                <SizableText fontFamily="$body">Friends</SizableText>
              </Tabs.Tab>
            </Tabs.List>
            
            <Separator />
            
            <Tabs.Content value="daily">
              <TabContent data={historyData.daily} />
            </Tabs.Content>

            <Tabs.Content value="events">
              <TabContent data={historyData.events} />
            </Tabs.Content>

            <Tabs.Content value="challenges">
              <TabContent data={historyData.challenges} />
            </Tabs.Content>
          </Tabs>

          <Button
            alignSelf="center"
            size="$2"
            variant="outlined"
            iconAfter={ChevronDown}
            color="$color"
            onPress={() => setIsModalOpen(true)}
          >
            Show More
          </Button>
        </YStack>
      </Card>

      <Sheet
        modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        snapPoints={[85]}
        position={0}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          <Sheet.Handle />
          <YStack padding="$4" space="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <Text color="$color" fontSize="$6" fontWeight="bold">
                Full History
              </Text>
              <Button
                size="$2"
                circular
                icon={X}
                onPress={() => setIsModalOpen(false)}
              />
            </XStack>

            <Tabs
              defaultValue="daily"
              orientation="horizontal"
              flexDirection="column"
              width="100%"
              borderRadius="$4"
              borderWidth="$0.25"
              overflow="hidden"
              borderColor="$borderColor"
            >
              <Tabs.List
                separator={<Separator vertical />}
                disablePassBorderRadius="bottom"
                aria-label="History tabs"
              >
                <Tabs.Tab flex={1} value="daily">
                  <SizableText fontFamily="$body">Daily</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="events">
                  <SizableText fontFamily="$body">Events</SizableText>
                </Tabs.Tab>
                <Tabs.Tab flex={1} value="challenges">
                  <SizableText fontFamily="$body">Challenges</SizableText>
                </Tabs.Tab>
              </Tabs.List>
              
              <Separator />
              
              <Tabs.Content value="daily">
                <TabContent data={historyData.daily} />
              </Tabs.Content>

              <Tabs.Content value="events">
                <TabContent data={historyData.events} />
              </Tabs.Content>

              <Tabs.Content value="challenges">
                <TabContent data={historyData.challenges} />
              </Tabs.Content>
            </Tabs>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

export default HistoryCard;
