/**
 * Forgot Password Screen - HeyData Mobile
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

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

function ForgotPasswordScreen({ onBackToLogin }: ForgotPasswordScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [email, setEmail] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  const handleSendLink = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }
    Alert.alert('Enlace enviado', `Se ha enviado un enlace de recuperación a: ${email}`);
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
            Te enviaremos un correo
          </Text>
          <Text style={[styles.description, { color: isDarkMode ? '#CCCCCC' : '#999999' }]}>
            Ingresa el correo del negocio para{'\n'}obtener un enlace de recuperación
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

          {/* Send Link Button */}
          <TouchableOpacity style={styles.sendButton} onPress={handleSendLink}>
            <Text style={styles.sendButtonText}>Enviar link</Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={styles.backContainer}>
            <TouchableOpacity onPress={onBackToLogin}>
              <Text style={styles.backLink}>Regresar</Text>
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
    color: '#999999',
  },
  form: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 30,
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
  sendButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  backLink: {
    fontSize: 14,
    color: '#E53E3E',
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;
