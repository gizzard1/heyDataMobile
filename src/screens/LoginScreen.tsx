/**
 * Login Screen - HeyData Mobile
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

interface LoginScreenProps {
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
  onLoginSuccess: () => void;
}

function LoginScreen({ onGoToRegister, onGoToForgotPassword, onLoginSuccess }: LoginScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  const handleLogin = () => {
    if (email && password) {
      // Aquí podrías agregar validación real del login
      onLoginSuccess();
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos');
    }
  };

  const handleForgotPassword = () => {
    onGoToForgotPassword();
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
            ¿Cuántas citas agendarás hoy?
          </Text>
          <Text style={[styles.loginText, { color: isDarkMode ? '#CCCCCC' : '#999999' }]}>
            Ingresa tus datos de sesión
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

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, { 
                backgroundColor: rememberMe ? '#E53E3E' : 'transparent',
                borderColor: rememberMe ? '#E53E3E' : (isDarkMode ? '#404040' : '#E0E0E0')
              }]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.rememberText, { color: isDarkMode ? '#FFFFFF' : '#2C2C2C' }]}>
                Recuérdame
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.forgotText, { color: isDarkMode ? '#CCCCCC' : '#999999' }]}>
                Olvidé mi contraseña
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: isDarkMode ? '#CCCCCC' : '#666666' }]}>
              ¿No tienes cuenta?{' '}
            </Text>
            <TouchableOpacity onPress={onGoToRegister}>
              <Text style={styles.registerLink}>Registrarse</Text>
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
    marginBottom: 8,
    fontWeight: '500',
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    color: '#E53E3E',
    fontWeight: '500',
  },
});

export default LoginScreen;
