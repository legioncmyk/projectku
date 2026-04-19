'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, type Game, type Nominal, type Transaction, type Slider } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Search, Gamepad2, ChevronLeft, ChevronRight, User, Hash,
  Shield, TrendingUp, Package, ShoppingBag, Users,
  Settings, Image as ImageIcon, CreditCard, BarChart3, LogOut, Copy,
  Check, Trash2, Edit3, Plus, Eye, EyeOff, Send, ArrowLeft,
  RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, Loader2,
  Menu, X, Zap, Star, ChevronDown, Phone, Building, Filter, Lock
} from 'lucide-react'

// ─── Utility ───────────────────────────────────────────────
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function sanitize(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')
}

function getCategoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    'MOBA': '🎮', 'Battle Royale': '🔫', 'RPG': '⚔️', 'Strategy': '🏰',
    'MMORPG': '🌍', 'Action': '💥', 'Sports': '⚽', 'Card': '🃏', 'Other': '🎯'
  }
  return map[cat] || '🎮'
}

function getCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    'MOBA': 'from-blue-600 to-blue-800',
    'Battle Royale': 'from-red-600 to-orange-700',
    'RPG': 'from-purple-600 to-purple-800',
    'Strategy': 'from-amber-600 to-amber-800',
    'MMORPG': 'from-emerald-600 to-emerald-800',
    'Action': 'from-rose-600 to-rose-800',
    'Sports': 'from-green-600 to-green-800',
    'Card': 'from-cyan-600 to-cyan-800',
    'Other': 'from-gray-600 to-gray-800',
  }
  return map[cat] || 'from-blue-600 to-blue-800'
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'processing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'success': 'bg-green-500/20 text-green-400 border-green-500/30',
    'failed': 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return map[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock className="w-3 h-3" />
    case 'processing': return <Loader2 className="w-3 h-3 animate-spin" />
    case 'success': return <CheckCircle className="w-3 h-3" />
    case 'failed': return <XCircle className="w-3 h-3" />
    default: return <AlertCircle className="w-3 h-3" />
  }
}

function isImageUrl(str: string): boolean {
  return str.startsWith('/games/') || str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/')
}

const CATEGORIES = ['MOBA', 'Battle Royale', 'RPG', 'Strategy', 'MMORPG', 'Action', 'Sports', 'Card', 'Other']

const SESSION_ID = typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2)

// ─── Ad Banner Component ───────────────────────────────────
function AdBanner() {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const existing = document.querySelector('script[data-ad-invoke]')
    if (existing) return
    const script = document.createElement('script')
    script.src = 'https://pl29190180.profitablecpmratenetwork.com/f686f2e4d813d429defe29b06f6684bc/invoke.js'
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.setAttribute('data-ad-invoke', 'true')
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto my-4 px-4">
      <div id="container-f686f2e4d813d429defe29b06f6684bc" />
    </div>
  )
}

