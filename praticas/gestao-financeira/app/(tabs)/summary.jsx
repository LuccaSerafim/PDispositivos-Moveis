import { useContext, useMemo, useState } from "react";
import { MoneyContext } from "../../contexts/GlobalState";
import { globalStyles } from "../../styles/globalstyles";
import SummaryItem from "../../components/SummaryItem";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from "react-native";
import { colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const screenWidth = Dimensions.get("window").width;

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

  const pieData = useMemo(() => {
    return categories
      .filter((cat) => !cat.isIncome && (totals.map[cat.id] ?? 0) > 0)
      .map((cat) => ({
        name: cat.displayName,
        population: totals.map[cat.id],
        color: cat.background,
        legendFontColor: colors.primaryText,
        legendFontSize: 13,
      }));
  }, [categories, totals]);

  const valueStyle = totals.sum > 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <ScrollView style={globalStyles.screenContainer}>
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

      {/* Gráfico de pizza */}
      {pieData.length > 0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Despesas por categoria</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
          />
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Text style={globalStyles.secondaryText}>
            Nenhuma despesa em {MONTHS[selectedMonth]} {selectedYear}
          </Text>
        </View>
      )}

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
    </ScrollView>
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
  chartContainer: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 8,
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