import { useContext, useMemo } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { globalStyles } from "../../styles/globalstyles";
import SummaryItem from "../../components/SummaryItem";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/colors";

export default function Summary() {
  const { transactions, categories } = useContext(MoneyContext);

  const totals = useMemo(() => {
    const map = {};
    let sum = 0;

    for (const cat of categories) {
      map[cat.id] = 0;
    }

    for (const item of transactions) {
      if (map[item.categoryId] === undefined) continue;
      map[item.categoryId] += Number(item.value);

      if (item.category?.isIncome) {
        sum += Number(item.value);
      } else {
        sum -= Number(item.value);
      }
    }

    return { map, sum };
  }, [transactions, categories]);

  const valueStyle = totals.sum > 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.content}>
        {categories.map((cat) => (
          <SummaryItem
            key={cat.id}
            category={cat}
            value={totals.map[cat.id] ?? 0}
          />
        ))}

        <View style={globalStyles.line} />

        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={valueStyle}>
            {totals.sum.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
});