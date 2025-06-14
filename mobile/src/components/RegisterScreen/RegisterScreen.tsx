import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = () => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Erro', 'Email válido é obrigatório');
      return false;
    }

    if (!formData.cpf.trim() || formData.cpf.replace(/\D/g, '').length !== 11) {
      Alert.alert('Erro', 'CPF deve conter exatamente 11 dígitos');
      return false;
    }

    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Erro', 'Telefone deve ter pelo menos 10 dígitos');
      return false;
    }

    if (!formData.password.trim() || formData.password.length < 8) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 8 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Preparar dados para envio, removendo formatação do CPF e telefone
      const registrationData = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ''), // Remove pontos e traços
        phone: formData.phone.replace(/\D/g, ''), // Remove parênteses e traços
        password: formData.password,
      };
      
      await register(registrationData);
      
      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso! Você já está logado.',
        [{ text: 'OK', onPress: () => router.replace('/home') }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Erro', 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (text: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = text.replace(/\D/g, '');
    // Formata como (11) 99999-9999
    const formatted = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return formatted.substring(0, 15);
  };

  const formatCPF = (text: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = text.replace(/\D/g, '');
    // Formata como 000.000.000-00
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return formatted.substring(0, 14);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />
      
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cadastro</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="game-controller" size={48} color="#a855f7" />
            </View>
            <Text style={styles.welcomeTitle}>Bem-vindo à Nintendin! 🎮</Text>
            <Text style={styles.welcomeText}>
              Crie sua conta e tenha acesso a centenas de jogos clássicos. 
              É rápido, fácil e totalmente gratuito!
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Seus Dados</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text.toLowerCase() }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CPF</Text>
              <TextInput
                style={styles.input}
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChangeText={(text) => setFormData(prev => ({ ...prev, cpf: formatCPF(text) }))}
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.input}
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: formatPhone(text) }))}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite novamente sua senha"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
              />
            </View>

            <Text style={styles.disclaimer}>
              🔒 Seus dados estão seguros e protegidos. Utilizamos as melhores 
              práticas de segurança para manter suas informações em segurança.
            </Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLinkButton}
            onPress={() => router.replace('/login')}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta? <Text style={styles.loginLinkTextBold}>Faça Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: '#f3e8ff',
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  formSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  disclaimer: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  registerButton: {
    backgroundColor: '#a855f7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLinkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLinkTextBold: {
    color: '#a855f7',
    fontWeight: '600',
  },
});

export default RegisterScreen;
