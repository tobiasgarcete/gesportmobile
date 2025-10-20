// app/events/TodosEvents.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { getEvents } from "../lib/api";

export default function TodosEvents() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEvents();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        // opcional: mostrar error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView style={{ padding: 16 }}>
      {items.map((ev: any) => (
        <View key={String(ev._id)} style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: "bold" }}>{ev.titulo}</Text>
          <Text>{ev.fecha}</Text>
          <Text>{ev.lugar}</Text>
          <Text>{ev.descripcion}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
