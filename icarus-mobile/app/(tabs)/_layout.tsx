import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false, animation: "none", }} />
      <Stack.Screen name="signup" options={{ headerShown: false, animation: "none",  }} />
      <Stack.Screen name="home" options={{ headerShown: false, animation: "none",  }} />
      <Stack.Screen name="previousentries" options={{ headerShown: false, animation: "none",  }} />
    </Stack>
  );
}
