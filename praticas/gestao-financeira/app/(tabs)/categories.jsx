import { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import { globalStyles } from "../../styles/globalstyles";
import { colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

const SUGGESTED_COLORS = [
  "#FF6B6B", "#FFB6B6", "#FFD93D", "#6BCB77",
  "#4D96FF", "#82C9DE", "#AB8FBE", "#DEA17B",
];

export default function Categories() {
  const { categories, addCategory, removeCategory } = useContext(MoneyContext);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [icon, setIcon] = useState("label");
  const [background, setBackground] = useState(SUGGESTED_COLORS[0]);
  const [isIncome, setIsIncome] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name || name.length < 2) {
      Alert.alert("Erro", "Nome técnico precisa ter pelo menos 2 caracteres!");
      return;
    }
    if (!displayName || displayName.length < 2) {
      Alert.alert("Erro", "Nome de exibição precisa ter pelo menos 2 caracteres!");
      return;
    }

    setSaving(true);
    try {
      await addCategory({ name, displayName, icon, background, isIncome });
      setName("");
      setDisplayName("");
      setIcon("label");
      setBackground(SUGGESTED_COLORS[0]);
      setIsIncome(false);
      Alert.alert("Sucesso!", "Categoria criada com sucesso!");
    } catch (e) {
      Alert.alert("Erro", e.message ?? "Não foi possível criar a categoria.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir categoria",
      "Tem certeza que deseja excluir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removeCategory(id) },
      ]
    );
  };

  return (
    <FlatList
      style={globalStyles.screenContainer}
      contentContainerStyle={styles.container}
      data={categories}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.form}>
          <Text style={globalStyles.inputLabel}>Nome técnico (ex: health)</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="health"
            autoCapitalize="none"
          />

          <Text style={globalStyles.inputLabel}>Nome de exibição (ex: Saúde)</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Saúde"
          />

          <Text style={globalStyles.inputLabel}>Ícone (Material Icon, ex: favorite)</Text>
          <TextInput
            style={styles.input}
            value={icon}
            onChangeText={setIcon}
            placeholder="favorite"
            autoCapitalize="none"
          />

          <Text style={globalStyles.inputLabel}>Cor</Text>
          <View style={styles.colorPalette}>
            {SUGGESTED_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  background === color && styles.colorSelected,
                ]}
                onPress={() => setBackground(color)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.toggleIncome}
            onPress={() => setIsIncome((prev) => !prev)}
          >
            <MaterialIcons
              name={isIncome ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={colors.primary}
            />
            <Text style={globalStyles.primaryText}> É uma receita?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? "Salvando..." : "Criar Categoria"}
            </Text>
          </TouchableOpacity>

          <View style={globalStyles.line} />
          <Text style={[globalStyles.primaryText, styles.listTitle]}>
            Categorias
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.categoryRow}>
          <View style={[styles.colorDot, { backgroundColor: item.background }]}>
            <MaterialIcons name={item.icon} size={20} color="#fff" />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={globalStyles.primaryText}>{item.displayName}</Text>
            <Text style={globalStyles.secondaryText}>
              {item.isDefault ? "padrão" : "personalizada"}
              {item.isIncome ? " · receita" : ""}
            </Text>
          </View>
          {!item.isDefault && (
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <MaterialIcons name="delete" size={24} color={colors.negativeText ?? "#e74c3c"} />
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  form: { gap: 8, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: colors.secondaryText,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.primaryText,
  },
  colorPalette: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: colors.primaryText,
  },
  toggleIncome: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryInfo: { flex: 1 },
});