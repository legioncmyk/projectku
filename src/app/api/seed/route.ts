import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ============================================================
// Seed Data Definitions
// ============================================================

interface NominalInput {
  name: string;
  price: number;
  originalPrice?: number;
}

interface GameInput {
  name: string;
  slug: string;
  image: string;
  category: string;
  popular: boolean;
  nominals: NominalInput[];
}

const gamesData: GameInput[] = [
  // ──────────────────────────────────────────────
  // MOBA GAMES (🎮)
  // ──────────────────────────────────────────────
  {
    name: "Mobile Legends: Bang Bang",
    slug: "mobile-legends-bang-bang",
    image: "/games/mobile-legends-bang-bang.png",
    category: "MOBA",
    popular: true,
    nominals: [
      { name: "11 Diamonds", price: 3300 },
      { name: "22 Diamonds", price: 6600 },
      { name: "56 Diamonds", price: 16500, originalPrice: 17600 },
      { name: "86 Diamonds", price: 25000, originalPrice: 27500 },
      { name: "172 Diamonds", price: 49900, originalPrice: 55000 },
      { name: "257 Diamonds", price: 74400, originalPrice: 82500 },
      { name: "344 Diamonds", price: 99000, originalPrice: 110000 },
      { name: "429 Diamonds", price: 122000, originalPrice: 137500 },
      { name: "514 Diamonds", price: 145000, originalPrice: 165000 },
      { name: "600 Diamonds", price: 168000, originalPrice: 192500 },
      { name: "1050 Diamonds", price: 286000, originalPrice: 330000 },
      { name: "2195 Diamonds", price: 572000, originalPrice: 687500 },
      { name: "4390 Diamonds", price: 1130000, originalPrice: 1375000 },
    ],
  },
  {
    name: "League of Legends: Wild Rift",
    slug: "league-of-legends-wild-rift",
    image: "/games/league-of-legends-wild-rift.png",
    category: "MOBA",
    popular: false,
    nominals: [
      { name: "5 Wild Cores", price: 15000 },
      { name: "10 Wild Cores", price: 29000, originalPrice: 30000 },
      { name: "25 Wild Cores", price: 70000, originalPrice: 75000 },
      { name: "40 Wild Cores", price: 109000, originalPrice: 120000 },
      { name: "65 Wild Cores", price: 169000, originalPrice: 195000 },
      { name: "95 Wild Cores", price: 239000, originalPrice: 285000 },
      { name: "135 Wild Cores", price: 329000, originalPrice: 405000 },
      { name: "200 Wild Cores", price: 479000, originalPrice: 600000 },
    ],
  },
  {
    name: "Arena of Valor",
    slug: "arena-of-valor",
    image: "/games/arena-of-valor.png",
    category: "MOBA",
    popular: false,
    nominals: [
      { name: "90 Vouchers", price: 15000 },
      { name: "230 Vouchers", price: 38000, originalPrice: 40000 },
      { name: "470 Vouchers", price: 75000, originalPrice: 80000 },
      { name: "950 Vouchers", price: 149000, originalPrice: 160000 },
      { name: "1900 Vouchers", price: 295000, originalPrice: 320000 },
      { name: "4750 Vouchers", price: 725000, originalPrice: 800000 },
      { name: "9500 Vouchers", price: 1430000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Heroes of the Storm",
    slug: "heroes-of-the-storm",
    image: "🎮",
    category: "MOBA",
    popular: false,
    nominals: [
      { name: "10 Gems", price: 15000 },
      { name: "25 Gems", price: 35000, originalPrice: 37500 },
      { name: "50 Gems", price: 65000, originalPrice: 75000 },
      { name: "100 Gems", price: 125000, originalPrice: 150000 },
      { name: "250 Gems", price: 299000, originalPrice: 375000 },
      { name: "500 Gems", price: 575000, originalPrice: 750000 },
    ],
  },
  {
    name: "Pokémon UNITE",
    slug: "pokemon-unite",
    image: "🎮",
    category: "MOBA",
    popular: false,
    nominals: [
      { name: "60 Aeos Gems", price: 15000 },
      { name: "325 Aeos Gems", price: 79000, originalPrice: 81250 },
      { name: "570 Aeos Gems", price: 135000, originalPrice: 142500 },
      { name: "985 Aeos Gems", price: 229000, originalPrice: 246250 },
      { name: "1620 Aeos Gems", price: 365000, originalPrice: 405000 },
      { name: "2160 Aeos Gems", price: 475000, originalPrice: 540000 },
      { name: "3560 Aeos Gems", price: 765000, originalPrice: 890000 },
      { name: "4340 Aeos Gems", price: 925000, originalPrice: 1085000 },
    ],
  },

  // ──────────────────────────────────────────────
  // BATTLE ROYALE GAMES (🔫)
  // ──────────────────────────────────────────────
  {
    name: "Free Fire",
    slug: "free-fire",
    image: "/games/free-fire.png",
    category: "Battle Royale",
    popular: true,
    nominals: [
      { name: "100 Diamonds", price: 15000 },
      { name: "310 Diamonds", price: 46000, originalPrice: 46500 },
      { name: "520 Diamonds", price: 77000, originalPrice: 78000 },
      { name: "1060 Diamonds", price: 153000, originalPrice: 159000 },
      { name: "2180 Diamonds", price: 307000, originalPrice: 327000 },
      { name: "5600 Diamonds", price: 768000, originalPrice: 840000 },
    ],
  },
  {
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    image: "/games/pubg-mobile.png",
    category: "Battle Royale",
    popular: true,
    nominals: [
      { name: "60 UC", price: 15000 },
      { name: "325 UC", price: 75000, originalPrice: 81250 },
      { name: "660 UC", price: 150000, originalPrice: 165000 },
      { name: "1800 UC", price: 390000, originalPrice: 450000 },
      { name: "3850 UC", price: 790000, originalPrice: 962500 },
      { name: "8100 UC", price: 1590000, originalPrice: 2025000 },
    ],
  },
  {
    name: "Call of Duty Mobile",
    slug: "call-of-duty-mobile",
    image: "/games/call-of-duty-mobile.png",
    category: "Battle Royale",
    popular: false,
    nominals: [
      { name: "80 CP", price: 15000 },
      { name: "400 CP", price: 75000, originalPrice: 80000 },
      { name: "800 CP", price: 145000, originalPrice: 160000 },
      { name: "2000 CP", price: 355000, originalPrice: 400000 },
      { name: "4000 CP", price: 695000, originalPrice: 800000 },
      { name: "8400 CP", price: 1390000, originalPrice: 1680000 },
    ],
  },
  {
    name: "Apex Legends Mobile",
    slug: "apex-legends-mobile",
    image: "🔫",
    category: "Battle Royale",
    popular: false,
    nominals: [
      { name: "100 Coins", price: 15000 },
      { name: "300 Coins", price: 43000, originalPrice: 45000 },
      { name: "500 Coins", price: 70000, originalPrice: 75000 },
      { name: "1000 Coins", price: 135000, originalPrice: 150000 },
      { name: "2500 Coins", price: 325000, originalPrice: 375000 },
      { name: "5000 Coins", price: 635000, originalPrice: 750000 },
    ],
  },
  {
    name: "Farlight 84",
    slug: "farlight-84",
    image: "/games/farlight-84.png",
    category: "Battle Royale",
    popular: false,
    nominals: [
      { name: "100 Diamonds", price: 16000 },
      { name: "300 Diamonds", price: 47000, originalPrice: 48000 },
      { name: "600 Diamonds", price: 92000, originalPrice: 96000 },
      { name: "1200 Diamonds", price: 179000, originalPrice: 192000 },
      { name: "2400 Diamonds", price: 349000, originalPrice: 384000 },
      { name: "6000 Diamonds", price: 859000, originalPrice: 960000 },
    ],
  },

  {
    name: "Valorant",
    slug: "valorant",
    image: "/games/valorant.png",
    category: "Battle Royale",
    popular: true,
    nominals: [
      { name: "125 VP", price: 15000 },
      { name: "420 VP", price: 49000, originalPrice: 52500 },
      { name: "700 VP", price: 79000, originalPrice: 87500 },
      { name: "1375 VP", price: 149000, originalPrice: 171875 },
      { name: "2400 VP", price: 249000, originalPrice: 300000 },
      { name: "4000 VP", price: 399000, originalPrice: 500000 },
      { name: "8150 VP", price: 799000, originalPrice: 1018750 },
    ],
  },

  // ──────────────────────────────────────────────
  // GACHA / RPG (⚔️)
  // ──────────────────────────────────────────────
  {
    name: "Genshin Impact",
    slug: "genshin-impact",
    image: "/games/genshin-impact.png",
    category: "RPG",
    popular: true,
    nominals: [
      { name: "60 Genesis Crystals", price: 16000 },
      { name: "300+30 Genesis Crystals", price: 79000, originalPrice: 80000 },
      { name: "980+110 Genesis Crystals", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Genesis Crystals", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Genesis Crystals", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Genesis Crystals", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Honkai: Star Rail",
    slug: "honkai-star-rail",
    image: "/games/honkai-star-rail.png",
    category: "RPG",
    popular: true,
    nominals: [
      { name: "60 Oneiric Shards", price: 16000 },
      { name: "300+30 Oneiric Shards", price: 79000, originalPrice: 80000 },
      { name: "980+110 Oneiric Shards", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Oneiric Shards", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Oneiric Shards", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Oneiric Shards", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Honkai Impact 3rd",
    slug: "honkai-impact-3rd",
    image: "/games/honkai-impact-3rd.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "60 Crystals", price: 16000 },
      { name: "300+30 Crystals", price: 79000, originalPrice: 80000 },
      { name: "980+110 Crystals", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Crystals", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Crystals", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Crystals", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Wuthering Waves",
    slug: "wuthering-waves",
    image: "/games/wuthering-waves.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "60 Astrite", price: 16000 },
      { name: "300+30 Astrite", price: 79000, originalPrice: 80000 },
      { name: "980+110 Astrite", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Astrite", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Astrite", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Astrite", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Zenless Zone Zero",
    slug: "zenless-zone-zero",
    image: "/games/zenless-zone-zero.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "60 Polychrome", price: 16000 },
      { name: "300+30 Polychrome", price: 79000, originalPrice: 80000 },
      { name: "980+110 Polychrome", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Polychrome", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Polychrome", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Polychrome", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Tower of Fantasy",
    slug: "tower-of-fantasy",
    image: "/games/tower-of-fantasy.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "60 Dark Crystals", price: 16000 },
      { name: "300+30 Dark Crystals", price: 79000, originalPrice: 80000 },
      { name: "980+110 Dark Crystals", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Dark Crystals", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Dark Crystals", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Dark Crystals", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Punishing: Gray Raven",
    slug: "punishing-gray-raven",
    image: "/games/punishing-gray-raven.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "60 Black Gold", price: 16000 },
      { name: "300+30 Black Gold", price: 79000, originalPrice: 80000 },
      { name: "980+110 Black Gold", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Black Gold", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Black Gold", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Black Gold", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Arknights",
    slug: "arknights",
    image: "/games/arknights.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "6 Originium Prime", price: 16000 },
      { name: "30 Originium Prime", price: 79000, originalPrice: 80000 },
      { name: "98 Originium Prime", price: 249000, originalPrice: 260000 },
      { name: "198 Originium Prime", price: 479000, originalPrice: 528000 },
      { name: "328 Originium Prime", price: 799000, originalPrice: 880000 },
      { name: "648 Originium Prime", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Fate/Grand Order",
    slug: "fate-grand-order",
    image: "/games/fate-grand-order.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "1 Saint Quartz", price: 17000 },
      { name: "5 Saint Quartz", price: 83000, originalPrice: 85000 },
      { name: "16 Saint Quartz", price: 255000, originalPrice: 272000 },
      { name: "33 Saint Quartz", price: 499000, originalPrice: 561000 },
      { name: "55 Saint Quartz", price: 799000, originalPrice: 935000 },
      { name: "167 Saint Quartz", price: 1599000, originalPrice: 2839000 },
    ],
  },
  {
    name: "Epic Seven",
    slug: "epic-seven",
    image: "/games/epic-seven.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "100 Skystones", price: 16000 },
      { name: "520 Skystones", price: 79000, originalPrice: 83200 },
      { name: "1050 Skystones", price: 155000, originalPrice: 168000 },
      { name: "1700 Skystones", price: 245000, originalPrice: 272000 },
      { name: "2800 Skystones", price: 395000, originalPrice: 448000 },
      { name: "5400 Skystones", price: 745000, originalPrice: 864000 },
      { name: "11000 Skystones", price: 1470000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Summoners War",
    slug: "summoners-war",
    image: "/games/summoners-war.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "100 Mana", price: 16000 },
      { name: "500 Mana", price: 77000, originalPrice: 80000 },
      { name: "1200 Mana", price: 175000, originalPrice: 192000 },
      { name: "2500 Mana", price: 349000, originalPrice: 400000 },
      { name: "5000 Mana", price: 685000, originalPrice: 800000 },
      { name: "12500 Mana", price: 1599000, originalPrice: 2000000 },
    ],
  },
  {
    name: "Azur Lane",
    slug: "azur-lane",
    image: "⚔️",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "100 Gems", price: 16000 },
      { name: "600 Gems", price: 79000, originalPrice: 96000 },
      { name: "1200 Gems", price: 155000, originalPrice: 192000 },
      { name: "2500 Gems", price: 309000, originalPrice: 400000 },
      { name: "5000 Gems", price: 599000, originalPrice: 800000 },
      { name: "10000 Gems", price: 1150000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Girls' Frontline",
    slug: "girls-frontline",
    image: "⚔️",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "100 Gems", price: 16000 },
      { name: "600 Gems", price: 79000, originalPrice: 96000 },
      { name: "1200 Gems", price: 155000, originalPrice: 192000 },
      { name: "2500 Gems", price: 309000, originalPrice: 400000 },
      { name: "5000 Gems", price: 599000, originalPrice: 800000 },
      { name: "10000 Gems", price: 1150000, originalPrice: 1600000 },
    ],
  },
  {
    name: "NARUTO Mobile",
    slug: "naruto-mobile",
    image: "⚔️",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "100 Coins", price: 16000 },
      { name: "500 Coins", price: 77000, originalPrice: 80000 },
      { name: "1000 Coins", price: 149000, originalPrice: 160000 },
      { name: "2000 Coins", price: 289000, originalPrice: 320000 },
      { name: "5000 Coins", price: 699000, originalPrice: 800000 },
      { name: "10000 Coins", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Dragon Ball Legends",
    slug: "dragon-ball-legends",
    image: "/games/dragon-ball-legends.png",
    category: "RPG",
    popular: false,
    nominals: [
      { name: "25 Chrono Crystals", price: 16000 },
      { name: "130 Chrono Crystals", price: 79000, originalPrice: 83200 },
      { name: "340 Chrono Crystals", price: 199000, originalPrice: 217600 },
      { name: "700 Chrono Crystals", price: 389000, originalPrice: 448000 },
      { name: "1400 Chrono Crystals", price: 749000, originalPrice: 896000 },
      { name: "3500 Chrono Crystals", price: 1599000, originalPrice: 2240000 },
    ],
  },

  // ──────────────────────────────────────────────
  // STRATEGY (🏰)
  // ──────────────────────────────────────────────
  {
    name: "Clash of Clans",
    slug: "clash-of-clans",
    image: "/games/clash-of-clans.png",
    category: "Strategy",
    popular: true,
    nominals: [
      { name: "80 Gems", price: 19000 },
      { name: "500 Gems", price: 99000, originalPrice: 118750 },
      { name: "1200 Gems", price: 249000, originalPrice: 285000 },
      { name: "2500 Gems", price: 489000, originalPrice: 593750 },
      { name: "6500 Gems", price: 1199000, originalPrice: 1543750 },
      { name: "14000 Gems", price: 2399000, originalPrice: 3325000 },
    ],
  },
  {
    name: "Clash Royale",
    slug: "clash-royale",
    image: "/games/clash-royale.png",
    category: "Strategy",
    popular: false,
    nominals: [
      { name: "80 Gems", price: 19000 },
      { name: "500 Gems", price: 99000, originalPrice: 118750 },
      { name: "1200 Gems", price: 249000, originalPrice: 285000 },
      { name: "2500 Gems", price: 489000, originalPrice: 593750 },
      { name: "6500 Gems", price: 1199000, originalPrice: 1543750 },
      { name: "14000 Gems", price: 2399000, originalPrice: 3325000 },
    ],
  },
  {
    name: "Rise of Kingdoms",
    slug: "rise-of-kingdoms",
    image: "/games/rise-of-kingdoms.png",
    category: "Strategy",
    popular: false,
    nominals: [
      { name: "200 Gems", price: 15000 },
      { name: "1200 Gems", price: 79000, originalPrice: 90000 },
      { name: "2500 Gems", price: 159000, originalPrice: 187500 },
      { name: "5000 Gems", price: 309000, originalPrice: 375000 },
      { name: "10000 Gems", price: 599000, originalPrice: 750000 },
      { name: "50000 Gems", price: 2499000, originalPrice: 3750000 },
    ],
  },
  {
    name: "Lords Mobile",
    slug: "lords-mobile",
    image: "/games/lords-mobile.png",
    category: "Strategy",
    popular: false,
    nominals: [
      { name: "200 Gems", price: 16000 },
      { name: "1000 Gems", price: 77000, originalPrice: 80000 },
      { name: "2600 Gems", price: 189000, originalPrice: 208000 },
      { name: "5000 Gems", price: 355000, originalPrice: 400000 },
      { name: "13000 Gems", price: 889000, originalPrice: 1040000 },
      { name: "26000 Gems", price: 1699000, originalPrice: 2080000 },
    ],
  },
  {
    name: "Guns of Glory",
    slug: "guns-of-glory",
    image: "🏰",
    category: "Strategy",
    popular: false,
    nominals: [
      { name: "1000 Gold", price: 16000 },
      { name: "5000 Gold", price: 77000, originalPrice: 80000 },
      { name: "10000 Gold", price: 149000, originalPrice: 160000 },
      { name: "25000 Gold", price: 355000, originalPrice: 400000 },
      { name: "50000 Gold", price: 679000, originalPrice: 800000 },
      { name: "100000 Gold", price: 1290000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Evony",
    slug: "evony",
    image: "🏰",
    category: "Strategy",
    popular: false,
    nominals: [
      { name: "100 Gems", price: 16000 },
      { name: "500 Gems", price: 75000, originalPrice: 80000 },
      { name: "1000 Gems", price: 145000, originalPrice: 160000 },
      { name: "2500 Gems", price: 349000, originalPrice: 400000 },
      { name: "5000 Gems", price: 675000, originalPrice: 800000 },
      { name: "10000 Gems", price: 1290000, originalPrice: 1600000 },
    ],
  },
  {
    name: "King of Kings",
    slug: "king-of-kings",
    image: "🏰",
    category: "Strategy",
    popular: false,
    nominals: [
      { name: "100 Diamonds", price: 15000 },
      { name: "500 Diamonds", price: 73000, originalPrice: 75000 },
      { name: "1000 Diamonds", price: 142000, originalPrice: 150000 },
      { name: "2500 Diamonds", price: 342000, originalPrice: 375000 },
      { name: "5000 Diamonds", price: 662000, originalPrice: 750000 },
      { name: "10000 Diamonds", price: 1270000, originalPrice: 1500000 },
    ],
  },
  {
    name: "Rise of Nowlin",
    slug: "rise-of-nowlin",
    image: "🏰",
    category: "Strategy",
    popular: false,
    nominals: [
      { name: "100 Gems", price: 15000 },
      { name: "500 Gems", price: 73000, originalPrice: 75000 },
      { name: "1000 Gems", price: 142000, originalPrice: 150000 },
      { name: "2500 Gems", price: 342000, originalPrice: 375000 },
      { name: "5000 Gems", price: 662000, originalPrice: 750000 },
      { name: "10000 Gems", price: 1270000, originalPrice: 1500000 },
    ],
  },

  // ──────────────────────────────────────────────
  // MMORPG (🌍)
  // ──────────────────────────────────────────────
  {
    name: "Ragnarok M: Eternal Love",
    slug: "ragnarok-m-eternal-love",
    image: "/games/ragnarok-m-eternal-love.png",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "60 BCC", price: 15000 },
      { name: "300 BCC", price: 73000, originalPrice: 75000 },
      { name: "600 BCC", price: 142000, originalPrice: 150000 },
      { name: "1200 BCC", price: 279000, originalPrice: 300000 },
      { name: "3000 BCC", price: 685000, originalPrice: 750000 },
      { name: "6000 BCC", price: 1350000, originalPrice: 1500000 },
    ],
  },
  {
    name: "Tree of Savior",
    slug: "tree-of-savior",
    image: "🌍",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "100 TP", price: 15000 },
      { name: "500 TP", price: 73000, originalPrice: 75000 },
      { name: "1000 TP", price: 142000, originalPrice: 150000 },
      { name: "2500 TP", price: 342000, originalPrice: 375000 },
      { name: "5000 TP", price: 662000, originalPrice: 750000 },
      { name: "10000 TP", price: 1270000, originalPrice: 1500000 },
    ],
  },
  {
    name: "Black Desert Mobile",
    slug: "black-desert-mobile",
    image: "/games/black-desert-mobile.png",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "100 Pearls", price: 16000 },
      { name: "500 Pearls", price: 79000, originalPrice: 80000 },
      { name: "1000 Pearls", price: 155000, originalPrice: 160000 },
      { name: "2500 Pearls", price: 379000, originalPrice: 400000 },
      { name: "5000 Pearls", price: 739000, originalPrice: 800000 },
      { name: "10000 Pearls", price: 1430000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Dragon Nest Mobile",
    slug: "dragon-nest-mobile",
    image: "🌍",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "100 Diamonds", price: 15000 },
      { name: "500 Diamonds", price: 73000, originalPrice: 75000 },
      { name: "1000 Diamonds", price: 142000, originalPrice: 150000 },
      { name: "2500 Diamonds", price: 342000, originalPrice: 375000 },
      { name: "5000 Diamonds", price: 662000, originalPrice: 750000 },
      { name: "10000 Diamonds", price: 1270000, originalPrice: 1500000 },
    ],
  },
  {
    name: "Lineage 2M",
    slug: "lineage-2m",
    image: "🌍",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "100 Diamonds", price: 17000 },
      { name: "500 Diamonds", price: 83000, originalPrice: 85000 },
      { name: "1000 Diamonds", price: 162000, originalPrice: 170000 },
      { name: "2500 Diamonds", price: 392000, originalPrice: 425000 },
      { name: "5000 Diamonds", price: 762000, originalPrice: 850000 },
      { name: "10000 Diamonds", price: 1470000, originalPrice: 1700000 },
    ],
  },
  {
    name: "Lineage W",
    slug: "lineage-w",
    image: "🌍",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "100 Diamonds", price: 17000 },
      { name: "500 Diamonds", price: 83000, originalPrice: 85000 },
      { name: "1000 Diamonds", price: 162000, originalPrice: 170000 },
      { name: "2500 Diamonds", price: 392000, originalPrice: 425000 },
      { name: "5000 Diamonds", price: 762000, originalPrice: 850000 },
      { name: "10000 Diamonds", price: 1470000, originalPrice: 1700000 },
    ],
  },
  {
    name: "Perfect World Mobile",
    slug: "perfect-world-mobile",
    image: "🌍",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "100 Gold", price: 16000 },
      { name: "500 Gold", price: 77000, originalPrice: 80000 },
      { name: "1000 Gold", price: 149000, originalPrice: 160000 },
      { name: "2500 Gold", price: 359000, originalPrice: 400000 },
      { name: "5000 Gold", price: 699000, originalPrice: 800000 },
      { name: "10000 Gold", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "LifeAfter",
    slug: "lifeafter",
    image: "🌍",
    category: "MMORPG",
    popular: false,
    nominals: [
      { name: "100 Gold", price: 15000 },
      { name: "500 Gold", price: 73000, originalPrice: 75000 },
      { name: "1000 Gold", price: 142000, originalPrice: 150000 },
      { name: "2500 Gold", price: 342000, originalPrice: 375000 },
      { name: "5000 Gold", price: 662000, originalPrice: 750000 },
      { name: "10000 Gold", price: 1270000, originalPrice: 1500000 },
    ],
  },

  // ──────────────────────────────────────────────
  // ACTION (💥)
  // ──────────────────────────────────────────────
  {
    name: "Brawl Stars",
    slug: "brawl-stars",
    image: "/games/brawl-stars.png",
    category: "Action",
    popular: true,
    nominals: [
      { name: "30 Gems", price: 15000 },
      { name: "80 Gems", price: 38000, originalPrice: 40000 },
      { name: "170 Gems", price: 79000, originalPrice: 85000 },
      { name: "380 Gems", price: 159000, originalPrice: 190000 },
      { name: "800 Gems", price: 319000, originalPrice: 400000 },
      { name: "1700 Gems", price: 639000, originalPrice: 850000 },
    ],
  },
  {
    name: "Garena AOV",
    slug: "garena-aov",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "90 Vouchers", price: 15000 },
      { name: "230 Vouchers", price: 38000, originalPrice: 40000 },
      { name: "470 Vouchers", price: 75000, originalPrice: 80000 },
      { name: "950 Vouchers", price: 149000, originalPrice: 160000 },
      { name: "1900 Vouchers", price: 295000, originalPrice: 320000 },
      { name: "4750 Vouchers", price: 725000, originalPrice: 800000 },
    ],
  },
  {
    name: "Seven Knights 2",
    slug: "seven-knights-2",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "100 Rubies", price: 16000 },
      { name: "500 Rubies", price: 77000, originalPrice: 80000 },
      { name: "1000 Rubies", price: 149000, originalPrice: 160000 },
      { name: "2500 Rubies", price: 359000, originalPrice: 400000 },
      { name: "5000 Rubies", price: 699000, originalPrice: 800000 },
      { name: "10000 Rubies", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Solo Leveling: Arise",
    slug: "solo-leveling-arise",
    image: "/games/solo-leveling-arise.png",
    category: "Action",
    popular: false,
    nominals: [
      { name: "60 Stones", price: 16000 },
      { name: "300+30 Stones", price: 79000, originalPrice: 80000 },
      { name: "980+110 Stones", price: 249000, originalPrice: 264000 },
      { name: "1980+260 Stones", price: 479000, originalPrice: 528000 },
      { name: "3280+600 Stones", price: 799000, originalPrice: 880000 },
      { name: "6480+1600 Stones", price: 1599000, originalPrice: 1760000 },
    ],
  },
  {
    name: "Dead by Daylight Mobile",
    slug: "dead-by-daylight-mobile",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "110 Auric Cells", price: 15000 },
      { name: "550 Auric Cells", price: 73000, originalPrice: 75000 },
      { name: "1100 Auric Cells", price: 142000, originalPrice: 150000 },
      { name: "2200 Auric Cells", price: 275000, originalPrice: 300000 },
      { name: "4700 Auric Cells", price: 575000, originalPrice: 640000 },
      { name: "9500 Auric Cells", price: 1120000, originalPrice: 1300000 },
    ],
  },
  {
    name: "Identity V",
    slug: "identity-v",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "60 Fragments", price: 16000 },
      { name: "300 Fragments", price: 77000, originalPrice: 80000 },
      { name: "680 Fragments", price: 165000, originalPrice: 180000 },
      { name: "1280 Fragments", price: 305000, originalPrice: 340000 },
      { name: "3280 Fragments", price: 769000, originalPrice: 880000 },
      { name: "6480 Fragments", price: 1490000, originalPrice: 1728000 },
    ],
  },
  {
    name: "Sky: Children of the Light",
    slug: "sky-children-of-the-light",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "6 Candles", price: 16000 },
      { name: "24 Candles", price: 59000, originalPrice: 64000 },
      { name: "50 Candles", price: 119000, originalPrice: 133000 },
      { name: "100 Candles", price: 229000, originalPrice: 266000 },
      { name: "160 Candles", price: 359000, originalPrice: 426000 },
      { name: "300 Candles", price: 659000, originalPrice: 800000 },
    ],
  },
  {
    name: "Love Nikki",
    slug: "love-nikki",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "100 Diamonds", price: 16000 },
      { name: "500 Diamonds", price: 77000, originalPrice: 80000 },
      { name: "1000 Diamonds", price: 149000, originalPrice: 160000 },
      { name: "2500 Diamonds", price: 359000, originalPrice: 400000 },
      { name: "5000 Diamonds", price: 699000, originalPrice: 800000 },
      { name: "10000 Diamonds", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Saint Seiya: Awakening",
    slug: "saint-seiya-awakening",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "100 Gems", price: 16000 },
      { name: "500 Gems", price: 77000, originalPrice: 80000 },
      { name: "1000 Gems", price: 149000, originalPrice: 160000 },
      { name: "2500 Gems", price: 359000, originalPrice: 400000 },
      { name: "5000 Gems", price: 699000, originalPrice: 800000 },
      { name: "10000 Gems", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Heaven Burns Red",
    slug: "heaven-burns-red",
    image: "💥",
    category: "Action",
    popular: false,
    nominals: [
      { name: "120 Flowers", price: 16000 },
      { name: "600 Flowers", price: 77000, originalPrice: 80000 },
      { name: "1200 Flowers", price: 149000, originalPrice: 160000 },
      { name: "2400 Flowers", price: 289000, originalPrice: 320000 },
      { name: "6000 Flowers", price: 699000, originalPrice: 800000 },
      { name: "12000 Flowers", price: 1350000, originalPrice: 1600000 },
    ],
  },

  // ──────────────────────────────────────────────
  // SPORTS / RACING (⚽)
  // ──────────────────────────────────────────────
  {
    name: "FIFA Mobile",
    slug: "fifa-mobile",
    image: "⚽",
    category: "Sports",
    popular: false,
    nominals: [
      { name: "100 Points", price: 16000 },
      { name: "500 Points", price: 77000, originalPrice: 80000 },
      { name: "1050 Points", price: 155000, originalPrice: 168000 },
      { name: "2200 Points", price: 309000, originalPrice: 352000 },
      { name: "4600 Points", price: 615000, originalPrice: 736000 },
      { name: "12000 Points", price: 1490000, originalPrice: 1920000 },
    ],
  },
  {
    name: "eFootball",
    slug: "efootball",
    image: "⚽",
    category: "Sports",
    popular: false,
    nominals: [
      { name: "1050 eFootball Coins", price: 16000 },
      { name: "2600 eFootball Coins", price: 38000, originalPrice: 40000 },
      { name: "5500 eFootball Coins", price: 77000, originalPrice: 80000 },
      { name: "11500 eFootball Coins", price: 155000, originalPrice: 168000 },
      { name: "24000 eFootball Coins", price: 309000, originalPrice: 352000 },
      { name: "57000 eFootball Coins", price: 699000, originalPrice: 800000 },
    ],
  },
  {
    name: "NBA 2K Mobile",
    slug: "nba-2k-mobile",
    image: "⚽",
    category: "Sports",
    popular: false,
    nominals: [
      { name: "1000 VC", price: 16000 },
      { name: "5000 VC", price: 77000, originalPrice: 80000 },
      { name: "10000 VC", price: 149000, originalPrice: 160000 },
      { name: "25000 VC", price: 359000, originalPrice: 400000 },
      { name: "50000 VC", price: 699000, originalPrice: 800000 },
      { name: "100000 VC", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Asphalt 9: Legends",
    slug: "asphalt-9-legends",
    image: "⚽",
    category: "Sports",
    popular: false,
    nominals: [
      { name: "80 Tokens", price: 16000 },
      { name: "400 Tokens", price: 77000, originalPrice: 80000 },
      { name: "800 Tokens", price: 149000, originalPrice: 160000 },
      { name: "2000 Tokens", price: 359000, originalPrice: 400000 },
      { name: "5000 Tokens", price: 699000, originalPrice: 800000 },
      { name: "10000 Tokens", price: 1350000, originalPrice: 1600000 },
    ],
  },

  // ──────────────────────────────────────────────
  // CARD / BOARD (🃏)
  // ──────────────────────────────────────────────
  {
    name: "Yu-Gi-Oh! Master Duel",
    slug: "yu-gi-oh-master-duel",
    image: "🃏",
    category: "Card",
    popular: false,
    nominals: [
      { name: "100 Gems", price: 16000 },
      { name: "300 Gems", price: 46000, originalPrice: 48000 },
      { name: "600 Gems", price: 89000, originalPrice: 96000 },
      { name: "1000 Gems", price: 145000, originalPrice: 160000 },
      { name: "2500 Gems", price: 349000, originalPrice: 400000 },
      { name: "6000 Gems", price: 799000, originalPrice: 960000 },
    ],
  },
  {
    name: "Marvel Snap",
    slug: "marvel-snap",
    image: "🃏",
    category: "Card",
    popular: false,
    nominals: [
      { name: "1000 Gold", price: 16000 },
      { name: "2100 Gold", price: 31000, originalPrice: 33600 },
      { name: "4600 Gold", price: 65000, originalPrice: 73600 },
      { name: "10000 Gold", price: 135000, originalPrice: 160000 },
      { name: "21500 Gold", price: 285000, originalPrice: 344000 },
      { name: "47000 Gold", price: 599000, originalPrice: 752000 },
    ],
  },
  {
    name: "Hearthstone",
    slug: "hearthstone",
    image: "🃏",
    category: "Card",
    popular: false,
    nominals: [
      { name: "2 Packs (300 Gold)", price: 16000 },
      { name: "7 Packs (700 Gold)", price: 53000, originalPrice: 56000 },
      { name: "15 Packs (1500 Gold)", price: 109000, originalPrice: 120000 },
      { name: "40 Packs (4000 Gold)", price: 285000, originalPrice: 320000 },
      { name: "60 Packs (6000 Gold)", price: 415000, originalPrice: 480000 },
      { name: "100 Packs (10000 Gold)", price: 685000, originalPrice: 800000 },
    ],
  },
  {
    name: "Magic: The Gathering Arena",
    slug: "magic-the-gathering-arena",
    image: "🃏",
    category: "Card",
    popular: false,
    nominals: [
      { name: "750 Gems", price: 16000 },
      { name: "2200 Gems", price: 43000, originalPrice: 47000 },
      { name: "4500 Gems", price: 86000, originalPrice: 96000 },
      { name: "10000 Gems", price: 175000, originalPrice: 210000 },
      { name: "23000 Gems", price: 395000, originalPrice: 490000 },
      { name: "50000 Gems", price: 845000, originalPrice: 1070000 },
    ],
  },
  {
    name: "Auto Chess",
    slug: "auto-chess",
    image: "🃏",
    category: "Card",
    popular: false,
    nominals: [
      { name: "100 Coins", price: 16000 },
      { name: "500 Coins", price: 77000, originalPrice: 80000 },
      { name: "1000 Coins", price: 149000, originalPrice: 160000 },
      { name: "2500 Coins", price: 359000, originalPrice: 400000 },
      { name: "5000 Coins", price: 699000, originalPrice: 800000 },
      { name: "10000 Coins", price: 1350000, originalPrice: 1600000 },
    ],
  },

  // ──────────────────────────────────────────────
  // OTHER POPULAR (🎯)
  // ──────────────────────────────────────────────
  {
    name: "Toram Online",
    slug: "toram-online",
    image: "🎯",
    category: "Other",
    popular: false,
    nominals: [
      { name: "100 Spina", price: 16000 },
      { name: "500 Spina", price: 77000, originalPrice: 80000 },
      { name: "1000 Spina", price: 149000, originalPrice: 160000 },
      { name: "2500 Spina", price: 359000, originalPrice: 400000 },
      { name: "5000 Spina", price: 699000, originalPrice: 800000 },
      { name: "10000 Spina", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Elsword",
    slug: "elsword",
    image: "🎯",
    category: "Other",
    popular: false,
    nominals: [
      { name: "1000 ED", price: 16000 },
      { name: "5000 ED", price: 77000, originalPrice: 80000 },
      { name: "10000 ED", price: 149000, originalPrice: 160000 },
      { name: "25000 ED", price: 359000, originalPrice: 400000 },
      { name: "50000 ED", price: 699000, originalPrice: 800000 },
      { name: "100000 ED", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Grand Chase",
    slug: "grand-chase",
    image: "🎯",
    category: "Other",
    popular: false,
    nominals: [
      { name: "100 Points", price: 16000 },
      { name: "500 Points", price: 77000, originalPrice: 80000 },
      { name: "1000 Points", price: 149000, originalPrice: 160000 },
      { name: "2500 Points", price: 359000, originalPrice: 400000 },
      { name: "5000 Points", price: 699000, originalPrice: 800000 },
      { name: "10000 Points", price: 1350000, originalPrice: 1600000 },
    ],
  },
  {
    name: "Ultra Demons",
    slug: "ultra-demons",
    image: "🎯",
    category: "Other",
    popular: false,
    nominals: [
      { name: "100 Gems", price: 16000 },
      { name: "500 Gems", price: 77000, originalPrice: 80000 },
      { name: "1000 Gems", price: 149000, originalPrice: 160000 },
      { name: "2500 Gems", price: 359000, originalPrice: 400000 },
      { name: "5000 Gems", price: 699000, originalPrice: 800000 },
      { name: "10000 Gems", price: 1350000, originalPrice: 1600000 },
    ],
  },
];

// ──────────────────────────────────────────────
// Slider Data
// ──────────────────────────────────────────────
const slidersData = [
  {
    image: "/banners/mlbb-diamond-sale.png",
    title: "MLBB Diamond Sale!",
    subtitle: "Diskon hingga 30% untuk semua diamond MLBB",
    gameSlug: "mobile-legends-bang-bang",
    order: 1,
    active: true,
  },
  {
    image: "/banners/free-fire-promo.png",
    title: "Free Fire Top Up Murah",
    subtitle: "Top up FF tercepat dan termurah se-Indonesia",
    gameSlug: "free-fire",
    order: 2,
    active: true,
  },
  {
    image: "/banners/genshin-impact-promo.png",
    title: "Genshin Impact Promo",
    subtitle: "Beli Genesis Crystals dengan harga spesial",
    gameSlug: "genshin-impact",
    order: 3,
    active: true,
  },
  {
    image: "/banners/pubg-mobile-uc.png",
    title: "PUBG Mobile UC",
    subtitle: "Top up UC PUBG Mobile proses instan",
    gameSlug: "pubg-mobile",
    order: 4,
    active: true,
  },
];

// ──────────────────────────────────────────────
// Settings Data
// ──────────────────────────────────────────────
const settingsData = [
  { key: "whatsapp", value: "6281234567890" },
  { key: "rekening", value: "1234567890" },
  { key: "bankName", value: "Bank BCA" },
  { key: "bankHolder", value: "Zall Store" },
];

// ============================================================
// POST Handler
// ============================================================

export async function POST() {
  try {
    // ── 1. Clear existing data in correct order ──
    await db.nominal.deleteMany();
    await db.transaction.deleteMany();
    await db.game.deleteMany();
    await db.slider.deleteMany();
    await db.settings.deleteMany();
    await db.onlineUser.deleteMany();
    await db.loginAttempt.deleteMany();

    // ── 2. Create games with nested nominals ──
    let totalNominals = 0;

    for (const game of gamesData) {
      await db.game.create({
        data: {
          name: game.name,
          slug: game.slug,
          image: game.image,
          category: game.category,
          popular: game.popular,
          nominals: {
            create: game.nominals.map((n) => ({
              name: n.name,
              price: n.price,
              originalPrice: n.originalPrice ?? null,
            })),
          },
        },
      });
      totalNominals += game.nominals.length;
    }

    // ── 3. Create sliders ──
    for (const slider of slidersData) {
      await db.slider.create({
        data: {
          image: slider.image,
          title: slider.title,
          subtitle: slider.subtitle,
          gameSlug: slider.gameSlug,
          order: slider.order,
          active: slider.active,
        },
      });
    }

    // ── 4. Create settings ──
    for (const setting of settingsData) {
      await db.settings.create({
        data: {
          key: setting.key,
          value: setting.value,
        },
      });
    }

    // ── 5. Return summary ──
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        games: gamesData.length,
        nominals: totalNominals,
        sliders: slidersData.length,
        settings: settingsData.length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
