import { StyleSheet, Platform } from "react-native";

const PRIMARY = "#2C3E50";
const ACCENT = "#3498DB";
const GRADIENT_A = "#36D1DC";
const GRADIENT_B = "#5B86E5";
const SUCCESS = "#43A047";
const DANGER = "#E53935";
const SURFACE = "#FFFFFF";
const BG = "#F5F7FB";
const INPUT_BORDER = "#D6E0F0";

const ExpensesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    padding: 22,
    justifyContent: "flex-start",
  },

  header: {
    fontSize: 26,
    fontWeight: "800",
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 18,
  },

  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },

  iconLeft: {
    position: "absolute",
    top: Platform.OS === "ios" ? 14 : 15,
    left: 12,
    zIndex: 5,
  },

  input: {
    backgroundColor: SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    paddingVertical: 14,
    paddingLeft: 44, 
    paddingRight: 56, 
    fontSize: 16,
    color: PRIMARY,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  inputFocused: {
    borderColor: ACCENT,
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  errorInput: {
    borderColor: DANGER,
  },

  currencyPickerInside: {
    position: "absolute",
    right: 10,
    top: Platform.OS === "ios" ? 10 : 8,
    zIndex: 6,
  },

  floatingLabel: {
    position: "absolute",
    top: -10,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    color: ACCENT,
    backgroundColor: BG,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ACCENT,
    zIndex: 10,
    overflow: "hidden",
  },

  // Date picker button
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#EEF7FF",
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    marginTop: 17,
    marginBottom: 8,
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "600",
  },

  gradientButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    shadowColor: GRADIENT_A,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  gradientButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
  },

  button: {
    backgroundColor: GRADIENT_B,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  secondaryButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    color: GRADIENT_B,
    fontWeight: "700",
  },

  successBanner: {
    position: "absolute",
    top: 12,
    left: "8%",
    right: "8%",
    backgroundColor: SUCCESS,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  successText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  errorBanner: {
    position: "absolute",
    top: 12,
    left: "8%",
    right: "8%",
    backgroundColor: DANGER,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  errorText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  loaderContainer: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  smallGap: {
    height: 8,
  },
  mediumGap: {
    height: 16,
  },

  topActionButton: {
    backgroundColor: SURFACE,
    padding: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default ExpensesStyles;
