import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

const modules = [
  { title: "Mass Notification", icon: "antenna.radiowaves.left.and.right", route: "/central-command/ecs/mass-notification", desc: "Create and send alerts across SMS, Email, PA." },
  { title: "Alert Catalog", icon: "tray.full", route: "/central-command/ecs/alert-catalog", desc: "Reusable alert templates and categorizations." },
  { title: "Two-Way Feedback", icon: "bubble.left.and.bubble.right", route: "/central-command/ecs/citizen-feedback", desc: "Collect acknowledgements and citizen status." },
  { title: "Language Support", icon: "globe", route: "/central-command/ecs/language-support", desc: "Manage translations and multilingual delivery." },
  { title: "Subscriptions", icon: "person.crop.circle.badge.checkmark", route: "/central-command/ecs/subscriptions", desc: "Opt-ins, channels, and preferences." },
  { title: "Audit Log", icon: "doc.text.magnifyingglass", route: "/central-command/ecs/audit-log", desc: "Delivery history, status, and accountability." },
];

export default function EcsHome() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
      <Header />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ThemedText style={styles.backText}>‹ Back</ThemedText>
        </Pressable>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <IconSymbol name="antenna.radiowaves.left.and.right" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="title" style={styles.title}>Emergency Communication System</ThemedText>
            <ThemedText style={styles.subtitle}>Mass notifications, multilingual delivery, two-way feedback, and auditability.</ThemedText>
          </View>
        </View>

        <View style={styles.grid}>
          {modules.map((m) => (
            <Pressable key={m.route} style={styles.card} onPress={() => router.push(m.route)}>
              <View style={styles.cardIcon}>
                <IconSymbol name={m.icon as any} size={20} color="#1a73e8" />
              </View>
              <ThemedText style={styles.cardTitle}>{m.title}</ThemedText>
              <ThemedText style={styles.cardDesc}>{m.desc}</ThemedText>
              <ThemedText style={styles.cardAction}>Open</ThemedText>
            </Pressable>
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
  hero: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 4 },
  heroIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#c0392b", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#555" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { width: "48%", borderRadius: 16, borderWidth: 1, borderColor: "#e2e5ea", padding: 12, gap: 6, backgroundColor: "#fff" },
  cardIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#e8f1ff", alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700" },
  cardDesc: { fontSize: 12, color: "#555" },
  cardAction: { fontSize: 12, color: "#1a73e8", fontWeight: "600" },
});
