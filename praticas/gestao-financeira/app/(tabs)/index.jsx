import { MoneyContext } from "../../contexts/GlobalState";
import { useContext, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, RefreshControl,
  Text, View, Modal, TextInput, TouchableOpacity, StyleSheet
} from "react-native";
import TransactionItem from "../../components/TransactionItem";
import { globalStyles } from "../../styles/globalstyles";
import { colors } from "../../constants/colors";
import { Picker } from "@react-native-picker/picker";

export default function Transactions() {
  const { transactions, categories, loading, error, refresh, removeTransaction, updateTransaction } = useContext(MoneyContext);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const handleLongPress = (item) => {
    Alert.alert(
      "O que deseja fazer?",
      item.description,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Editar", onPress: () => openEdit(item) },
        { text: "Excluir", style: "destructive", onPress: () => confirmDelete(item.id) },
      ]
    );
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Excluir transação",
      "Tem certeza que deseja excluir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removeTransaction(id) },
      ]
    );
  };

  const openEdit = (item) => {
    setEditingTransaction(item);
    setEditForm({
      description: item.description,
      value: String(Number(item.value)),
      categoryId: item.categoryId,
    });
  };

  const handleSaveEdit = async () => {
    if (!editForm.description) {
      Alert.alert("Erro", "Preencha a descrição!");
      return;
    }
    if (!editForm.value || Number(editForm.value) <= 0) {
      Alert.alert("Erro", "Informe um valor válido!");
      return;
    }

    setSaving(true);
    try {
      await updateTransaction(editingTransaction.id, {
        description: editForm.description,
        value: Number(editForm.value),
        categoryId: editForm.categoryId,
        date: editingTransaction.date,
      });
      setEditingTransaction(null);
      Alert.alert("Sucesso!", "Transação atualizada!");
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível atualizar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.screenContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.screenContainer}>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <Text style={globalStyles.secondaryText} onPress={refresh}>
          Tentar novamente
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TransactionItem {...item} onLongPress={() => handleLongPress(item)} />
        )}
        ListEmptyComponent={
          <Text style={globalStyles.secondaryText}>
            Ainda não há nenhum item!
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        style={globalStyles.content}
      />

      <Modal
        visible={!!editingTransaction}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingTransaction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Transação</Text>

            <Text style={globalStyles.inputLabel}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={editForm.description}
              onChangeText={(v) => setEditForm({ ...editForm, description: v })}
            />

            <Text style={globalStyles.inputLabel}>Valor</Text>
            <TextInput
              style={styles.input}
              value={editForm.value}
              onChangeText={(v) => setEditForm({ ...editForm, value: v })}
              keyboardType="numeric"
            />

            <Text style={globalStyles.inputLabel}>Categoria</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={editForm.categoryId}
                onValueChange={(v) => setEditForm({ ...editForm, categoryId: v })}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.displayName} value={cat.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditingTransaction(null)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, saving && styles.buttonDisabled]}
                onPress={handleSaveEdit}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.primaryText,
  },
  picker: {
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.secondaryText,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.primaryText,
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});