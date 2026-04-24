import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

function GerenciarDespesa() {
  const navigation = useNavigation();

  const [data, setData] = useState(new Date());
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || data;
    setShowPicker(false);
    setData(currentDate);
  };

  const handleChangeValor = (text) => {
    const cleanText = text.replace(',', '.');
    const match = cleanText.match(/^\d*\.?\d{0,2}$/);
    if (match) {
      setValor(cleanText);
    }
  };

  function handleConfirmar() {
    if (!descricao.trim()) {
      Alert.alert('Erro', 'Por favor, preencha a descrição.');
      return;
    }
    if (!valor || parseFloat(valor) <= 0) {
      Alert.alert('Erro', 'Por favor, preencha um valor válido.');
      return;
    }

    const novaDespesa = {
      id: Math.random().toString(),
      descricao: descricao.trim(),
      valor: parseFloat(valor),
      data: data,
    };

    Alert.alert(
      'Despesa adicionada!',
      `Descrição: ${novaDespesa.descricao}\nValor: R$ ${novaDespesa.valor.toFixed(2)}\nData: ${novaDespesa.data.toLocaleDateString('pt-BR')}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }

  function handleCancelar() {
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Descrição */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            maxLength={20}
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        {/* Valor */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor da Despesa</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            maxLength={10}
            value={valor}
            onChangeText={handleChangeValor}
          />
        </View>

        {/* Data */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data da Despesa</Text>
          <Pressable onPress={() => setShowPicker(true)} style={styles.input}>
            <Text>{data.toLocaleDateString('pt-BR')}</Text>
          </Pressable>
          {showPicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View>

        {/* Botões */}
        <View style={styles.botoesContainer}>
          <Pressable
            style={({ pressed }) => [styles.botao, styles.botaoCancelar, pressed && styles.pressed]}
            onPress={handleCancelar}
          >
            <Text style={styles.botaoTextoCancelar}>Cancelar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.botao, styles.botaoConfirmar, pressed && styles.pressed]}
            onPress={handleConfirmar}
          >
            <Text style={styles.botaoTextoConfirmar}>Confirmar</Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default GerenciarDespesa;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    margin: 20,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoCancelar: {
    borderWidth: 1,
    borderColor: '#5c6bc0',
    backgroundColor: '#fff',
  },
  botaoConfirmar: {
    backgroundColor: '#5c6bc0',
  },
  botaoTextoCancelar: {
    color: '#5c6bc0',
    fontWeight: 'bold',
  },
  botaoTextoConfirmar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.6,
  },
});