import { MoneyContext } from "../../contexts/GlobalState";
import { useContext } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from "react-native";
import TransactionItem from "../../components/TransactionItem";
import { globalStyles } from "../../styles/globalstyles";

export default function Transactions() {
  const { transactions, loading, error, refresh, removeTransaction } = useContext(MoneyContext);

  const handleLongPress = (id) => {
    Alert.alert(
      "Excluir transação",
      "Tem certeza que deseja excluir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => removeTransaction(id) },
      ]
    );
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
          <TransactionItem {...item} onLongPress={() => handleLongPress(item.id)} />
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
    </View>
  );
}