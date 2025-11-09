import { StyleSheet } from "react-native";

const MenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    alignItems: "center",
    padding: 16,
  },

  // --- Profilo moderno ---
  profileCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#3498DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  emailText: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 2,
  },
  currencyText: {
    fontSize: 15,
    color: "#3498DB",
    fontWeight: "600",
    marginTop: 4,
  },
  settingsButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#EAF3FB",
  },

  // --- Menu principale ---
  menuWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F8FB",
    padding: 14,
    borderRadius: 12,
    marginVertical: 6,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3498DB",
    marginLeft: 10,
  },

  subMenu: {
    backgroundColor: "#F9FBFC",
    borderRadius: 12,
    marginLeft: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  subText: {
    fontSize: 14,
    color: "#2C3E50",
    marginLeft: 8,
  },

  logoutButton: {
    backgroundColor: "#E74C3C",
    justifyContent: "center",
    marginTop: 14,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 10,
  },

  versionText: {
    marginTop: 18,
    color: "#95A5A6",
    fontSize: 12,
    textAlign: "center",
  },
});

export default MenuStyles;