// ─── Header Component ──────────────────────────────────────
function Header() {
  const { onlineCount, setCurrentView } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-none tracking-tight">Zall<span className="text-blue-400">TopUp</span></span>
              <span className="text-[10px] text-blue-300/70 leading-none">Game Top Up Murah</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4" />
              Games
            </button>
            <button onClick={() => setCurrentView('history')} className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" />
              Cek Pesanan
            </button>
          </nav>

          {/* Online Counter */}
          <div className="hidden sm:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">{onlineCount} online</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/98 backdrop-blur-md border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              <button onClick={() => { setCurrentView('home'); setMobileMenuOpen(false) }} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white w-full py-2">
                <Gamepad2 className="w-4 h-4" /> Games
              </button>
              <button onClick={() => { setCurrentView('history'); setMobileMenuOpen(false) }} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white w-full py-2">
                <ShoppingBag className="w-4 h-4" /> Cek Pesanan
              </button>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">{onlineCount} user online</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Hero Slider Component ─────────────────────────────────
function HeroSlider() {
  const { sliders, setCurrentView, setSelectedGame, games } = useStore()
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning])

  const next = useCallback(() => goTo((current + 1) % sliders.length), [current, sliders.length, goTo])
  const prev = useCallback(() => goTo((current - 1 + sliders.length) % sliders.length), [current, sliders.length, goTo])

  useEffect(() => {
    if (sliders.length <= 1) return
    timerRef.current = setInterval(next, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [next, sliders.length])

  const handleSliderClick = (slider: Slider) => {
    if (slider.gameSlug) {
      const game = games.find(g => g.slug === slider.gameSlug)
      if (game) {
        setSelectedGame(game)
        setCurrentView('game')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  if (sliders.length === 0) return null

  const sliderGradients = [
    'from-blue-600 via-blue-700 to-indigo-800',
    'from-emerald-600 via-emerald-700 to-teal-800',
    'from-purple-600 via-purple-700 to-pink-800',
    'from-orange-600 via-orange-700 to-red-800',
  ]

  const activeSlider = sliders[current]
  const hasBannerImage = activeSlider?.image && (activeSlider.image.startsWith('/') || activeSlider.image.startsWith('http'))

  return (
    <section className="relative w-full overflow-hidden rounded-2xl mt-4 mx-auto max-w-6xl">
      <div className="relative h-48 sm:h-64 md:h-80">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 cursor-pointer"
            onClick={() => handleSliderClick(sliders[current])}
          >
            {/* Banner image or gradient fallback */}
            {hasBannerImage ? (
              <>
                <Image
                  src={activeSlider.image}
                  alt={activeSlider.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${sliderGradients[current % sliderGradients.length]}`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
              </div>
            )}

            <div className="relative h-full flex items-center px-6 sm:px-10 md:px-16">
              <div className="max-w-lg">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-3 text-xs font-medium px-3 py-1">
                    <Star className="w-3 h-3 mr-1" /> PROMO
                  </Badge>
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                  {activeSlider?.title}
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-sm sm:text-base text-white/90 mb-4 drop-shadow-md">
                  {activeSlider?.subtitle}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <span className="inline-flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
                    Top Up Sekarang <ChevronRight className="w-4 h-4" />
                  </span>
                </motion.div>
              </div>
              {/* Decorative elements - only show when no banner image */}
              {!hasBannerImage && (
                <div className="absolute right-4 sm:right-10 md:right-16 top-1/2 -translate-y-1/2 opacity-10">
                  <Gamepad2 className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 text-white" />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {sliders.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm">
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dots */}
        {sliders.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {sliders.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Game Card Component ───────────────────────────────────
function GameCard({ game, index }: { game: Game; index: number }) {
  const { setSelectedGame, setCurrentView } = useStore()

  const handleClick = () => {
    setSelectedGame(game)
    setCurrentView('game')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const minPrice = game.nominals.length > 0 ? Math.min(...game.nominals.map(n => n.price)) : 0
  const hasDiscount = game.nominals.some(n => n.originalPrice && n.originalPrice > n.price)
  const hasImage = game.image && isImageUrl(game.image)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
    >
      <Card
        className="group cursor-pointer border-0 bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        onClick={handleClick}
      >
        <CardContent className="p-0">
          {/* Game Image/Icon */}
          <div className={`relative h-28 sm:h-32 bg-gradient-to-br ${getCategoryColor(game.category)} flex items-center justify-center overflow-hidden`}>
            {hasImage ? (
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-4xl sm:text-5xl filter drop-shadow-lg">{game.image || getCategoryEmoji(game.category)}</span>
            )}
            {/* Popular badge */}
            {game.popular && (
              <Badge className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 z-10">
                <Star className="w-2.5 h-2.5 mr-0.5" /> POPULER
              </Badge>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
              <span className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
                Top Up
              </span>
            </div>
          </div>
          {/* Info */}
          <div className="p-3 sm:p-4">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">
              {game.name}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <div>
                {hasDiscount ? (
                  <span className="text-green-600 text-sm font-bold">{formatRupiah(minPrice)}</span>
                ) : (
                  <span className="text-blue-600 text-sm font-bold">{formatRupiah(minPrice)}</span>
                )}
                <p className="text-[11px] text-slate-400">Mulai dari</p>
              </div>
              <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500">
                {game.category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Game Grid (Home View) ────────────────────────────────
function GameGrid() {
  const { filteredGames, searchQuery, selectedCategory, games, setFilteredGames, setSearchQuery, setSelectedCategory } = useStore()

  const categories = ['Semua', ...Array.from(new Set(games.map(g => g.category)))]

  useEffect(() => {
    let result = games
    if (selectedCategory !== 'Semua') {
      result = result.filter(g => g.category === selectedCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(g => g.name.toLowerCase().includes(q))
    }
    setFilteredGames(result)
  }, [games, selectedCategory, searchQuery, setFilteredGames])

  const popularGames = filteredGames.filter(g => g.popular)
  const allGames = filteredGames

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          type="text"
          placeholder="Cari game favorit kamu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(sanitize(e.target.value).slice(0, 100))}
          className="pl-12 pr-12 py-3 bg-white border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 h-12"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'Semua' ? 'Action' : 'Semua')}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors shrink-0 sm:hidden"
        >
          <Filter className="w-4 h-4" /> Filter
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat !== 'Semua' && <span className="mr-1">{getCategoryEmoji(cat)}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Popular Games */}
      {popularGames.length > 0 && searchQuery === '' && selectedCategory === 'Semua' && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Game Populer</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {popularGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* All Games */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {searchQuery ? `Hasil Pencarian (${allGames.length})` : `Semua Game (${allGames.length})`}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
        </div>
        {allGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {allGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Game tidak ditemukan</p>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Top Up Form (Game Detail View) ───────────────────────
function TopUpForm() {
  const {
    selectedGame, selectedNominal, setSelectedNominal,
    playerName, setPlayerName, playerId, setPlayerId,
    playerServer, setPlayerServer, playerWhatsapp, setPlayerWhatsapp,
    setCurrentView, resetForm, settings, loading, setLoading
  } = useStore()
  const [copiedRek, setCopiedRek] = useState(false)

  if (!selectedGame) return null

  const handleSubmit = async () => {
    if (!playerName.trim() || !playerId.trim()) {
      toast.error('Nama dan ID pemain wajib diisi!')
      return
    }
    if (!selectedNominal) {
      toast.error('Pilih nominal terlebih dahulu!')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          playerId: playerId.trim(),
          server: playerServer.trim(),
          gameId: selectedGame.id,
          gameName: selectedGame.name,
          nominalId: selectedNominal.id,
          nominalName: selectedNominal.name,
          price: selectedNominal.price,
          whatsapp: playerWhatsapp.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Pesanan berhasil dibuat! Hubungi admin via WhatsApp untuk pembayaran.')
        const waMsg = encodeURIComponent(
          `Halo admin, saya ingin top up:\n\nGame: ${selectedGame.name}\nNama: ${playerName}\nID: ${playerId}${playerServer ? `\nServer: ${playerServer}` : ''}\nNominal: ${selectedNominal.name}\nHarga: ${formatRupiah(selectedNominal.price)}\n\nMohon diproses. Terima kasih!`
        )
        setTimeout(() => {
          window.open(`https://wa.me/${settings.whatsapp}?text=${waMsg}`, '_blank')
        }, 1500)
        resetForm()
        setCurrentView('home')
      } else {
        toast.error(data.message || 'Gagal membuat pesanan')
      }
    } catch {
      toast.error('Terjadi kesalahan. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  const copyRekening = () => {
    navigator.clipboard.writeText(settings.rekening)
    setCopiedRek(true)
    toast.success('Nomor rekening berhasil disalin!')
    setTimeout(() => setCopiedRek(false), 2000)
  }

  const gameHasImage = selectedGame.image && isImageUrl(selectedGame.image)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <button
        onClick={() => { resetForm(); setCurrentView('home') }}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Kembali ke daftar game</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Header with image support */}
          <div className={`rounded-xl bg-gradient-to-r ${getCategoryColor(selectedGame.category)} p-6 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_50%)]" />
            <div className="relative flex items-center gap-4">
              {gameHasImage ? (
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden shrink-0">
                  <Image
                    src={selectedGame.image}
                    alt={selectedGame.name}
                    width={64}
                    height={64}
                    className="object-cover rounded-xl"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">
                  {selectedGame.image || getCategoryEmoji(selectedGame.category)}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{selectedGame.name}</h1>
                <Badge className="bg-white/20 text-white border-white/30 mt-1">{selectedGame.category}</Badge>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" /> Form Top Up
              </h2>

              {/* Player Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> Nama Pemain
                </label>
                <Input
                  placeholder="Masukkan nama pemain"
                  value={playerName}
                  onChange={(e) => setPlayerName(sanitize(e.target.value).slice(0, 50))}
                  className="h-11"
                />
              </div>

              {/* Player ID */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-slate-400" /> ID Pemain
                </label>
                <Input
                  placeholder="Masukkan ID pemain"
                  value={playerId}
                  onChange={(e) => setPlayerId(sanitize(e.target.value).slice(0, 50))}
                  className="h-11"
                />
              </div>

              {/* Server (optional) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-slate-400" /> Server <span className="text-slate-400">(opsional)</span>
                </label>
                <Input
                  placeholder="Masukkan server (jika ada)"
                  value={playerServer}
                  onChange={(e) => setPlayerServer(sanitize(e.target.value).slice(0, 50))}
                  className="h-11"
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> No. WhatsApp
                </label>
                <Input
                  placeholder="08xxxxxxxxxx"
                  value={playerWhatsapp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 15)
                    setPlayerWhatsapp(val)
                  }}
                  className="h-11"
                />
              </div>

              <Separator />

              {/* Nominals */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-700">Pilih Nominal</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                  {selectedGame.nominals.map(nom => (
                    <button
                      key={nom.id}
                      onClick={() => setSelectedNominal(nom)}
                      className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedNominal?.id === nom.id
                          ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      {nom.originalPrice && nom.originalPrice > nom.price && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5">
                          -{Math.round((1 - nom.price / nom.originalPrice) * 100)}%
                        </Badge>
                      )}
                      <p className="text-sm font-semibold text-slate-800">{nom.name}</p>
                      <div className="mt-1">
                        <p className="text-sm font-bold text-blue-600">{formatRupiah(nom.price)}</p>
                        {nom.originalPrice && nom.originalPrice > nom.price && (
                          <p className="text-[11px] text-slate-400 line-through">{formatRupiah(nom.originalPrice)}</p>
                        )}
                      </div>
                      {selectedNominal?.id === nom.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> Ringkasan Pesanan
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Game</span>
                  <span className="text-slate-900 font-medium">{selectedGame.name}</span>
                </div>
                {playerName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama</span>
                    <span className="text-slate-900">{playerName}</span>
                  </div>
                )}
                {playerId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID</span>
                    <span className="text-slate-900">{playerId}</span>
                  </div>
                )}
                {playerServer && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Server</span>
                    <span className="text-slate-900">{playerServer}</span>
                  </div>
                )}
                {selectedNominal && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nominal</span>
                      <span className="text-slate-900">{selectedNominal.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Harga</span>
                      <span className="text-blue-600 font-bold text-base">{formatRupiah(selectedNominal.price)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Payment Info */}
              <Separator />
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Pembayaran via Transfer</p>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">{settings.bankName}</span>
                    <Badge variant="outline" className="text-[10px]">Transfer Bank</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-slate-900">{settings.rekening}</span>
                    <button onClick={copyRekening} className="p-1.5 rounded-md hover:bg-slate-200 transition-colors" title="Salin rekening">
                      {copiedRek ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">a.n. {settings.bankHolder}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !selectedNominal}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Beli via WhatsApp
                    </>
                  )}
                </Button>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Halo admin, saya ingin bertanya tentang top up.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-green-500 text-green-600 hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  <Phone className="w-4 h-4" /> Chat Admin WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Transaction History View ──────────────────────────────
function TransactionHistory() {
  const { setCurrentView } = useStore()
  const [searchName, setSearchName] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchName.trim()) {
      toast.error('Masukkan nama atau ID pemain')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/transactions?search=${encodeURIComponent(searchName.trim())}`)
      const data = await res.json()
      if (data.success) {
        setTransactions(data.data || [])
        if (!data.data?.length) toast.info('Tidak ada transaksi ditemukan')
      }
    } catch {
      toast.error('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
      <button onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> <span className="text-sm">Kembali</span>
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-blue-600" /> Cek Pesanan
      </h1>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Masukkan nama atau ID pemain..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-11"
            />
            <Button onClick={handleSearch} disabled={loading} className="h-11 px-6 bg-blue-600 hover:bg-blue-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <div className="space-y-3">
          {transactions.map(tx => (
            <Card key={tx.id} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900">{tx.gameName}</span>
                  <Badge className={`text-[11px] border ${getStatusColor(tx.status)}`} variant="outline">
                    <span className="mr-1">{getStatusIcon(tx.status)}</span> {tx.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-500">
                  <div><span className="text-slate-400">Nama:</span> {tx.playerName}</div>
                  <div><span className="text-slate-400">ID:</span> {tx.playerId}</div>
                  <div><span className="text-slate-400">Nominal:</span> {tx.nominalName}</div>
                  <div><span className="text-slate-400">Harga:</span> <span className="text-blue-600 font-medium">{formatRupiah(tx.price)}</span></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">{formatDate(tx.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Admin Login View ──────────────────────────────────────
function AdminLogin() {
  const { setIsAdmin, setCurrentView, setAdminTab } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Login berhasil!')
        setIsAdmin(true)
        setCurrentView('admin-dashboard')
        setAdminTab('overview')
      } else {
        setError(data.message || 'Login gagal')
        toast.error(data.message || 'Login gagal')
      }
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-slate-200 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-sm text-slate-500 mt-1">Masuk ke dashboard admin</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <Input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(sanitize(e.target.value).slice(0, 50))}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk'}
            </Button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-6">
            <Lock className="w-3 h-3 inline mr-1" /> Dilindungi proteksi brute force
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── Admin Dashboard ───────────────────────────────────────
function AdminDashboard() {
  const {
    adminTab, setAdminTab, games, transactions, settings, sliders, setSliders,
    setIsAdmin, setCurrentView, setGames, setTransactions, setSettings
  } = useStore()

  const [stats, setStats] = useState({ totalGames: 0, totalTransactions: 0, pendingTransactions: 0, completedTransactions: 0, totalRevenue: 0, onlineUsers: 0 })
  const [txPage, setTxPage] = useState(1)
  const [txStatus, setTxStatus] = useState('')
  const [saving, setSaving] = useState(false)

  // Product dialog state
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [productForm, setProductForm] = useState({
    name: '', slug: '', image: '', category: 'MOBA', popular: false,
    nominals: [{ name: '', price: 0, originalPrice: 0 }]
  })

  // Slider dialog state
  const [sliderDialogOpen, setSliderDialogOpen] = useState(false)
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null)
  const [sliderForm, setSliderForm] = useState({
    image: '', title: '', subtitle: '', gameSlug: '', order: 0, active: true
  })

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'game' | 'slider'; id: string; name: string } | null>(null)

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings)

  useEffect(() => {
    setSettingsForm(settings)
  }, [settings])

  // ─── Data Loaders ────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.success) setStats(data.data)
    } catch { /* silent */ }
  }, [])

  const loadTransactions = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(txPage), limit: '20' })
      if (txStatus) params.set('status', txStatus)
      const res = await fetch(`/api/admin/transactions?${params}`)
      const data = await res.json()
      if (data.success) setTransactions(data.data)
    } catch { /* silent */ }
  }, [txPage, txStatus, setTransactions])

  const loadGames = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (data.success) setGames(data.data)
    } catch { /* silent */ }
  }, [setGames])

  const loadSliders = useCallback(async () => {
    try {
      const res = await fetch('/api/slider')
      const data = await res.json()
      if (data.success) setSliders(data.data)
    } catch { /* silent */ }
  }, [setSliders])

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.success) setSettings(data.data)
    } catch { /* silent */ }
  }, [setSettings])

  useEffect(() => {
    loadStats()
    loadTransactions()
    loadGames()
    loadSliders()
    loadSettings()
  }, [loadStats, loadTransactions, loadGames, loadSliders, loadSettings])

  const refreshAll = useCallback(() => {
    loadStats()
    loadGames()
    loadSliders()
  }, [loadStats, loadGames, loadSliders])

  // ─── Handlers ────────────────────────────────────────────
  const handleLogout = () => {
    setIsAdmin(false)
    setCurrentView('admin')
    setAdminTab('overview')
    toast.success('Berhasil logout')
  }

  const updateTxStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Status berhasil diubah')
        loadTransactions()
        loadStats()
      }
    } catch {
      toast.error('Gagal mengubah status')
    }
  }

  const handleSaveSettings = async (newSettings: Record<string, string>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Pengaturan berhasil disimpan')
        loadSettings()
      }
    } catch {
      toast.error('Gagal menyimpan pengaturan')
    }
  }

  // ─── Product CRUD ────────────────────────────────────────
  const openAddProduct = () => {
    setEditingGame(null)
    setProductForm({
      name: '', slug: '', image: '', category: 'MOBA', popular: false,
      nominals: [{ name: '', price: 0, originalPrice: 0 }]
    })
    setProductDialogOpen(true)
  }

  const openEditProduct = (game: Game) => {
    setEditingGame(game)
    setProductForm({
      name: game.name,
      slug: game.slug,
      image: game.image,
      category: game.category,
      popular: game.popular,
      nominals: game.nominals.length > 0
        ? game.nominals.map(n => ({ name: n.name, price: n.price, originalPrice: n.originalPrice || 0 }))
        : [{ name: '', price: 0, originalPrice: 0 }]
    })
    setProductDialogOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.slug.trim()) {
      toast.error('Nama dan slug wajib diisi!')
      return
    }
    const validNominals = productForm.nominals.filter(n => n.name.trim() && n.price > 0)
    if (!editingGame && validNominals.length === 0) {
      toast.error('Tambahkan minimal satu nominal!')
      return
    }

    setSaving(true)
    try {
      if (editingGame) {
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingGame.id,
            name: productForm.name.trim(),
            slug: productForm.slug.trim(),
            image: productForm.image.trim(),
            category: productForm.category,
            popular: productForm.popular,
          }),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Produk berhasil diupdate!')
          setProductDialogOpen(false)
          refreshAll()
        } else {
          toast.error(data.message || 'Gagal update produk')
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productForm.name.trim(),
            slug: productForm.slug.trim(),
            image: productForm.image.trim(),
            category: productForm.category,
            popular: productForm.popular,
            nominals: validNominals.map(n => ({
              name: n.name.trim(),
              price: Number(n.price),
              originalPrice: n.originalPrice > 0 ? Number(n.originalPrice) : null,
            })),
          }),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Produk berhasil ditambahkan!')
          setProductDialogOpen(false)
          refreshAll()
        } else {
          toast.error(data.message || 'Gagal menambahkan produk')
        }
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteGame = (game: Game) => {
    setDeleteTarget({ type: 'game', id: game.id, name: game.name })
    setDeleteDialogOpen(true)
  }

  const handleDeleteGame = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/products?id=${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Game berhasil dihapus')
        refreshAll()
      } else {
        toast.error(data.message || 'Gagal menghapus game')
      }
    } catch {
      toast.error('Gagal menghapus game')
    } finally {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  // ─── Slider CRUD ─────────────────────────────────────────
  const openAddSlider = () => {
    setEditingSlider(null)
    setSliderForm({
      image: '', title: '', subtitle: '', gameSlug: '', order: 0, active: true
    })
    setSliderDialogOpen(true)
  }

  const openEditSlider = (slider: Slider) => {
    setEditingSlider(slider)
    setSliderForm({
      image: slider.image,
      title: slider.title,
      subtitle: slider.subtitle,
      gameSlug: slider.gameSlug || '',
      order: slider.order,
      active: slider.active,
    })
    setSliderDialogOpen(true)
  }

  const handleSaveSlider = async () => {
    if (!sliderForm.title.trim()) {
      toast.error('Title wajib diisi!')
      return
    }

    setSaving(true)
    try {
      if (editingSlider) {
        const res = await fetch('/api/admin/slider', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingSlider.id,
            image: sliderForm.image.trim(),
            title: sliderForm.title.trim(),
            subtitle: sliderForm.subtitle.trim(),
            gameSlug: sliderForm.gameSlug.trim() || null,
            order: Number(sliderForm.order),
            active: sliderForm.active,
          }),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Slider berhasil diupdate!')
          setSliderDialogOpen(false)
          loadSliders()
        } else {
          toast.error(data.message || 'Gagal update slider')
        }
      } else {
        const res = await fetch('/api/admin/slider', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: sliderForm.image.trim(),
            title: sliderForm.title.trim(),
            subtitle: sliderForm.subtitle.trim(),
            gameSlug: sliderForm.gameSlug.trim() || null,
            order: Number(sliderForm.order),
          }),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Slider berhasil ditambahkan!')
          setSliderDialogOpen(false)
          loadSliders()
        } else {
          toast.error(data.message || 'Gagal menambahkan slider')
        }
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteSlider = (slider: Slider) => {
    setDeleteTarget({ type: 'slider', id: slider.id, name: slider.title })
    setDeleteDialogOpen(true)
  }

  const handleDeleteSlider = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/admin/slider?id=${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Slider berhasil dihapus')
        loadSliders()
      } else {
        toast.error(data.message || 'Gagal menghapus slider')
      }
    } catch {
      toast.error('Gagal menghapus slider')
    } finally {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    if (deleteTarget.type === 'game') {
      handleDeleteGame()
    } else {
      handleDeleteSlider()
    }
  }

  // ─── Nominal Row Helpers ─────────────────────────────────
  const addNominalRow = () => {
    setProductForm(prev => ({
      ...prev,
      nominals: [...prev.nominals, { name: '', price: 0, originalPrice: 0 }]
    }))
  }

  const removeNominalRow = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      nominals: prev.nominals.filter((_, i) => i !== index)
    }))
  }

  const updateNominalRow = (index: number, field: 'name' | 'price' | 'originalPrice', value: string | number) => {
    setProductForm(prev => ({
      ...prev,
      nominals: prev.nominals.map((n, i) => i === index ? { ...n, [field]: value } : n)
    }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAll}
              className="text-slate-400 hover:text-white"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <nav className="md:w-56 shrink-0">
            <div className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
              {[
                { key: 'overview' as const, icon: BarChart3, label: 'Overview' },
                { key: 'products' as const, icon: Package, label: 'Produk' },
                { key: 'transactions' as const, icon: ShoppingBag, label: 'Transaksi' },
                { key: 'sliders' as const, icon: ImageIcon, label: 'Slider' },
                { key: 'settings' as const, icon: Settings, label: 'Pengaturan' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setAdminTab(item.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    adminTab === item.key
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" /> {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Overview */}
            {adminTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Statistik</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Game', value: stats.totalGames, icon: Gamepad2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Total Transaksi', value: stats.totalTransactions, icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Pending', value: stats.pendingTransactions, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Selesai', value: stats.completedTransactions, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Pendapatan', value: formatRupiah(stats.totalRevenue), icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'User Online', value: stats.onlineUsers, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">{stat.label}</p>
                            <p className="text-lg font-bold text-white">{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {adminTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Produk ({games.length})</h2>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={openAddProduct}>
                    <Plus className="w-4 h-4 mr-1" /> Tambah Produk
                  </Button>
                </div>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {games.map(game => {
                    const gameHasImg = game.image && isImageUrl(game.image)
                    return (
                      <Card key={game.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {gameHasImg ? (
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 relative">
                                <Image
                                  src={game.image}
                                  alt={game.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(game.category)} flex items-center justify-center text-xl shrink-0`}>
                                {game.image || getCategoryEmoji(game.category)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{game.name}</p>
                              <p className="text-xs text-slate-400">{game.nominals.length} nominal · {game.category}</p>
                              {game.popular && (
                                <Badge className="mt-1 text-[9px] bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                  <Star className="w-2.5 h-2.5 mr-0.5" /> Populer
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditProduct(game)} className="text-slate-400 hover:text-white h-8 w-8 p-0">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => confirmDeleteGame(game)} className="text-slate-400 hover:text-red-400 h-8 w-8 p-0">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {games.length === 0 && (
                    <p className="text-center text-slate-500 py-12">Belum ada produk</p>
                  )}
                </div>
              </div>
            )}

            {/* Transactions */}
            {adminTab === 'transactions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-lg font-bold">Transaksi</h2>
                  <div className="flex gap-2">
                    {['', 'pending', 'processing', 'success', 'failed'].map(s => (
                      <Button
                        key={s}
                        variant={txStatus === s ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setTxStatus(s); setTxPage(1) }}
                        className={txStatus === s ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-700 text-slate-400'}
                      >
                        {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Semua'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {transactions.length > 0 ? transactions.map(tx => (
                    <Card key={tx.id} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{tx.gameName}</p>
                            <p className="text-xs text-slate-400">{tx.playerName} · ID: {tx.playerId}{tx.server ? ` · Server: ${tx.server}` : ''}</p>
                          </div>
                          <Badge className={`text-[10px] border ${getStatusColor(tx.status)}`} variant="outline">
                            {getStatusIcon(tx.status)} {tx.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{tx.nominalName} · {formatRupiah(tx.price)}</span>
                          <span>{formatDate(tx.createdAt)}</span>
                        </div>
                        {tx.status !== 'success' && tx.status !== 'failed' && (
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="outline" className="h-7 text-[10px] border-blue-500/30 text-blue-400 hover:bg-blue-500/10" onClick={() => updateTxStatus(tx.id, 'processing')}>
                              <Loader2 className="w-3 h-3 mr-1" /> Process
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-[10px] border-green-500/30 text-green-400 hover:bg-green-500/10" onClick={() => updateTxStatus(tx.id, 'success')}>
                              <CheckCircle className="w-3 h-3 mr-1" /> Selesai
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-[10px] border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => updateTxStatus(tx.id, 'failed')}>
                              <XCircle className="w-3 h-3 mr-1" /> Gagal
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) : (
                    <p className="text-center text-slate-500 py-12">Tidak ada transaksi</p>
                  )}
                </div>
                {transactions.length >= 20 && (
                  <div className="flex justify-center gap-2 pt-2">
                    <Button variant="outline" size="sm" disabled={txPage <= 1} onClick={() => setTxPage(txPage - 1)} className="border-slate-700 text-slate-400">Prev</Button>
                    <span className="text-sm text-slate-400 flex items-center">Hal {txPage}</span>
                    <Button variant="outline" size="sm" onClick={() => setTxPage(txPage + 1)} className="border-slate-700 text-slate-400">Next</Button>
                  </div>
                )}
              </div>
            )}

            {/* Sliders */}
            {adminTab === 'sliders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Slider ({sliders.length})</h2>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={openAddSlider}>
                    <Plus className="w-4 h-4 mr-1" /> Tambah Slider
                  </Button>
                </div>
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {sliders.map(slider => {
                    const sliderHasImg = slider.image && (slider.image.startsWith('/') || slider.image.startsWith('http'))
                    return (
                      <Card key={slider.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {sliderHasImg ? (
                              <div className="w-16 h-10 rounded-lg overflow-hidden shrink-0 relative">
                                <Image
                                  src={slider.image}
                                  alt={slider.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shrink-0">
                                <ImageIcon className="w-4 h-4 text-white/50" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm">{slider.title}</p>
                              <p className="text-xs text-slate-400">{slider.subtitle}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Order: {slider.order} · {slider.active ? 'Aktif' : 'Nonaktif'} · {slider.gameSlug || 'Tanpa link'}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditSlider(slider)} className="text-slate-400 hover:text-white h-8 w-8 p-0">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => confirmDeleteSlider(slider)} className="text-slate-400 hover:text-red-400 h-8 w-8 p-0">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {sliders.length === 0 && (
                    <p className="text-center text-slate-500 py-12">Belum ada slider</p>
                  )}
                </div>
              </div>
            )}

            {/* Settings */}
            {adminTab === 'settings' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Pengaturan</h2>
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400 flex items-center gap-1.5"><Phone className="w-4 h-4" /> WhatsApp</label>
                      <Input
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white h-11"
                        placeholder="628xxxxxxxxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400 flex items-center gap-1.5"><Building className="w-4 h-4" /> Nama Bank</label>
                      <Input
                        value={settingsForm.bankName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white h-11"
                        placeholder="Bank BCA"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400 flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Nomor Rekening</label>
                      <Input
                        value={settingsForm.rekening}
                        onChange={(e) => setSettingsForm({ ...settingsForm, rekening: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white h-11"
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400 flex items-center gap-1.5"><User className="w-4 h-4" /> Atas Nama</label>
                      <Input
                        value={settingsForm.bankHolder}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bankHolder: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white h-11"
                        placeholder="Nama pemilik rekening"
                      />
                    </div>
                    <Button onClick={() => handleSaveSettings(settingsForm)} className="bg-blue-600 hover:bg-blue-700 w-full h-11">
                      Simpan Pengaturan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ─── Product Dialog ─────────────────────────────── */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="bg-white text-slate-900 max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingGame ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nama Game *</label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value.slice(0, 100) })}
                  placeholder="Mobile Legends"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Slug *</label>
                <Input
                  value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value.replace(/[^a-z0-9-]/gi, '-').slice(0, 100) })}
                  placeholder="mobile-legends-bang-bang"
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">URL Gambar</label>
              <Input
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value.slice(0, 500) })}
                placeholder="/games/mlbb.png atau https://example.com/image.jpg"
                className="h-10"
              />
              {productForm.image && isImageUrl(productForm.image) && (
                <div className="w-16 h-16 rounded-lg overflow-hidden relative mt-2 border border-slate-200">
                  <Image src={productForm.image} alt="Preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Kategori</label>
                <div className="relative">
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:ring-blue-500/20 focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2 flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.popular}
                    onChange={(e) => setProductForm({ ...productForm, popular: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    <Star className="w-3.5 h-3.5 inline mr-1 text-yellow-500" />Tandai sebagai Populer
                  </span>
                </label>
              </div>
            </div>

            {/* Nominals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Nominal Produk</label>
                {!editingGame && (
                  <Button type="button" variant="outline" size="sm" onClick={addNominalRow} className="h-8 text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Tambah Nominal
                  </Button>
                )}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {productForm.nominals.map((nom, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={nom.name}
                      onChange={(e) => updateNominalRow(i, 'name', e.target.value.slice(0, 100))}
                      placeholder="Nama (86 Diamond)"
                      className="h-9 flex-1"
                    />
                    <Input
                      type="number"
                      value={nom.price || ''}
                      onChange={(e) => updateNominalRow(i, 'price', Number(e.target.value) || 0)}
                      placeholder="Harga"
                      className="h-24 w-28"
                    />
                    <Input
                      type="number"
                      value={nom.originalPrice || ''}
                      onChange={(e) => updateNominalRow(i, 'originalPrice', Number(e.target.value) || 0)}
                      placeholder="Harga asli"
                      className="h-9 w-28"
                    />
                    {!editingGame && productForm.nominals.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeNominalRow(i)} className="h-9 w-9 p-0 text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {!editingGame && (
                <Button type="button" variant="ghost" size="sm" onClick={addNominalRow} className="w-full h-8 text-xs text-slate-500 hover:text-blue-600">
                  <Plus className="w-3 h-3 mr-1" /> Tambah Nominal
                </Button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)} className="h-10">Batal</Button>
            <Button onClick={handleSaveProduct} disabled={saving} className="bg-blue-600 hover:bg-blue-700 h-10">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingGame ? 'Update Produk' : 'Tambah Produk'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Slider Dialog ─────────────────────────────── */}
      <Dialog open={sliderDialogOpen} onOpenChange={setSliderDialogOpen}>
        <DialogContent className="bg-white text-slate-900 max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSlider ? 'Edit Slider' : 'Tambah Slider Baru'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">URL Gambar Banner</label>
              <Input
                value={sliderForm.image}
                onChange={(e) => setSliderForm({ ...sliderForm, image: e.target.value.slice(0, 500) })}
                placeholder="/banners/promo.jpg atau https://..."
                className="h-10"
              />
              {sliderForm.image && isImageUrl(sliderForm.image) && (
                <div className="w-full h-32 rounded-lg overflow-hidden relative mt-2 border border-slate-200">
                  <Image src={sliderForm.image} alt="Preview" fill className="object-cover" unoptimized />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Judul *</label>
              <Input
                value={sliderForm.title}
                onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value.slice(0, 100) })}
                placeholder="MLBB Diamond Sale!"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Subtitle</label>
              <Input
                value={sliderForm.subtitle}
                onChange={(e) => setSliderForm({ ...sliderForm, subtitle: e.target.value.slice(0, 200) })}
                placeholder="Diskon hingga 30%"
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Game Slug</label>
                <Input
                  value={sliderForm.gameSlug}
                  onChange={(e) => setSliderForm({ ...sliderForm, gameSlug: e.target.value.replace(/[^a-z0-9-]/gi, '-').slice(0, 100) })}
                  placeholder="mobile-legends-bang-bang"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Urutan</label>
                <Input
                  type="number"
                  value={sliderForm.order || 0}
                  onChange={(e) => setSliderForm({ ...sliderForm, order: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="h-10"
                />
              </div>
            </div>
            {editingSlider && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sliderForm.active}
                  onChange={(e) => setSliderForm({ ...sliderForm, active: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Aktif</span>
              </label>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSliderDialogOpen(false)} className="h-10">Batal</Button>
            <Button onClick={handleSaveSlider} disabled={saving} className="bg-blue-600 hover:bg-blue-700 h-10">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingSlider ? 'Update Slider' : 'Tambah Slider'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ────────────────── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white text-slate-900 max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus <span className="font-semibold text-slate-900">{deleteTarget?.name}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="h-10">Batal</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 h-10">
              <Trash2 className="w-4 h-4 mr-1" /> Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Footer Component ──────────────────────────────────────
function Footer() {
  const { settings } = useStore()
  const [copiedWA, setCopiedWA] = useState(false)

  const copyWhatsApp = () => {
    navigator.clipboard.writeText(settings.whatsapp)
    setCopiedWA(true)
    toast.success('Nomor WhatsApp berhasil disalin!')
    setTimeout(() => setCopiedWA(false), 2000)
  }

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-8">
      <AdBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">Zall<span className="text-blue-400">TopUp</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Top up game murah, cepat, dan terpercaya. Proses instan dengan pelayanan 24 jam.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-slate-300">Kontak</h3>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors"
              >
                <Phone className="w-4 h-4" /> {settings.whatsapp}
              </a>
              <button onClick={copyWhatsApp} className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors">
                {copiedWA ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedWA ? 'Tersalin!' : 'Salin nomor WhatsApp'}
              </button>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-slate-300">Pembayaran</h3>
            <div className="bg-slate-800/50 rounded-lg p-3 space-y-1">
              <p className="text-sm font-medium text-white">{settings.bankName}</p>
              <p className="text-sm font-mono text-blue-400">{settings.rekening}</p>
              <p className="text-xs text-slate-400">a.n. {settings.bankHolder}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Zall Store. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> Dilindungi & terenkripsi
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Page ─────────────────────────────────────────────
export default function Page() {
  const {
    currentView, setGames, setFilteredGames, setSliders, setSettings,
    setOnlineCount, setCurrentView, onlineCount
  } = useStore()
  const [mounted, setMounted] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, sliderRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/slider'),
          fetch('/api/settings'),
        ])
        const [productsData, sliderData, settingsData] = await Promise.all([
          productsRes.json(),
          sliderRes.json(),
          settingsRes.json(),
        ])
        if (productsData.success) { setGames(productsData.data); setFilteredGames(productsData.data) }
        if (sliderData.success) setSliders(sliderData.data)
        if (settingsData.success) setSettings(settingsData.data)
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }
    loadData().then(() => setMounted(true))
  }, [setGames, setFilteredGames, setSliders, setSettings])

  // Online user tracking
  useEffect(() => {
    const registerOnline = async () => {
      try {
        await fetch('/api/online', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: SESSION_ID }),
        })
      } catch { /* silent */ }
    }

    const getOnlineCount = async () => {
      try {
        const res = await fetch('/api/online')
        const data = await res.json()
        if (data.success) setOnlineCount(data.data.count)
      } catch { /* silent */ }
    }

    registerOnline()
    getOnlineCount()

    const heartbeat = setInterval(() => {
      registerOnline()
      getOnlineCount()
    }, 10000)

    const countInterval = setInterval(getOnlineCount, 5000)

    const handleBeforeUnload = () => {
      navigator.sendBeacon?.('/api/online', JSON.stringify({ sessionId: SESSION_ID, disconnect: true }))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearInterval(heartbeat)
      clearInterval(countInterval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [setOnlineCount])

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'admin') setCurrentView('admin')
      else if (hash === 'admin-dashboard') setCurrentView('admin-dashboard')
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [setCurrentView])

  // Periodic data refresh for realtime feel
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings'),
        ])
        const [productsData, settingsData] = await Promise.all([
          productsRes.json(),
          settingsRes.json(),
        ])
        if (productsData.success) setGames(productsData.data)
        if (settingsData.success) setSettings(settingsData.data)
      } catch { /* silent */ }
    }, 15000)
    return () => clearInterval(interval)
  }, [setGames, setSettings])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-blue-600" />
        </motion.div>
      </div>
    )
  }

  const isAdminView = currentView === 'admin' || currentView === 'admin-dashboard'

  return (
    <div className={`min-h-screen flex flex-col ${isAdminView ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {!isAdminView && <Header />}

      <main className={`flex-1 ${isAdminView ? '' : 'pt-20'}`}>
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <HeroSlider />
              </div>
              <AdBanner />
              <GameGrid />
            </motion.div>
          )}

          {currentView === 'game' && (
            <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <TopUpForm />
            </motion.div>
          )}

          {currentView === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pt-20">
              <TransactionHistory />
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pt-4">
              <AdminLogin />
            </motion.div>
          )}

          {currentView === 'admin-dashboard' && (
            <motion.div key="admin-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <AdminDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!isAdminView && <Footer />}
    </div>
  )
}
