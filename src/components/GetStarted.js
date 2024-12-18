import React, { useState, useEffect } from "react";
import { ScrollView, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/Auth";
import {
  XStack,
  YStack,
  Text,
  Input,
  Button,
  Switch,
  useTheme,
} from "tamagui";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "@tamagui/lucide-icons";

const GetStarted = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const [isMetric, setIsMetric] = useState(false);
  const [userInfo, setUserInfo] = useState({
    height: "",
    weight: "",
    age: "",
  });
  const [errors, setErrors] = useState({
    height: "",
    weight: "",
    age: "",
  });

  const { mutate } = useMutation({
    mutationFn: (data) => register(data),
    onSuccess: () => {
      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login");
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Error", "Registration failed. Please try again.");
    },
  });

  const validateInputs = () => {
    const newErrors = {};
    let isValid = true;

    // Age validation (16-100 years)
    const age = parseInt(userInfo.age);
    if (!age || age < 16 || age > 100) {
      newErrors.age = "Age must be between 16 and 100";
      isValid = false;
    }

    // Height validation
    const height = parseFloat(userInfo.height);
    if (!height) {
      newErrors.height = "Height is required";
      isValid = false;
    } else if (isMetric) {
      // Metric: 120cm - 215cm
      if (height < 120 || height > 215) {
        newErrors.height = "Height must be between 120cm and 215cm";
        isValid = false;
      }
    } else {
      // Imperial: 4ft (48in) - 7ft (84in)
      if (height < 48 || height > 84) {
        newErrors.height = "Height must be between 4ft and 7ft";
        isValid = false;
      }
    }

    // Weight validation
    const weight = parseFloat(userInfo.weight);
    if (!weight) {
      newErrors.weight = "Weight is required";
      isValid = false;
    } else if (isMetric) {
      // Metric: 35kg - 135kg
      if (weight < 35 || weight > 135) {
        newErrors.weight = "Weight must be between 35kg and 135kg";
        isValid = false;
      }
    } else {
      // Imperial: 80lb - 300lb
      if (weight < 80 || weight > 300) {
        newErrors.weight = "Weight must be between 80lb and 300lb";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateInputs()) {
      return;
    }

    // Convert to metric for storage if using imperial
    const height = parseFloat(userInfo.height);
    const weight = parseFloat(userInfo.weight);
    const convertedData = {
      ...route.params.userInfo,
      height: isMetric ? height : Math.round(height * 2.54), // Convert inches to cm
      weight: isMetric ? weight : Math.round(weight * 0.453592), // Convert lbs to kg
      age: parseInt(userInfo.age),
    };

    mutate(convertedData);
  };

  // Handle unit system change
  useEffect(() => {
    if (userInfo.height && userInfo.weight) {
      const height = parseFloat(userInfo.height);
      const weight = parseFloat(userInfo.weight);
      
      setUserInfo({
        ...userInfo,
        height: isMetric 
          ? (height * 2.54).toFixed(1) // in to cm
          : (height / 2.54).toFixed(1), // cm to in
        weight: isMetric
          ? (weight * 0.453592).toFixed(1) // lb to kg
          : (weight / 0.453592).toFixed(1), // kg to lb
      });
    }
  }, [isMetric]);

  const SelectTriggerStyles = {
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderColor: "#333",
    padding: "$3",
  };

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <YStack
        f={1}
        bg="$background"
        width="100%"
        ai="center"
        jc="center"
        space="$6"
      >
        <ChevronLeft position="absolute" top={90} left="$6" size={24} color={theme.color.val} onPress={() => navigation.goBack()}/>
        <YStack space="$4" ai="center" mb="$4">
          <Text color="$color" fontSize="$9" fontWeight="bold">
            Get Started
          </Text>
          <Text color="$color" opacity={0.7} fontSize="$4" textAlign="center">
            Help us customize your experience {'\n'} We just need a few details.
          </Text>
        </YStack>


        <YStack space="$4" width="85%" maxWidth={400}>
          <YStack gap="$4" width="100%">
          <Input
            size="$4"
            borderWidth={2}
            borderRadius="$10"
            backgroundColor="$backgroundTransparent"
            borderColor="$color4"
            color="white"
            focusStyle={{
              borderColor: theme.cyan8.val,
            }}
            placeholder={isMetric ? "Height (cm)" : "Height (inches)"}
            placeholderTextColor="$color8"
            keyboardType="numeric"
            value={userInfo.height}
            onChangeText={(text) => {
              setUserInfo({ ...userInfo, height: text });
              setErrors({ ...errors, height: "" });
            }}
          />
          {errors.height ? (
            <Text color="$magenta8" fontSize="$2">
              {errors.height}
            </Text>
          ) : null}

          <Input
            size="$4"
            borderWidth={2}
            borderRadius="$10"
            backgroundColor="$backgroundTransparent"
            borderColor="$color4"
            color="white"
            focusStyle={{
              borderColor: theme.cyan8.val,
            }}
            placeholder={isMetric ? "Weight (kg)" : "Weight (lbs)"}
            placeholderTextColor="$color8"
            keyboardType="numeric"
            value={userInfo.weight}
            onChangeText={(text) => {
              setUserInfo({ ...userInfo, weight: text });
              setErrors({ ...errors, weight: "" });
            }}
          />
          {errors.weight ? (
            <Text color="$magenta8" fontSize="$2">
              {errors.weight}
            </Text>
          ) : null}

          <Input
            size="$4"
            borderWidth={2}
            borderRadius="$10"
            backgroundColor="$backgroundTransparent"
            borderColor="$color4"
            color="white"
            focusStyle={{
              borderColor: theme.cyan8.val,
            }}
            placeholder="Age"
            placeholderTextColor="$color8"
            keyboardType="numeric"
            value={userInfo.age}
            onChangeText={(text) => {
              setUserInfo({ ...userInfo, age: text });
              setErrors({ ...errors, age: "" });
            }}
          />
          </YStack>
          {errors.age ? (
            <Text color="$magenta8" fontSize="$2">
              {errors.age}
            </Text>
          ) : null}

          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingVertical="$2"
            marginTop="$2"
          >
            <Text color="$color" opacity={0.7}>
              {isMetric ? "Metric (cm/kg)" : "Imperial (in/lb)"}
            </Text>
            <Switch
              size="$3"
              checked={isMetric}
              onCheckedChange={setIsMetric}
              backgroundColor="$color4"
            >

              <Switch.Thumb animation="quick" />
            </Switch>
          </XStack>

          <Button
            size="$4"
            borderRadius="$10"
            backgroundColor="$background"
            borderColor={theme.cyan8.val}
            borderWidth={2}
            color={theme.cyan8.val}
            onPress={handleSubmit}
            pressStyle={{ opacity: 0.8 }}
            marginTop="$4"
          >
            Start Earning!
          </Button>


          <Text
            color="$color"
            opacity={0.7}
            fontSize="$2"
            textAlign="center"
            marginTop="$4"
          >
            By confirming you agree to all{" "}
            <Text
              color={theme.cyan8.val}
              pressStyle={{ opacity: 0.8 }}
            >
              terms
            </Text>
          </Text>
        </YStack>
      </YStack>
    </TouchableWithoutFeedback>
  );
};

export default GetStarted;
