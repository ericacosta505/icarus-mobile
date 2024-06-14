import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerShown: false,
            animation: "ios",
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
