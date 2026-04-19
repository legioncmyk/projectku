import { create } from 'zustand'

export interface Nominal {
  id: string
  gameId: string
  name: string
  price: number
  originalPrice: number | null
}

export interface Game {
  id: string
  name: string
  slug: string
  image: string
  category: string
  popular: boolean
  nominals: Nominal[]
}

export interface Slider {
  id: string
  image: string
  title: string
  subtitle: string
  gameId: string | null
  gameSlug: string | null
  order: number
  active: boolean
}

export interface Transaction {
  id: string
  playerName: string
  playerId: string
  server: string
  gameId: string
  gameName: string
  nominalId: string
  nominalName: string
  price: number
  status: string
  whatsapp: string
  createdAt: string
  updatedAt: string
}

export interface StoreSettings {
  whatsapp: string
  rekening: string
  bankName: string
  bankHolder: string
  [key: string]: string
}

interface AppState {
  // Navigation
  currentView: 'home' | 'game' | 'admin' | 'admin-dashboard' | 'history'
  
  // Data
  games: Game[]
  filteredGames: Game[]
  sliders: Slider[]
  settings: StoreSettings
  transactions: Transaction[]
  onlineCount: number
  
  // Selections
  selectedGame: Game | null
  selectedNominal: Nominal | null
  searchQuery: string
  selectedCategory: string
  
  // Admin
  isAdmin: boolean
  adminTab: 'overview' | 'products' | 'transactions' | 'sliders' | 'settings'
  
  // Form
  playerName: string
  playerId: string
  playerServer: string
  playerWhatsapp: string
  
  // Loading
  loading: boolean
  error: string | null
  
  // Actions
  setCurrentView: (view: AppState['currentView']) => void
  setGames: (games: Game[]) => void
  setFilteredGames: (games: Game[]) => void
  setSliders: (sliders: Slider[]) => void
  setSettings: (settings: StoreSettings) => void
  setTransactions: (transactions: Transaction[]) => void
  setOnlineCount: (count: number) => void
  setSelectedGame: (game: Game | null) => void
  setSelectedNominal: (nominal: Nominal | null) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setIsAdmin: (isAdmin: boolean) => void
  setAdminTab: (tab: AppState['adminTab']) => void
  setPlayerName: (name: string) => void
  setPlayerId: (id: string) => void
  setPlayerServer: (server: string) => void
  setPlayerWhatsapp: (whatsapp: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetForm: () => void
  resetAll: () => void
}

const initialState = {
  currentView: 'home' as const,
  games: [] as Game[],
  filteredGames: [] as Game[],
  sliders: [] as Slider[],
  settings: { whatsapp: '', rekening: '', bankName: '', bankHolder: '' } as StoreSettings,
  transactions: [] as Transaction[],
  onlineCount: 0,
  selectedGame: null,
  selectedNominal: null,
  searchQuery: '',
  selectedCategory: 'Semua',
  isAdmin: false,
  adminTab: 'overview' as const,
  playerName: '',
  playerId: '',
  playerServer: '',
  playerWhatsapp: '',
  loading: false,
  error: null,
}

export const useStore = create<AppState>((set) => ({
  ...initialState,
  setCurrentView: (view) => set({ currentView: view }),
  setGames: (games) => set({ games }),
  setFilteredGames: (filteredGames) => set({ filteredGames }),
  setSliders: (sliders) => set({ sliders }),
  setSettings: (settings) => set({ settings }),
  setTransactions: (transactions) => set({ transactions }),
  setOnlineCount: (onlineCount) => set({ onlineCount }),
  setSelectedGame: (selectedGame) => set({ selectedGame, selectedNominal: null }),
  setSelectedNominal: (selectedNominal) => set({ selectedNominal }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setAdminTab: (adminTab) => set({ adminTab }),
  setPlayerName: (playerName) => set({ playerName }),
  setPlayerId: (playerId) => set({ playerId }),
  setPlayerServer: (playerServer) => set({ playerServer }),
  setPlayerWhatsapp: (playerWhatsapp) => set({ playerWhatsapp }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetForm: () => set({
    selectedGame: null,
    selectedNominal: null,
    playerName: '',
    playerId: '',
    playerServer: '',
    playerWhatsapp: '',
  }),
  resetAll: () => set({ ...initialState }),
}))
