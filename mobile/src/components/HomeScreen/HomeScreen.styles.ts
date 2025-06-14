import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff',
  },  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logo: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#a855f7',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#a855f7',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    alignItems: 'center',
    padding: 10,
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#3b0764',
  },
  cardCategory: {
    fontFamily: 'Poppins_400Regular',
    color: '#a855f7',
    marginTop: 4,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  width: '85%',
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 16,
  alignItems: 'center',
},
modalImage: {
  width: 150,
  height: 150,
  borderRadius: 12,
  marginBottom: 15,
},
modalTitle: {
  fontFamily: 'Poppins_600SemiBold',
  fontSize: 22,
  color: '#3b0764',
  marginBottom: 5,
},
modalCategory: {
  fontFamily: 'Poppins_400Regular',
  color: '#a855f7',
  marginBottom: 20,
},
addButton: {
  backgroundColor: '#a855f7',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  marginBottom: 10,
},
addButtonText: {
  color: '#fff',
  fontFamily: 'Poppins_600SemiBold',
  fontSize: 16,
},
closeButton: {
  paddingVertical: 8,
},
closeButtonText: {
  color: '#a855f7',
  fontFamily: 'Poppins_400Regular',
  fontSize: 14,
},
// Cart button and badge styles
cartButton: {
  position: 'relative',
  padding: 5,
},
cartBadge: {
  position: 'absolute',
  top: -5,
  right: -5,
  backgroundColor: '#ef4444',
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 5,
},
cartBadgeText: {
  color: '#fff',
  fontSize: 12,
  fontFamily: 'Poppins_600SemiBold',
},
// Console filter styles
consoleFiltersContainer: {
  marginBottom: 15,
},
consoleFiltersScroll: {
  paddingHorizontal: 20,
},
consoleFiltersContent: {
  gap: 10,
  paddingRight: 20, // Extra padding for last item
},
consoleFilters: {
  flexDirection: 'row',
  paddingHorizontal: 20,
  marginBottom: 15,
  gap: 10,
},
consoleFilterButton: {
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '#fff',
  borderWidth: 1,
  borderColor: '#e5e7eb',
},
consoleFilterButtonActive: {
  backgroundColor: '#a855f7',
  borderColor: '#a855f7',
},
consoleFilterText: {
  fontSize: 14,
  fontFamily: 'Poppins_400Regular',
  color: '#6b7280',
},
consoleFilterTextActive: {
  color: '#fff',
  fontFamily: 'Poppins_600SemiBold',
},
// Results info styles
resultsInfo: {
  paddingHorizontal: 20,
  marginBottom: 15,
},
resultsText: {
  fontSize: 14,
  fontFamily: 'Poppins_400Regular',
  color: '#6b7280',
},
// Loading states
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f3e8ff',
},
loadingFooter: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 20,
  gap: 10,
},
loadingText: {
  fontSize: 14,
  fontFamily: 'Poppins_400Regular',
  color: '#6b7280',
},
// Empty state styles
emptyState: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 40,
  paddingVertical: 60,
},
emptyStateTitle: {
  fontSize: 20,
  fontFamily: 'Poppins_600SemiBold',
  color: '#374151',
  marginTop: 15,
  marginBottom: 10,
  textAlign: 'center',
},
emptyStateText: {
  fontSize: 16,
  fontFamily: 'Poppins_400Regular',
  color: '#6b7280',
  textAlign: 'center',
  lineHeight: 24,
},
emptyListContainer: {
  flexGrow: 1,
},
// Error banner styles
errorBanner: {
  backgroundColor: '#fef2f2',
  borderLeftWidth: 4,
  borderLeftColor: '#ef4444',
  padding: 12,
  margin: 16,
  borderRadius: 8,
},
errorText: {
  color: '#dc2626',
  fontFamily: 'Poppins_500Medium',
  fontSize: 14,
  textAlign: 'center',
},

});
