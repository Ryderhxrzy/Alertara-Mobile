import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SubscriptionsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>‹ Back</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Subscriptions & Preferences</ThemedText>
        <ThemedText style={styles.subtitle}>Opt-ins, categories, and channel choices.</ThemedText>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Citizen Example</ThemedText>
          <Text style={styles.cardText}>Weather + Earthquake • SMS + Email</Text>
          <Text style={styles.cardText}>Status: Subscribed</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  backBtn: { alignSelf: "flex-start", paddingVertical: 4, paddingHorizontal: 6 },
  backText: { fontSize: 16, color: "#1a73e8", fontWeight: "600" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#555" },
  card: { borderWidth: 1, borderColor: "#e2e5ea", borderRadius: 16, padding: 14, gap: 6, backgroundColor: "#fff" },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardText: { fontSize: 13, color: "#444" },
});
