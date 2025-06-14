import React, { useState, useEffect } from 'react';
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
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, processCheckout } from '../../services/api';

interface CardData {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

const CheckoutScreen = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    holderName: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    ccv: '',
  });

  // Verificar se usuário está logado
  useEffect(() => {
    if (!user) {
      Alert.alert(
        'Acesso Negado',
        'Você precisa estar logado para acessar o checkout.',
        [{ text: 'OK', onPress: () => router.replace('/quick-register') }]
      );
    }
  }, [user]);

  const formatCardNumber = (text: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = text.replace(/\D/g, '');
    // Adiciona espaços a cada 4 dígitos
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limita a 16 dígitos + 3 espaços
  };

  const formatExpiry = (text: string, field: 'month' | 'year') => {
    const cleaned = text.replace(/\D/g, '');
    if (field === 'month') {
      return cleaned.substring(0, 2);
    }
    return cleaned.substring(0, 4);
  };

  const formatCCV = (text: string) => {
    return text.replace(/\D/g, '').substring(0, 3);
  };

  const validateCardData = (): boolean => {
    if (!cardData.holderName.trim()) {
      Alert.alert('Erro', 'Nome do portador é obrigatório');
      return false;
    }

    const cleanNumber = cardData.number.replace(/\s/g, '');
    if (cleanNumber.length !== 16) {
      Alert.alert('Erro', 'Número do cartão deve ter 16 dígitos');
      return false;
    }

    const month = parseInt(cardData.expiryMonth);
    if (!cardData.expiryMonth || month < 1 || month > 12) {
      Alert.alert('Erro', 'Mês de vencimento inválido');
      return false;
    }

    const currentYear = new Date().getFullYear();
    const year = parseInt(cardData.expiryYear);
    if (!cardData.expiryYear || year < currentYear || year > currentYear + 20) {
      Alert.alert('Erro', 'Ano de vencimento inválido');
      return false;
    }

    if (!cardData.ccv || cardData.ccv.length !== 3) {
      Alert.alert('Erro', 'CCV deve ter 3 dígitos');
      return false;
    }

    return true;
  };
  const handleCheckout = async () => {
    if (!validateCardData()) return;

    setIsLoading(true);    try {
      // Primeiro, criar o pedido com lista de IDs dos jogos
      console.log('🛒 Full cart contents:', cart);
      console.log('📊 Cart length:', cart.length);
      
      const gameIds = cart.map(item => item.id);
      console.log('🎮 Game IDs to send:', gameIds);
      console.log('� GameIds length:', gameIds.length);
      
      // Contar quantos de cada jogo temos
      const gameCount = {};
      gameIds.forEach(id => {
        gameCount[id] = (gameCount[id] || 0) + 1;
      });
      console.log('📈 Game count breakdown:', gameCount);
      
      const orderResponse = await createOrder(gameIds);
      console.log('✅ Order created:', orderResponse);

      // Verificar se temos o orderId na resposta
      const orderId = orderResponse.orderId;
      if (!orderId) {
        throw new Error('Order ID not received from server');
      }

      // Em seguida, processar o pagamento
      const paymentData = {
        holderName: cardData.holderName,
        number: cardData.number.replace(/\s/g, ''),
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        ccv: cardData.ccv,
        value: getTotalPrice(),
      };

      console.log('💳 Processing payment for order:', orderId);
      const checkoutResponse = await processCheckout(orderId, paymentData);
      console.log('✅ Payment processed:', checkoutResponse);

      Alert.alert(
        'Sucesso!',
        'Pagamento processado com sucesso! Seus pedidos foram confirmados.',
        [
          {
            text: 'OK',            onPress: () => {
              clearCart();
              router.replace('/home');
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Checkout error:', error);
      
      let errorMessage = 'Erro ao processar pagamento. Tente novamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (typeof error.response?.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
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
          <Text style={styles.headerTitle}>Finalizar Compra</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total de itens:</Text>
                <Text style={styles.summaryValue}>{cart.length}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>{formatPrice(getTotalPrice())}</Text>
              </View>
            </View>
          </View>

          {/* Payment Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados do Cartão</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome do Portador</Text>
              <TextInput
                style={styles.input}
                placeholder="Como está no cartão"
                value={cardData.holderName}
                onChangeText={(text) => setCardData(prev => ({ ...prev, holderName: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Número do Cartão</Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                value={cardData.number}
                onChangeText={(text) => setCardData(prev => ({ ...prev, number: formatCardNumber(text) }))}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Mês</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM"
                  value={cardData.expiryMonth}
                  onChangeText={(text) => setCardData(prev => ({ ...prev, expiryMonth: formatExpiry(text, 'month') }))}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Ano</Text>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA"
                  value={cardData.expiryYear}
                  onChangeText={(text) => setCardData(prev => ({ ...prev, expiryYear: formatExpiry(text, 'year') }))}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>CCV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="000"
                  value={cardData.ccv}
                  onChangeText={(text) => setCardData(prev => ({ ...prev, ccv: formatCCV(text) }))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Checkout Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]}
            onPress={handleCheckout}
            disabled={isLoading}
          >
            <Text style={styles.checkoutButtonText}>
              {isLoading ? 'Processando...' : `Pagar ${formatPrice(getTotalPrice())}`}
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1f2937',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a855f7',
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
  rowInputs: {
    flexDirection: 'row',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  checkoutButton: {
    backgroundColor: '#a855f7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;
