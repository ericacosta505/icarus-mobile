import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          animation: "ios",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: false,
          animation: "ios",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
          animation: "ios",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="previousentries"
        options={{
          headerShown: false,
          animation: "ios",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
