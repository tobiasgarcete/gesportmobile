import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Pressable } from 'react-native';
import { Calendar, MapPin, Users, Search, Filter, ArrowLeft } from 'lucide-react-native';
import { router, useRouter } from 'expo-router';


const { width } = Dimensions.get('window');



// Mock data for all events
const mockAllEvents = [
  {
    id: '1',
    title: 'Campeonato Nacional de Fútbol',
    date: 'Sábado, 15 de Octubre 2023',
    time: '10:00 AM',
    location: 'Estadio Nacional',
    participants: '16 equipos',
    maxParticipants: '24 equipos',
    category: 'Fútbol',
    image: 'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Qm94aW5nJTIwbWF0Y2h8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '2',
    title: 'Entrenamiento Equipo Juvenil',
    date: 'Miércoles, 18 de Octubre 2023',
    time: '3:00 PM',
    location: 'Campo Deportivo Norte',
    participants: '20 jugadores',
    maxParticipants: '25 jugadores',
    category: 'Fútbol',
    image: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29sbGFib3JhdGlvbiUyMHN1Y2Nlc3N8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '3',
    title: 'Torneo de Tenis Amateur',
    date: 'Martes, 18 de Octubre 2023',
    time: '9:00 AM',
    location: 'Club Tennis Pro',
    participants: '32 jugadores',
    maxParticipants: '32 jugadores',
    category: 'Tenis',
    image: 'https://images.unsplash.com/photo-1620801564906-8cec5c428965?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fE1vZGVybiUyMHNwb3J0cyUyMGFyZW5hfGVufDB8fDB8fHww',
  },
  {
    id: '4',
    title: 'Maratón Ciudad 2023',
    date: 'Domingo, 22 de Octubre 2023',
    time: '7:00 AM',
    location: 'Centro Urbano',
    participants: '500 corredores',
    maxParticipants: '1000 corredores',
    category: 'Atletismo',
    image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8R3JvdXAlMjBwZW9wbGUlMjBmcmllbmRzJTIwdGVhbSUyMHRvZ2V0aGVyfGVufDB8fDB8fHww',
  },
  {
    id: '5',
    title: 'Clase de Yoga al Aire Libre',
    date: 'Miércoles, 25 de Octubre 2023',
    time: '6:00 AM',
    location: 'Parque Central',
    participants: '15 personas',
    maxParticipants: '20 personas',
    category: 'Yoga',
    image: 'https://images.unsplash.com/photo-1544367563-00fc867805d1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww',
  },
  {
    id: '6',
    title: 'Partido Amistoso Fútbol',
    date: 'Sábado, 28 de Octubre 2023',
    time: '4:00 PM',
    location: 'Estadio Municipal',
    participants: '2 equipos',
    maxParticipants: '2 equipos',
    category: 'Fútbol',
    image: 'https://images.unsplash.com/photo-1549841753-07499133487f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZyaWVuZHMlMjBwbGF5aW5nJTIwZm9vdGJhbGx8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: '7',
    title: 'Torneo de Basquetbol',
    date: 'Sábado, 28 de Octubre 2023',
    time: '6:00 PM',
    location: 'Gimnasio Central',
    participants: '8 equipos',
    maxParticipants: '12 equipos',
    category: 'Basquetbol',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJhc2tldGJhbGwlMjBnYW1lfGVufDB8fDB8fHww',
  },
];

export default function AllEventsScreen() {
  const [events] = useState(mockAllEvents);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  
  // Get unique categories from events
  const categories = ['Todos', ...new Set(mockAllEvents.map(event => event.category))];

  // Filter events by category
  const filteredEvents = selectedCategory === 'Todos' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
              <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-white/20 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <ArrowLeft color="white" size={20} />
        </TouchableOpacity>
      <View className="bg-blue-600 pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold text-center">Todos los Eventos</Text>
      </View>

      {/* Search and Filter Section */}
      <View className="p-4">
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 mb-4 shadow-sm">
          <Search color="#9ca3af" size={20} />
          <Text className="text-gray-400 ml-2">Buscar eventos...</Text>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="max-h-16 mb-4"
        >
          <View className="flex-row gap-2">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-blue-600' : 'bg-gray-200'}`}
                onPress={() => setSelectedCategory(category)}
              >
                <Text 
                  className={`font-medium ${selectedCategory === category ? 'text-white' : 'text-gray-700'}`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Events List */}
      <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <TouchableOpacity 
              key={event.id} 
              className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden"
            >
              <Image 
                source={{ uri: event.image }} 
                style={{ width: width - 32, height: 160 }}
                className="rounded-t-2xl"
                resizeMode="cover"
              />
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-800 mb-2">{event.title}</Text>
                
                <View className="flex-row items-center mb-1">
                  <Calendar color="#6b7280" size={16} />
                  <Text className="text-gray-600 ml-2">{event.date}</Text>
                  <Text className="text-gray-600 ml-2">•</Text>
                  <Text className="text-gray-600 ml-2">{event.time}</Text>
                </View>
                
                <View className="flex-row items-center mb-1">
                  <MapPin color="#6b7280" size={16} />
                  <Text className="text-gray-600 ml-2">{event.location}</Text>
                </View>
                
                <View className="flex-row items-center mb-3">
                  <Users color="#6b7280" size={16} />
                  <Text className="text-gray-600 ml-2">
                    {event.participants} / {event.maxParticipants}
                  </Text>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-600 font-medium text-sm">{event.category}</Text>
                  </View>
                  
                  <TouchableOpacity className="bg-blue-600 rounded-lg py-2 px-4">
                    <Text className="text-white font-medium">Ver detalles</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <Calendar color="#9ca3af" size={48} />
            <Text className="text-gray-500 text-center mt-4">
              No se encontraron eventos para esta categoría
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row justify-between items-center px-6 py-3">
          {/* Left Section - Profile and "Ver todos" */}
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-row items-center mr-6">
              <Text className="text-blue-600 font-medium">Perfil</Text>
            </TouchableOpacity>
            

          </View>
          
          {/* Right Section - Calendar */}
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