import { StyleSheet, Text, TouchableHighlight } from "react-native"
import { colors } from "../constants/colors"

export default function Button({ children, onPress }) {
  return (
    <TouchableHighlight style={styles.background} onPress={onPress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.primaryContrast,
    fontSize: 18,
    fontWeight: "600",
  },
})