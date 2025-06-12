import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [name, setName] = useState('');

    const handleRegister = () => {
        const response = axios.post('http://localhost:8080/users', {
            email: email.trim(),
            password,
            cpf,
            name
        })
        .then(() => {
            alert('Usuário cadastrado com sucesso!');
            setEmail('');
            setPassword('');
            setCpf('');
            setName('');
        })
        .catch((error) => {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Erro ao cadastrar usuário. Tente novamente.');
        }
        );
        console.log(response);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>🎮</Text>
                    <Text style={styles.logoText}>NintendiN</Text>
                    <Text style={styles.subtitle}>Crie sua conta para começar</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="finger-print-outline" size={20} color="#a855f7" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu nome"
                            placeholderTextColor="#9ca3af"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#a855f7" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu email"
                            placeholderTextColor="#9ca3af"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#a855f7" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua senha"
                            placeholderTextColor="#9ca3af"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="card-outline" size={20} color="#a855f7" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu CPF"
                            placeholderTextColor="#9ca3af"
                            value={cpf}
                            onChangeText={setCpf}
                            keyboardType="numeric"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3e8ff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        fontSize: 60,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#a855f7',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 16,
        backgroundColor: '#f9fafb',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
    },
    registerButton: {
        backgroundColor: '#a855f7',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default RegisterScreen;