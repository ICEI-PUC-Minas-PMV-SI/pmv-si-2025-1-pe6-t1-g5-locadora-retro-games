import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface GuestModalProps {
  visible: boolean;
  onClose: () => void;
}

const GuestModal: React.FC<GuestModalProps> = ({ visible, onClose }) => {
  const handleLogin = () => {
    onClose();
    router.push('/login');
  };
  const handleRegister = () => {
    onClose();
    router.push('/register');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle-outline" size={80} color="#a855f7" />
            </View>
            
            <Text style={styles.title}>Bem-vindo ao NintendiN!</Text>
            <Text style={styles.subtitle}>
              Faça login ou cadastre-se para acessar todas as funcionalidades
            </Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Ionicons name="log-in-outline" size={20} color="#ffffff" />
                <Text style={styles.loginButtonText}>Fazer Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Ionicons name="person-add-outline" size={20} color="#a855f7" />
                <Text style={styles.registerButtonText}>Cadastrar-se</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Continue navegando sem cadastro, mas algumas funcionalidades podem ser limitadas
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a855f7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3e8ff',
    borderWidth: 2,
    borderColor: '#a855f7',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  registerButtonText: {
    color: '#a855f7',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default GuestModal;
