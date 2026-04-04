import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function LanguageSupportScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>‹ Back</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Multilingual Support</ThemedText>
        <ThemedText style={styles.subtitle}>Manage translations and localized message variants.</ThemedText>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Languages</ThemedText>
          <Text style={styles.cardText}>English, Filipino, Cebuano (examples).</Text>
        </View>
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Glossary</ThemedText>
          <Text style={styles.cardText}>Key terms to keep translations consistent.</Text>
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
