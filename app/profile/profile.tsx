import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { User, Calendar, MapPin, Trophy, Settings, Edit3, LogOut, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock user data
const userData = {
  name: 'Carlos Ramírez',
  email: 'carlos.ramirez@email.com',
  memberSince: 'Enero 2023',
  location: 'Santiago, Chile',
  eventsParticipated: 12,
  eventsOrganized: 3,
  achievements: [
    { id: 1, title: 'Primer Evento', description: 'Participaste en tu primer evento deportivo', date: 'Mar 2023' },
    { id: 2, title: 'Organizador', description: 'Organizaste tu primer torneo', date: 'Jun 2023' },
    { id: 3, title: 'Asiduo', description: 'Participaste en 10 eventos', date: 'Sep 2023' },
  ],
  upcomingEvents: [
    { id: 1, title: 'Torneo de Fútbol Amateur', date: '15 Oct 2023', location: 'Estadio Municipal' },
    { id: 2, title: 'Maratón Ciudad', date: '30 Oct 2023', location: 'Parque Central' },
  ],
  performance: {
    attendanceRate: 85, // porcentaje
    avgEventsPerMonth: 2.3,
    level: 'Intermedio',
  },
};

export default function ProfileScreen() {
  const [user] = useState(userData);
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Mi Perfil</Text>
          <TouchableOpacity>
            <Settings color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center mt-6 mb-6">
          <View className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 items-center justify-center mb-4">
            <User color="#4B5563" size={48} />
          </View>
          <Text className="text-2xl font-bold text-gray-800">{user.name}</Text>
          <Text className="text-gray-600 mb-2">{user.email}</Text>

          <View className="flex-row items-center mt-1">
            <MapPin color="#6b7280" size={16} />
            <Text className="text-gray-600 ml-1">{user.location}</Text>
          </View>

          <TouchableOpacity className="flex-row items-center mt-3 bg-blue-100 px-4 py-2 rounded-full">
            <Edit3 color="#2563eb" size={16} />
            <Text className="text-blue-600 font-medium ml-2">Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View className="mx-4 mb-6">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row justify-between">
              <View className="items-center flex-1 border-r border-gray-100">
                <Text className="text-2xl font-bold text-blue-600">{user.eventsParticipated}</Text>
                <Text className="text-gray-600 mt-1">Eventos</Text>
                <Text className="text-gray-600">Participados</Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">{user.eventsOrganized}</Text>
                <Text className="text-gray-600 mt-1">Eventos</Text>
                <Text className="text-gray-600">Organizados</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rendimiento Section */}
        <View className="mx-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-gray-800 mb-3">Rendimiento</Text>
            <TouchableOpacity>
              <Text className="text-blue-500 mb-3" onPress={()=> {
                router.push('/profile/rendimiento/rendimiento');
              }}>Ver detalles de rendimiento</Text>
            </TouchableOpacity>

          </View>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Activity color="#2563eb" size={22} />
              <Text className="text-gray-700 ml-2 font-semibold">
                Nivel: <Text className="text-blue-700">{user.performance.level}</Text>
              </Text>
            </View>

            <View className="flex-row justify-between">
              <View className="items-center flex-1 border-r border-gray-100">
                <Text className="text-2xl font-bold text-blue-600">
                  {user.performance.attendanceRate}%
                </Text>
                <Text className="text-gray-600 text-sm mt-1">Asistencia</Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">
                  {user.performance.avgEventsPerMonth}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  Eventos / mes
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View className="mx-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-gray-800">Logros</Text>
            <TouchableOpacity>
              <Text className="text-blue-500">Ver todos</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl p-4 shadow-sm">
            {user.achievements.map((achievement) => (
              <View key={achievement.id} className="flex-row items-center mb-4 last:mb-0">
                <View className="bg-yellow-100 w-12 h-12 rounded-full items-center justify-center">
                  <Trophy color="#D97706" size={24} />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-800">{achievement.title}</Text>
                  <Text className="text-gray-600 text-sm">{achievement.description}</Text>
                  <Text className="text-gray-500 text-xs mt-1">{achievement.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Events */}
        <View className="mx-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">Próximos Eventos</Text>
          {user.upcomingEvents.map((event) => (
            <View key={event.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
              <Text className="font-bold text-gray-800 mb-1">{event.title}</Text>

              <View className="flex-row items-center mt-2">
                <Calendar color="#6b7280" size={16} />
                <Text className="text-gray-600 ml-2">{event.date}</Text>
              </View>

              <View className="flex-row items-center mt-1">
                <MapPin color="#6b7280" size={16} />
                <Text className="text-gray-600 ml-2">{event.location}</Text>
              </View>

              <TouchableOpacity className="mt-3 bg-blue-100 rounded-lg py-2 items-center">
                <Text className="text-blue-600 font-medium">Ver Detalles</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Membership Info */}
        <View className="mx-4 mb-8">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center">
                <Calendar color="#2563eb" size={20} />
              </View>
              <View className="ml-3">
                <Text className="font-bold text-gray-800">Miembro desde</Text>
                <Text className="text-gray-600">{user.memberSince}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Logout */}
      <View className="p-4">
        <TouchableOpacity className="flex-row items-center justify-center py-3 border border-red-500 rounded-xl">
          <LogOut color="#EF4444" size={20} />
          <Text className="text-red-500 font-bold ml-2">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
