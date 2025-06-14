import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animação de entrada do logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Após 2 segundos, fazer animação de saída e navegar
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -height,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/home');
      });
    }, 2000);
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>🎮</Text>
        <Text style={styles.title}>Nintendin</Text>
        <Text style={styles.subtitle}>Retro Games Store</Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                width: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />        </View>
      </View>
    </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#a855f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e9d5ff',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    width: width * 0.6,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});

export default SplashScreen;
