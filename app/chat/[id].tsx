import { Header } from "@/components/header";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, TealColors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
  sentAt: number;
};

const promptMap: Record<string, string[]> = {
  Alert: [
    "Type of alert?",
    "Who is the source?",
    "Latest data update?",
    "What should I do now?",
    "Evac routes?",
    "Emergency contacts?",
  ],
  Weather: [
    "Rainfall or wind strength?",
    "Flood risk level?",
    "When does it pass?",
    "Safe routes?",
    "What to prepare?",
  ],
  Fire: [
    "Evacuation routes?",
    "Shelter locations?",
    "Air quality/smoke?",
    "Who to call?",
  ],
  General: [
    "How to stay informed?",
    "Nearest help desk?",
    "Emergency contacts?",
    "Preparedness checklist?",
  ],
};

export default function ChatScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { id, title, category } = useLocalSearchParams<{
    id?: string;
    title?: string;
    category?: string;
  }>();
  const alertTitle = decodeURIComponent(title ?? "Alert chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "m-0",
      from: "bot",
      text: `You’re chatting about “${alertTitle}”. Ask for instructions, sources, or next steps.`,
      sentAt: Date.now(),
    },
  ]);
  const scrollRef = useRef<ScrollView>(null);

  const promptChips = useMemo(() => {
    const key = (category ?? "General").toString();
    return promptMap[key] ?? promptMap.General;
  }, [category]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      from: "user",
      text: trimmed,
      sentAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Mock bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          from: "bot",
          text: `Bot: For "${alertTitle}", here’s a quick check — follow official guidance, stay tuned for updates, and ensure your household is ready.`,
          sentAt: Date.now(),
        },
      ]);
    }, 900);
  };

  const screenBg = isDarkMode ? Colors.dark.background : Colors.light.background;
  const cardBg = isDarkMode ? "#1c2830" : "#ffffff";
  const textColor = isDarkMode ? Colors.dark.text : Colors.light.text;

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
      <SafeHeader onBack={() => router.back()} />
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <IconSymbol name="robot" size={24} color={TealColors.primary} />
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {alertTitle}
            </ThemedText>
            {category && (
              <ThemedText style={styles.subtitle} numberOfLines={1}>
                {decodeURIComponent(category)} · AI Assistant
              </ThemedText>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promptsRow}
      >
        {promptChips.map((chip) => (
          <Pressable
            key={chip}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: pressed ? `${TealColors.primary}1A` : `${TealColors.primary}10`,
                borderColor: `${TealColors.primary}40`,
              },
            ]}
            onPress={() => send(chip)}
          >
            <ThemedText style={styles.chipText}>{chip}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.threadCard, { backgroundColor: cardBg }]}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.threadContent}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                m.from === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <ThemedText
                style={[
                  styles.bubbleText,
                  { color: m.from === "user" ? "#ffffff" : textColor },
                ]}
              >
                {m.text}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={[styles.composer, { backgroundColor: cardBg }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask a question..."
            placeholderTextColor="#6b7280"
            style={[styles.input, { color: textColor }]}
            multiline
          />
          <Pressable
            style={[
              styles.sendBtn,
              { opacity: input.trim().length ? 1 : 0.4, borderColor: TealColors.primary },
            ]}
            disabled={!input.trim().length}
            onPress={() => send(input)}
          >
            <IconSymbol name="paperplane.fill" size={18} color={TealColors.primary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

function SafeHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
      <Pressable onPress={onBack} style={{ paddingVertical: 6, paddingHorizontal: 4 }}>
        <ThemedText style={{ fontSize: 14, color: TealColors.primary }}>‹ Back</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  promptsRow: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: TealColors.primary,
  },
  threadCard: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
  },
  threadContent: {
    gap: 10,
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: TealColors.primary,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(148, 163, 184, 0.25)",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  composer: {
    marginHorizontal: 12,
    marginBottom: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    minHeight: 36,
    maxHeight: 120,
  },
  sendBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
});
