import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function AuditLogScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>‹ Back</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Audit Log</ThemedText>
        <ThemedText style={styles.subtitle}>Sent notifications, recipients, timestamps, and delivery status.</ThemedText>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Example Entry</ThemedText>
          <Text style={styles.cardText}>Weather Alert • 2,340 recipients • Delivered</Text>
          <Text style={styles.cardText}>Sent: 10:24 AM</Text>
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
