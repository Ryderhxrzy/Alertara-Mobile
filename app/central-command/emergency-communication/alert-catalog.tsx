import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

const templates = [
  { name: "Severe Weather", detail: "Typhoon / heavy rain with evacuation notice." },
  { name: "Earthquake", detail: "Drop, cover, hold drill or post-event bulletin." },
  { name: "Fire Alert", detail: "Building fire advisory and assembly points." },
];

export default function AlertCatalogScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>‹ Back</ThemedText>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Alert Catalog</ThemedText>
        <ThemedText style={styles.subtitle}>Manage reusable templates and categories.</ThemedText>
        <View style={styles.list}>
          {templates.map((t) => (
            <View key={t.name} style={styles.card}>
              <ThemedText style={styles.cardTitle}>{t.name}</ThemedText>
              <Text style={styles.cardText}>{t.detail}</Text>
              <Pressable style={styles.linkBtn}>
                <Text style={styles.linkText}>Open template</Text>
              </Pressable>
            </View>
          ))}
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
  list: { gap: 10 },
  card: { borderWidth: 1, borderColor: "#e2e5ea", borderRadius: 16, padding: 14, gap: 6, backgroundColor: "#fff" },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardText: { fontSize: 13, color: "#444" },
  linkBtn: { paddingVertical: 6 },
  linkText: { color: "#1a73e8", fontWeight: "600" },
});
