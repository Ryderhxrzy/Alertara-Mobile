import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";

// Redirect legacy broadcast route to ECS home
export default function BroadcastRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/central-command/emergency-communication");
  }, [router]);
  return <View />;
}
