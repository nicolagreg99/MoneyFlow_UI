import { StyleSheet } from "react-native";

const IncomesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3498DB",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#3498DB",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  datePickerText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ✅ BANNER SUCCESSO
  successBanner: {
    position: "absolute",
    top: 10,
    left: "10%",
    right: "10%",
    backgroundColor: "#2ECC71", // Verde di successo
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 10,
    elevation: 5, // Ombra su Android
    shadowColor: "#000", // Ombra su iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ❌ BANNER ERRORE
  errorBanner: {
    position: "absolute",
    top: 10,
    left: "10%",
    right: "10%",
    backgroundColor: "#E74C3C", // Rosso per errore
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 10,
    elevation: 5, // Ombra su Android
    shadowColor: "#000", // Ombra su iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ⚠️ Stile per campi errati
  errorInput: {
    borderColor: "#E74C3C",
  },

  linkButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#3498DB",
    borderRadius: 8,
    alignItems: "center",
  },
  linkButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  
});

export default IncomesStyles;
 