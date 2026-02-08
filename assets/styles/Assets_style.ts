import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const AssetsStyles = StyleSheet.create({
  // Container Styles
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  // Title
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },

  // Actions Container
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: "#f0f4ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#d1e0ff",
  },
  transferButton: {
    backgroundColor: "#fff5f0",
    borderColor: "#ffd9c4",
  },
  iconButtonText: {
    color: "#4a684bff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Total Assets Widget
  totalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007BFF",
  },

  // Toggle Container
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    elevation: 1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#007BFF",
  },
  toggleButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },

  // Chart Container
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Legend
  legendContainer: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendContent: {
    flex: 1,
  },
  legendName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  legendValue: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  // List Section
  listSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },

  // List Container
  listContainer: {
    paddingBottom: 16,
  },

  // List Item
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  listItemContent: {
    flex: 1,
    marginRight: 12,
    justifyContent: "center",
  },
  listItemBank: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 6,
    lineHeight: 20,
  },
  listItemDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  listItemType: {
    fontSize: 13,
    color: "#757575",
    fontWeight: "500",
  },
  listItemRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 8,
  },
  listItemAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 4,
  },
  currencyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  currencyFlag: {
    fontSize: 16,
  },
  listItemCurrency: {
    fontSize: 13,
    color: "#757575",
    fontWeight: "600",
  },
  chevronIcon: {
    marginLeft: 4,
  },
  payableBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  payableBadgeText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  separator: {
    height: 0,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#757575",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BDBDBD",
    marginTop: 8,
    textAlign: "center",
  },

  // Nuovo wrapper per il filtro
  filterButtonWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  // Filter Button
  filterButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Nuova riga superiore del filtro
  filterButtonTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  filterButtonTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  filterButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },

  // Badge modificato - ora è dentro il container
  filterActiveBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "flex-start",
  },

  filterActiveBadgeText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  // Filter Modal
  filterModalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    flex: 1,
  },
  filterModalScrollView: {
    flex: 1,
  },
  filterModalContent: {
    padding: 20,
    paddingBottom: 10,
  },
  filterModalFooter: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  filterCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  filterCheckboxLabel: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
    fontWeight: "500",
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  filterOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  filterOptionText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: "#007BFF",
    fontWeight: "600",
  },
  filterApplyButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  filterApplyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Sort Container
  sortContainer: {
    gap: 12,
  },
  sortLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  sortButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sortButtonActive: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  sortButtonText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  sortButtonTextActive: {
    color: "#fff",
  },

  // Order Button
  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  orderButtonText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
  },

  // Form Container
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },

  // Checkbox
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  checkboxHint: {
    fontSize: 12,
    color: "#666",
    marginLeft: 34,
    fontStyle: "italic",
  },

  // Buttons
  submitButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#FF9800",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },

  // Selector
  selectorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectorText: {
    fontSize: 16,
    color: "#333",
  },
  selectorPlaceholder: {
    fontSize: 16,
    color: "#999",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    padding: 10,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  modalOptionSelected: {
    backgroundColor: "#E3F2FD",
  },
  modalOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  modalOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  customBankOption: {
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  customBankContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  customBankInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  customBankButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  customBankButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Transfer Screen
  transferContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  assetCard: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  assetCardSelected: {
    borderColor: "#007BFF",
    backgroundColor: "#E3F2FD",
  },
  assetCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  assetCardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  assetCardContent: {
    gap: 5,
  },
  assetCardBank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  assetCardType: {
    fontSize: 14,
    color: "#666",
  },
  assetCardAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
    marginTop: 5,
  },
  assetCardPlaceholder: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  assetsList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 5,
  },
  assetListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
  },
  assetListItemSelected: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  assetListItemContent: {
    flex: 1,
  },
  assetListItemBank: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  assetListItemType: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  assetListItemAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007BFF",
  },
  transferIconContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  availableAmount: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  conversionInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    gap: 10,
  },
  conversionText: {
    flex: 1,
    fontSize: 13,
    color: "#E65100",
  },

  // Transfer Screen - NEW COMPACT STYLES
  transferScrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  transferMainCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  transferHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  transferHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  // Compact Asset Cards
  compactAssetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  compactAssetCardFilled: {
    backgroundColor: "#F0F9FF",
    borderColor: "#BFDBFE",
  },
  compactCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  compactCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  compactCardInfo: {
    flex: 1,
  },
  compactCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  compactCardBank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  compactCardAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007BFF",
  },
  compactCardPlaceholder: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
  },

  // Swap Button
  swapButton: {
    alignSelf: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    zIndex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  // Amount Section (nella schermata Transfer)
  amountSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  amountHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  amountInput: {
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    borderRadius: 10,
    padding: 14,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    backgroundColor: "#FAFBFC",
  },
  availableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    justifyContent: "center",
  },
  availableText: {
    fontSize: 12,
    color: "#6B7280",
  },
  currencyWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF8E1",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#F57C00",
  },
  currencyWarningText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#E65100",
  },

  // Transfer Button Execute (nella schermata Transfer - diverso dal transferButton principale!)
  transferButtonExecute: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    elevation: 2,
    shadowColor: "#007BFF",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  transferButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },


  assetPickerList: {
    padding: 16,
  },

  // Asset Picker Items
  assetPickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  assetPickerItemDisabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.5,
  },
  assetPickerItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  assetPickerItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  assetPickerItemBank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  assetPickerItemType: {
    fontSize: 13,
    color: "#6B7280",
  },
  assetPickerItemRight: {
    alignItems: "flex-end",
  },
  assetPickerItemAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  assetPickerItemCurrency: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  assetPickerItemTextDisabled: {
    color: "#9CA3AF",
  },

  // Details Screen
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  detailValueLarge: {
    fontSize: 20,
    color: "#007BFF",
    fontWeight: "bold",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  actionsSection: {
    gap: 10,
  },

  // Transaction History Section
  transactionHistorySection: {
    marginTop: 20,
  },
  transactionHistoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionHistoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  summaryCardContent: {
    flex: 1,
  },
  summaryCardLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  summaryCardValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Transaction List
  transactionListContainer: {
    paddingBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
    marginRight: 12,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  transactionCurrency: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  transactionSeparator: {
    height: 12,
  },

  // Empty Transactions State
  emptyTransactionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 1,
  },
  emptyTransactionsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#757575",
    marginTop: 16,
    textAlign: "center",
  },
  emptyTransactionsSubtext: {
    fontSize: 14,
    color: "#BDBDBD",
    marginTop: 8,
    textAlign: "center",
  },

  // Transaction Loading
  transactionLoadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 1,
  },

  // Error and No Data
  errorText: {
    color: "#F44336",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  noDataText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    fontStyle: "italic",
  },

  // Victory Pie Chart Styles
  pieScrollContainer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  pieChartCard: {
    backgroundColor: "#fff",
    width: screenWidth * 0.9,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pieHeaderSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  pieTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pieSubtitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  pieCurrencyBadge: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pieCurrencyFlag: {
    fontSize: 16,
  },
  pieCurrencyText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: 0.5,
  },
  pieChartContainer: {
    position: "relative",
    alignItems: "center",
  },
  pieCenterTotal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -65 }, { translateY: -60 }],
    alignItems: "center",
    backgroundColor: "rgba(248,250,252,0.95)",
    borderRadius: 120,
    paddingVertical: 28,
    paddingHorizontal: 12,
    width: 130,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  pieTotalLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  pieTotalValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pieTotalFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  pieTotalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  pieTotalCurrency: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
  },
  pieCenterTooltip: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -80 }, { translateY: -85 }],
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: 160,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  pieCloseButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  pieCloseIcon: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "700",
  },
  pieColorIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  pieTooltipName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  pieTooltipPercent: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
    marginBottom: 4,
  },
  pieTooltipValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: -0.3,
  },
  pieTooltipCurrency: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 2,
  },
  pieLegendContainer: {
    width: screenWidth * 0.9,
    padding: 20,
    marginTop: 10,
  },
  pieLegendTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  pieLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "transparent",
  },
  pieLegendItemSelected: {
    backgroundColor: "#fff",
    borderColor: "#007BFF",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pieLegendLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pieLegendColorBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    marginRight: 12,
  },
  pieLegendTextContainer: {
    flex: 1,
  },
  pieLegendText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  pieLegendPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  pieLegendRight: {
    alignItems: "flex-end",
  },
  pieLegendValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  pieLegendCurrency: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  emptyChartContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 16,
  },
  emptyChartText: {
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default AssetsStyles;