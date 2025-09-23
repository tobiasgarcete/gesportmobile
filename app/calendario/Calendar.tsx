import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  ArrowLeft,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock data for events in different dates
const mockCalendarEvents: Record<
  string,
  { id: string; title: string; time: string; location: string }[]
> = {
  '2023-10-15': [
    {
      id: '1',
      title: 'Campeonato Nacional de Fútbol',
      time: '10:00 AM',
      location: 'Estadio Nacional',
    },
    {
      id: '2',
      title: 'Entrenamiento Equipo Juvenil',
      time: '3:00 PM',
      location: 'Campo Deportivo Norte',
    },
  ],
  '2023-10-18': [
    {
      id: '3',
      title: 'Torneo de Tenis Amateur',
      time: '9:00 AM',
      location: 'Club Tennis Pro',
    },
  ],
  '2023-10-22': [
    {
      id: '4',
      title: 'Maratón Ciudad 2023',
      time: '7:00 AM',
      location: 'Centro Urbano',
    },
  ],
  '2023-10-25': [
    {
      id: '5',
      title: 'Clase de Yoga al Aire Libre',
      time: '6:00 AM',
      location: 'Parque Central',
    },
  ],
  '2023-10-28': [
    {
      id: '6',
      title: 'Partido Amistoso Fútbol',
      time: '4:00 PM',
      location: 'Estadio Municipal',
    },
    {
      id: '7',
      title: 'Torneo de Basquetbol',
      time: '6:00 PM',
      location: 'Gimnasio Central',
    },
  ],
};

// Utils
const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();
const pad = (n: number) => n.toString().padStart(2, '0');
const formatDate = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const getMonthName = (m: number) =>
  [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ][m];
const getDayNames = () => ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const toDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  // UTC para evitar problemas de huso horario
  return new Date(Date.UTC(y, m - 1, d));
};
const diffInDays = (a: string, b: string) => {
  const ms = toDate(a).getTime() - toDate(b).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};
