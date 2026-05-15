import { useContext, useMemo, useState } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { globalStyles } from "../../styles/globalstyles";
import SummaryItem from "../../components/SummaryItem";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Summary() {
  const { transactions, categories } = useContext(MoneyContext);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const totals = useMemo(() => {
    const map = {};
    let sum = 0;

    for (const cat of categories) {
      map[cat.id] = 0;
    }

    for (const item of transactions) {
      const date = new Date(item.date);
      if (
        date.getMonth() !== selectedMonth ||
        date.getFullYear() !== selectedYear
      ) continue;

      if (map[item.categoryId] === undefined) continue;
      map[item.categoryId] += Number(item.value);

      if (item.category?.isIncome) {
        sum += Number(item.value);
      } else {
        sum -= Number(item.value);
      }
    }

    return { map, sum };
  }, [transactions, categories, selectedMonth, selectedYear]);

  const valueStyle = totals.sum > 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      {/* Filtro de mês/ano */}
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={prevMonth}>
          <MaterialIcons name="chevron-left" size={32} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.filterText}>
          {MONTHS[selectedMonth]} {selectedYear}
        </Text>
        <TouchableOpacity onPress={nextMonth}>
          <MaterialIcons name="chevron-right" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

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
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  balance: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
});