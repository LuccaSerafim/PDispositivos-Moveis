import { MaterialIcons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import { colors } from "../constants/colors"

export default function CategoryItem({ category }) {
  return (
    <View style={[styles.background, { backgroundColor: category?.background ?? "#ccc" }]}>
      <MaterialIcons
        name={category?.icon ?? "help"}
        size={24}
        color={colors.primaryContrast}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
  },
})