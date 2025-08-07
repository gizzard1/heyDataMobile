/**
 * Register Screen - HeyData Mobile
 * 
 * @format
 */

import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  Text, 
  useColorScheme, 
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

interface RegisterScreenProps {
  onBackToLogin: () => void;
}

function RegisterScreen({ onBackToLogin }: RegisterScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    Alert.alert('Registro', `Email: ${email}\nContraseña: ${password}`);
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#2C2C2C' }]}>
            ¡Hola!
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#FFFFFF' : '#2C2C2C' }]}>
            Te damos la bienvenida
          </Text>
          <Text style={[styles.description, { color: isDarkMode ? '#CCCCCC' : '#999999' }]}>
            Haz crecer tu negocio y gestiónalo{'\n'}desde un solo lugar
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#2C2C2C' }]}>
              Email
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                color: isDarkMode ? '#FFFFFF' : '#2C2C2C'
              }]}
              placeholder="example@mail.com"
              placeholderTextColor={isDarkMode ? '#666666' : '#CCCCCC'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#2C2C2C' }]}>
              Contraseña
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                color: isDarkMode ? '#FFFFFF' : '#2C2C2C'
              }]}
              placeholder="••••••••••"
              placeholderTextColor={isDarkMode ? '#666666' : '#CCCCCC'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#2C2C2C' }]}>
              Confirmar contraseña
            </Text>
            <TextInput
              style={[styles.input, { 
                borderColor: isDarkMode ? '#404040' : '#E0E0E0',
                backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
                color: isDarkMode ? '#FFFFFF' : '#2C2C2C'
              }]}
              placeholder="••••••••••"
              placeholderTextColor={isDarkMode ? '#666666' : '#CCCCCC'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              ¿Ya tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.loginLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    color: '#E53E3E',
    fontWeight: '500',
  },
});

export default RegisterScreen;
