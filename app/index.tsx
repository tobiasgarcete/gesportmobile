// app/index.tsx
import { useRouter } from 'expo-router';
import {
  Calendar,
  MapPin,
  User,
  Users,
  Heart,
  Search as SearchIcon,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type EventCard = {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: string;
  image: string;
  tag?: string;
};

const mockEvents: EventCard[] = [
  {
    id: '1',
    title: 'Campeonato Nacional de Fútbol',
    date: '15 Oct 2023',
    location: 'Estadio Nacional',
    participants: '16 equipos',
    image:
      'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?w=1200&auto=format&fit=crop&q=60',
    tag: 'Fútbol',
  },
  {
    id: '2',
    title: 'Torneo de Tenis Amateur',
    date: '22 Oct 2023',
    location: 'Club Tennis Pro',
    participants: '32 jugadores',
    image:
      'https://images.unsplash.com/photo-1620801564906-8cec5c428965?w=1200&auto=format&fit=crop&q=60',
    tag: 'Tenis',
  },
  {
    id: '3',
    title: 'Maratón Ciudad 2023',
    date: '30 Oct 2023',
    location: 'Centro Urbano',
    participants: '500 corredores',
    image:
      'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=1200&auto=format&fit=crop&q=60',
    tag: 'Running',
  },
  {
    id: '4',
    title: 'Liga de Baloncesto',
    date: '05 Nov 2023',
    location: 'Gimnasio Central',
    participants: '8 equipos',
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=60',
    tag: 'Basket',
  },
];

const TAGS = ['Todos', 'Fútbol', 'Tenis', 'Running', 'Basket'] as const;

export default function HomeScreen() {
  const router = useRouter();
  const [events] = useState<EventCard[]>(mockEvents);
  const [activeTag, setActiveTag] = useState<(typeof TAGS)[number]>('Todos');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const byTag = activeTag === 'Todos' ? true : e.tag === activeTag;
      const byQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q);
      return byTag && byQuery;
    });
  }, [events, activeTag, query]);

  return (
    <View className="flex-1 bg-gray-50">
      {/* HERO */}
      <LinearGradient
        colors={['#1d4ed8', '#1e40af']} // blue-700 -> blue-800
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-16 pb-8 px-6 rounded-b-3xl"
      >
        <View className="items-center">
          {/* Tarjeta del logo */}
          <View className="bg-white/95 p-3 rounded-3xl shadow-md">
            <Image
              source={require('../assets/images/favicon.png')}
              className="w-28 h-28 rounded-2xl"
              resizeMode="contain"
              accessibilityLabel="Logo Gesport"
            />
          </View>

          <Text className="text-3xl font-extrabold text-white text-center mt-5 tracking-tight">
            ¡Bienvenido a GeSport!
          </Text>
          <Text className="text-base text-blue-100 text-center mt-1">
            Descubre eventos deportivos cerca de ti
          </Text>

          {/* Barra de búsqueda visual */}
          <View className="mt-5 w-full">
            <View className="flex-row items-center bg-white/95 rounded-2xl px-3 py-2 shadow-sm">
              <SearchIcon size={18} color="#94a3b8" />
              <Text
                className="ml-2 text-slate-500"
                // Placeholder visual (si quieres input real, cambia por TextInput)
              >
                Buscar por título o lugar…
              </Text>
            </View>
          </View>

          {/* Chips de categorías */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {TAGS.map((t) => {
              const active = t === activeTag;
              return (
                <Pressable
                  key={t}
                  onPress={() => setActiveTag(t)}
                  style={({ pressed }) => [
                    {
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                  android_ripple={{ color: '#bfdbfe' }}
                  className={`mr-2 px-4 py-2 rounded-full ${
                    active ? 'bg-white' : 'bg-white/20'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      active ? 'text-blue-700 font-semibold' : 'text-blue-50'
                    }`}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* LISTA */}
      <View className="flex-1 mt-5 px-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-gray-800">Eventos</Text>

          <TouchableOpacity
            className="px-3 py-1.5 rounded-full bg-blue-50"
            onPress={() => router.push('/events/TodosEvents')}
            accessibilityRole="button"
            accessibilityLabel="Ver todos los eventos"
          >
            <Text className="text-blue-700 font-semibold">Ver todos</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          {filtered.map((event) => {
            const isLiked = !!liked[event.id];
            return (
              <Pressable
                key={event.id}
                onPress={() => router.push('/masinformacion/Index')}
                style={({ pressed }) => [
                  {
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
                android_ripple={{ color: '#e2e8f0' }}
                className="bg-white rounded-3xl mb-5 overflow-hidden shadow-sm border border-gray-100"
              >
                {/* Imagen con overlay y etiqueta */}
                <View>
                  <Image
                    source={{ uri: event.image }}
                    style={{
                      width: width - 32,
                      height: Math.round((width - 32) * 0.52),
                    }}
                    resizeMode="cover"
                  />
                  {/* Overlay degradado para texto legible */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.55)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    className="absolute inset-0"
                  />
                  {/* Chip superior izquierda */}
                  {event.tag && (
                    <View className="absolute left-3 top-3 bg-white/90 px-3 py-1 rounded-full">
                      <Text className="text-blue-700 text-xs font-semibold">
                        {event.tag}
                      </Text>
                    </View>
                  )}
                  {/* Botón like */}
                  <Pressable
                    onPress={() =>
                      setLiked((prev) => ({ ...prev, [event.id]: !isLiked }))
                    }
                    hitSlop={12}
                    className="absolute right-3 top-3 bg-white/95 rounded-full p-2"
                    android_ripple={{ color: '#e5e7eb', borderless: true }}
                  >
                    <Heart size={18} color={isLiked ? '#ef4444' : '#334155'} fill={isLiked ? '#ef4444' : 'transparent'} />
                  </Pressable>

                  {/* Título sobre la imagen (parte inferior) */}
                  <View className="absolute bottom-3 left-3 right-3">
                    <Text className="text-white font-semibold text-lg drop-shadow">
                      {event.title}
                    </Text>
                  </View>
                </View>

                {/* Detalle */}
                <View className="p-4">
                  {/* Chips info */}
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    <View className="flex-row items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                      <Calendar size={14} color="#6b7280" />
                      <Text className="text-gray-700 ml-1.5 text-[13px]">
                        {event.date}
                      </Text>
                    </View>
                    <View className="flex-row items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                      <MapPin size={14} color="#6b7280" />
                      <Text className="text-gray-700 ml-1.5 text-[13px]">
                        {event.location}
                      </Text>
                    </View>
                    <View className="flex-row items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                      <Users size={14} color="#6b7280" />
                      <Text className="text-gray-700 ml-1.5 text-[13px]">
                        {event.participants}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="bg-blue-700 rounded-2xl py-3 items-center"
                    onPress={() => router.push('/masinformacion/Index')}
                    accessibilityRole="button"
                    accessibilityLabel="Ver más información del evento"
                    activeOpacity={0.85}
                  >
                    <Text className="text-white font-semibold">Más información</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* NAV INFERIOR flotante */}
      <View className="absolute bottom-4 left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-lg">
        <View className="flex-row justify-between items-center px-5 py-3">
          {/* Perfil */}
          <Pressable
            onPress={() => router.push('/profile/profile')}
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            android_ripple={{ color: '#bfdbfe', borderless: false }}
            className="flex-row items-center"
          >
            <User color="#1d4ed8" size={20} />
            <Text className="text-blue-700 font-semibold ml-2">Perfil</Text>
          </Pressable>

          {/* Ver todos */}
          <Pressable
            onPress={() => router.push('/events/TodosEvents')}
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            android_ripple={{ color: '#bfdbfe' }}
            className="flex-row items-center bg-blue-50 px-3 py-2 rounded-xl"
          >
            <Text className="text-blue-700 font-semibold">Ver todos</Text>
          </Pressable>

          {/* Calendario */}
          <Pressable
            onPress={() => router.push('/calendario/Calendar')}
            style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            android_ripple={{ color: '#bfdbfe', borderless: false }}
            className="flex-row items-center bg-blue-700 px-4 py-2 rounded-full"
          >
            <Calendar color="white" size={20} />
            <Text className="text-white font-semibold ml-2">Calendario</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
