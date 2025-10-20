// app/auth/LoginScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { signin, session } from "../lib/api";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmitLogin = async () => {
    try {
      setLoading(true);
      await signin(email.trim(), password);   // setea cookie en el back
      const me = await session();             // trae datos del usuario
      // TODO: guarda "me" en contexto/estado global si quieres
      router.replace("/");                    // redirige a home
    } catch (e: any) {
      Alert.alert("Error", "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <Button title={loading ? "Ingresando..." : "Ingresar"} onPress={onSubmitLogin} disabled={loading}/>
    </View>
  );
}
