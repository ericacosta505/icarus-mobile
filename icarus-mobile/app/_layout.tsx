import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerShown: false,
            animation: "default",
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
