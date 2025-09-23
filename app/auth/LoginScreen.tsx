import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  address: string;
};

const LoginScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
  });

  // Si llegan con ?mode=register, abrimos el tab de Registro
  useEffect(() => {
    if (params?.mode === 'register') setIsLogin(false);
  }, [params?.mode]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Por favor ingrese un correo válido');
      return;
    }

    Alert.alert('Éxito', 'Inicio de sesión exitoso');
    // Navega a /masinformacion (reemplaza para no volver al login con "atrás")
    router.replace('../masinformacion/Index');
  };

  const handleRegister = () => {
    const { email, password, confirmPassword, fullName, phone, address } = formData;

    if (!email || !password || !confirmPassword || !fullName || !phone || !address) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor ingrese un correo válido');
      return;
    }

    Alert.alert('Éxito', 'Registro exitoso. Ahora puede iniciar sesión');
    setIsLogin(true);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
      <View className="flex-1">
        {/* Header con imagen de fondo */}
        <View className="h-64 relative">
          <Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1629216509258-4dbd7880e605?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fDMlMjBncmFwaGljc3xlbnwwfHwwfHx8MA%3D%3D',
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40 flex items-center justify-center px-6">
            <Text className="text-white text-3xl font-bold text-center">
              {isLogin ? 'Bienvenido a GeSport' : 'Crea tu cuenta'}
            </Text>
            <Text className="text-white text-center mt-2 text-lg">
              {isLogin
                ? 'Accede a eventos deportivos exclusivos'
                : 'Únete a nuestra comunidad deportiva'}
            </Text>
          </View>
        </View>

        {/* Formulario */}
        <View className="p-6 bg-white rounded-t-3xl -mt-6">
          {/* Selector de modo */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl items-center ${isLogin ? 'bg-blue-500' : ''}`}
              onPress={() => setIsLogin(true)}
              accessibilityRole="button"
            >
              <Text className={`font-bold ${isLogin ? 'text-white' : 'text-gray-600'}`}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl items-center ${!isLogin ? 'bg-blue-500' : ''}`}
              onPress={() => setIsLogin(false)}
              accessibilityRole="button"
            >
              <Text className={`font-bold ${!isLogin ? 'text-white' : 'text-gray-600'}`}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campos del formulario */}
          <View className="gap-4">
            {!isLogin && (
              <View className="flex-row items-center bg-gray-100 rounded-xl p-4">
                <User size={20} color="#1A73E8" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Nombre completo"
                  value={formData.fullName}
                  onChangeText={value => handleInputChange('fullName', value)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <View className="flex-row items-center bg-gray-100 rounded-xl p-4">
              <Mail size={20} color="#1A73E8" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={value => handleInputChange('email', value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="flex-row items-center bg-gray-100 rounded-xl p-4">
              <Lock size={20} color="#1A73E8" />
              <TextInput
                className="flex-1 ml-3 text-base"
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} accessibilityRole="button">
                {showPassword ? <EyeOff size={20} color="#1A73E8" /> : <Eye size={20} color="#1A73E8" />}
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View className="flex-row items-center bg-gray-100 rounded-xl p-4">
                <Lock size={20} color="#1A73E8" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Confirmar contraseña"
                  secureTextEntry={!showPassword}
                  value={formData.confirmPassword}
                  onChangeText={value => handleInputChange('confirmPassword', value)}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} accessibilityRole="button">
                  {showPassword ? <EyeOff size={20} color="#1A73E8" /> : <Eye size={20} color="#1A73E8" />}
                </TouchableOpacity>
              </View>
            )}

            {!isLogin && (
              <View className="flex-row items-center bg-gray-100 rounded-xl p-4">
                <Phone size={20} color="#1A73E8" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Número de teléfono"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={value => handleInputChange('phone', value)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            {!isLogin && (
              <View className="flex-row items-center bg-gray-100 rounded-xl p-4">
                <MapPin size={20} color="#1A73E8" />
                <TextInput
                  className="flex-1 ml-3 text-base"
                  placeholder="Dirección"
                  value={formData.address}
                  onChangeText={value => handleInputChange('address', value)}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <TouchableOpacity
              className="bg-blue-500 rounded-xl py-4 items-center mt-4"
              onPress={isLogin ? handleLogin : handleRegister}
              accessibilityRole="button"
            >
              <Text className="text-white text-lg font-bold">
                {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
              </Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity className="mt-4 items-center" accessibilityRole="button">
                <Text className="text-blue-500 font-medium">¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
