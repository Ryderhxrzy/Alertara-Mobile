import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function MassNotificationScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>‹ Back</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Mass Notification</ThemedText>
        <ThemedText style={styles.subtitle}>
          Draft, review, and send alerts across SMS, Email, and PA channels.
        </ThemedText>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Quick Alert</ThemedText>
          <Text style={styles.cardText}>Title, category, severity, and channels.</Text>
          <Pressable style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Compose Alert</Text>
          </Pressable>
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
  card: { borderWidth: 1, borderColor: "#e2e5ea", borderRadius: 16, padding: 14, gap: 8, backgroundColor: "#fff" },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardText: { fontSize: 13, color: "#444" },
  primaryBtn: { backgroundColor: "#c0392b", borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 4 },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