const addDays = (dateStr: string, days: number) => {
  const dt = toDate(dateStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return formatDate(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate());
};

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Nuevo: rango configurable
  const [rangeDays, setRangeDays] = useState<1 | 3 | 7>(3);

  const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.year, currentDate.month);
  const monthName = getMonthName(currentDate.month);

  // Calendar cells
  const calendarDays = useMemo(() => {
    const days: ({ day: number; dateStr: string; hasEvents: boolean } | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentDate.year, currentDate.month, day);
      const hasEvents = !!mockCalendarEvents[dateStr]?.length;
      days.push({ day, dateStr, hasEvents });
    }
    return days;
  }, [firstDayOfMonth, daysInMonth, currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  };
  const goToNextMonth = () => {
    setCurrentDate(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  };

  const isSelectedDate = (dateStr: string) => dateStr === selectedDate;
  const isToday = (dateStr: string) => dateStr === todayStr;

  const eventsForSelectedDate = mockCalendarEvents[selectedDate] || [];

  // Eventos cercanos (±rangeDays) a la fecha seleccionada
  const nearbyEvents = useMemo(() => {
    const list: {
      date: string;
      delta: number;
      id: string;
      title: string;
      time: string;
      location: string;
    }[] = [];
    Object.keys(mockCalendarEvents).forEach((date) => {
      const delta = diffInDays(date, selectedDate); // + futuro / - pasado
      if (date !== selectedDate && Math.abs(delta) <= rangeDays) {
        mockCalendarEvents[date].forEach((ev) =>
          list.push({ date, delta, ...ev }),
        );
      }
    });
    return list.sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta));
  }, [selectedDate, rangeDays]);

  // Filtros rápidos
  const goToday = () => {
    setSelectedDate(todayStr);
    setCurrentDate({ year: today.getFullYear(), month: today.getMonth() });
  };
  const goTomorrow = () => {
    const tomorrowStr = addDays(todayStr, 1);
    const d = toDate(tomorrowStr);
    setSelectedDate(tomorrowStr);
    setCurrentDate({ year: d.getUTCFullYear(), month: d.getUTCMonth() });
  };
  const goNext7FromToday = () => {
    // centra en hoy y ajusta rango a 7
    setRangeDays(7);
    goToday();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-700 pt-12 pb-6 px-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-white/20 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <ArrowLeft color="white" size={20} />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold text-center flex-1">
          Calendario Deportivo
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Calendar Header */}
      <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm p-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={goToPreviousMonth}>
            <ChevronLeft color="#2563eb" size={24} />
          </TouchableOpacity>

          <Text className="text-xl font-bold text-gray-800">
            {monthName} {currentDate.year}
          </Text>

          <TouchableOpacity onPress={goToNextMonth}>
            <ChevronRight color="#2563eb" size={24} />
          </TouchableOpacity>
        </View>

        {/* Day Names */}
        <View className="flex-row justify-between mb-2">
          {getDayNames().map((day, i) => (
            <Text
              key={i}
              className={`w-10 h-10 text-center font-medium ${
                i === 0 ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex-row flex-wrap">
          {calendarDays.map((day, index) =>
            day ? (
              <TouchableOpacity
                key={index}
                className={`w-10 h-10 items-center justify-center rounded-full m-0.5 ${
                  isSelectedDate(day.dateStr)
                    ? 'bg-blue-600'
                    : isToday(day.dateStr)
                    ? 'bg-blue-100 border border-blue-300'
                    : ''
                }`}
                onPress={() => setSelectedDate(day.dateStr)}
              >
                <Text
                  className={`${
                    isSelectedDate(day.dateStr)
                      ? 'text-white'
                      : isToday(day.dateStr)
                      ? 'text-blue-600'
                      : 'text-gray-700'
                  } font-medium`}
                >
                  {day.day}
                </Text>
                {day.hasEvents && !isSelectedDate(day.dateStr) && (
                  <View className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full" />
                )}
              </TouchableOpacity>
            ) : (
              <View key={index} className="w-10 h-10 m-0.5" />
            ),
          )}
        </View>

        {/* Filtros rápidos + rango */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ paddingRight: 6 }}
        >
          {/* Rápidos */}
          <Pressable
            onPress={goToday}
            android_ripple={{ color: '#bfdbfe' }}
            className="mr-2 px-3 py-1.5 rounded-full bg-blue-50"
          >
            <Text className="text-blue-700 text-sm font-semibold">Hoy</Text>
          </Pressable>
          <Pressable
            onPress={goTomorrow}
            android_ripple={{ color: '#bfdbfe' }}
            className="mr-2 px-3 py-1.5 rounded-full bg-blue-50"
          >
            <Text className="text-blue-700 text-sm font-semibold">Mañana</Text>
          </Pressable>
          <Pressable
            onPress={goNext7FromToday}
            android_ripple={{ color: '#bfdbfe' }}
            className="mr-3 px-3 py-1.5 rounded-full bg-blue-50"
          >
            <Text className="text-blue-700 text-sm font-semibold">
              Próximos 7 días
            </Text>
          </Pressable>

          {/* Rangos ±1/±3/±7 */}
          {[1, 3, 7].map((r) => {
            const active = r === rangeDays;
            return (
              <Pressable
                key={r}
                onPress={() => setRangeDays(r as 1 | 3 | 7)}
                android_ripple={{ color: '#bfdbfe' }}
                className={`mr-2 px-3 py-1.5 rounded-full ${
                  active ? 'bg-blue-600' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm ${
                    active ? 'text-white font-semibold' : 'text-gray-700'
                  }`}
                >
                  ±{r} días
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Events for Selected Date */}
      <View className="mt-4 mx-4">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Eventos para el {selectedDate}
        </Text>

        {eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map((event) => (
            <TouchableOpacity
              key={event.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm"
            >
              <Text className="text-lg font-bold text-gray-800 mb-1">
                {event.title}
              </Text>
              <View className="flex-row items-center mt-2">
                <CalendarIcon color="#6b7280" size={16} />
                <Text className="text-gray-600 ml-2">{event.time}</Text>
              </View>
              <View className="flex-row items-center mt-1">
                <MapPin color="#6b7280" size={16} />
                <Text className="text-gray-600 ml-2">{event.location}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 items-center justify-center mb-3">
            <CalendarIcon color="#9ca3af" size={48} />
            <Text className="text-gray-500 text-center mt-4">
              No hay eventos programados para esta fecha
            </Text>
          </View>
        )}
      </View>

      {/* Eventos cercanos */}
      <View className="flex-1 mx-4">
        <Text className="text-base font-semibold text-gray-700 mb-2">
          También cerca (±{rangeDays} días)
        </Text>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {nearbyEvents.length > 0 ? (
            nearbyEvents.map((ev) => (
              <Pressable
                key={`${ev.date}-${ev.id}`}
                onPress={() => {
                  setSelectedDate(ev.date);
                  const d = toDate(ev.date);
                  setCurrentDate({
                    year: d.getUTCFullYear(),
                    month: d.getUTCMonth(),
                  });
                }}
                android_ripple={{ color: '#e5e7eb' }}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-sm font-semibold text-blue-700">
                    {ev.date}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {ev.delta === 0
                      ? 'Hoy'
                      : ev.delta > 0
                      ? `En ${ev.delta}d`
                      : `Hace ${Math.abs(ev.delta)}d`}
                  </Text>
                </View>
                <Text className="text-base font-bold text-gray-800">
                  {ev.title}
                </Text>
                <View className="flex-row items-center mt-2">
                  <CalendarIcon color="#6b7280" size={16} />
                  <Text className="text-gray-600 ml-2">{ev.time}</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <MapPin color="#6b7280" size={16} />
                  <Text className="text-gray-600 ml-2">{ev.location}</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <Text className="text-gray-500">
                No hay eventos cercanos en ±{rangeDays} días.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <View className="flex-row justify-between items-center px-6 py-3">
          {/* Left Section */}
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-row items-center mr-6">
              <Text className="text-blue-600 font-medium">Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center bg-blue-100 px-3 py-2 rounded-lg">
              <Text className="text-blue-600 font-medium ml-2">Ver los eventos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
