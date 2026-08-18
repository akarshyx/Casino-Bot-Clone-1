import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Router as WouterRouter, Switch, useLocation, useParams } from 'wouter';
import {
  ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3,
  Bell, ChevronDown, CircleDollarSign, CircleHelp, Coins, Copy, Dices,
  Fish, Gift, Grid2X2, HandCoins, Home as HomeIcon, Languages,
  LayoutGrid, Menu, MessageCircle, Minus, MoreHorizontal,
  PanelLeft, Play, Plus, RotateCcw, Settings2, Shield,
  Sparkles, Star, Target, Trophy, Users, WalletCards, X, Zap
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type IconType = typeof Dices;
type Game = { slug: string; name: string; category: string; description: string; color: string; accent: string; Icon: IconType; featured?: boolean; image?: string };

const games: Game[] = [
  { slug: 'crash', name: 'Crash', category: 'Arcade', description: 'Ride the curve. Call it before it breaks.', color: '#242040', accent: '#fa9671', Icon: BarChart3, featured: true },
  { slug: 'monkey-tower', name: 'Monkey Tower', category: 'Skill', description: 'Pick a tile. Climb a little higher.', color: '#332048', accent: '#d8a2fd', Icon: Trophy, featured: true, image: '/images/tower-bomb.png' },
  { slug: 'fishing', name: 'Fishing', category: 'Arcade', description: 'Cast into the deep. Reel in a catch.', color: '#143846', accent: '#5ee8cc', Icon: Fish },
  { slug: 'pachinko', name: 'Pachinko', category: 'Chance', description: 'Let gravity decide your route.', color: '#453024', accent: '#ffc264', Icon: Target },
  { slug: 'money-wheel', name: 'Money Wheel', category: 'Chance', description: 'One spin. A dozen possibilities.', color: '#3e2441', accent: '#f394c8', Icon: RotateCcw },
  { slug: 'blackjack', name: 'Blackjack', category: 'Cards', description: 'Keep your cool. Beat the house.', color: '#173b39', accent: '#85f0c0', Icon: Grid2X2 },
  { slug: 'mines', name: 'Mines', category: 'Skill', description: 'Trust your instinct. Avoid the dark.', color: '#30293e', accent: '#a994f8', Icon: Sparkles },
  { slug: 'roulette', name: 'Roulette', category: 'Classic', description: 'A perfect little orbit of chance.', color: '#3e2029', accent: '#ff7581', Icon: Dices },
  { slug: 'dice', name: 'Dice', category: 'Classic', description: 'Roll with it. Keep the tempo.', color: '#283b44', accent: '#8ce0fb', Icon: Dices },
  { slug: 'slots', name: 'Slots', category: 'Arcade', description: 'Three reels. One bright surprise.', color: '#47351e', accent: '#ffd26c', Icon: LayoutGrid },
  { slug: 'darts', name: 'Darts', category: 'Skill', description: 'Take aim at a clean bullseye.', color: '#253b34', accent: '#9de88b', Icon: Target },
];

const navItems = [
  { label: 'Lobby', path: '/', Icon: HomeIcon },
  { label: 'Games', path: '/games', Icon: LayoutGrid },
  { label: 'Wallet', path: '/wallet', Icon: WalletCards },
  { label: 'Bonuses', path: '/bonuses', Icon: Gift, badge: '1' },
  { label: 'Referrals', path: '/referrals', Icon: Users },
  { label: 'Settings', path: '/settings', Icon: Settings2 },
];

function formatCredits(value: number) {
  return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} cr`;
}

function Shell({ children, credits, onOpenWallet }: { children: React.ReactNode; credits: number; onOpenWallet: () => void }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = location.startsWith('/play') ? '/games' : location;
  return (
    <div className="app-noise min-h-[100dvh] shell-bg">
      <aside className={`fixed inset-y-0 left-0 z-30 w-[252px] border-r border-white/[.07] bg-[#151220]/95 px-5 py-6 backdrop-blur-xl transition-transform md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3" data-testid="link-brand">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5aa4e] text-[#26161a] shadow-[0_8px_24px_rgba(245,170,78,.2)]"><Dices size={21} strokeWidth={2.5} /></div>
            <div><div className="display text-lg font-bold tracking-tight text-[#f8eee4]">rollers</div><div className="mono text-[9px] uppercase tracking-[.22em] text-[#948ba6]">private lounge</div></div>
          </Link>
          <button className="text-[#887d98] md:hidden" onClick={() => setMobileOpen(false)} data-testid="button-close-menu"><X size={19} /></button>
        </div>
        <div className="mono mb-3 px-3 text-[9px] uppercase tracking-[.2em] text-[#736980]">Explore</div>
        <nav className="space-y-1">
          {navItems.map(({ label, path, Icon, badge }) => (
            <Link key={path} href={path} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`} className={`group flex items-center justify-between rounded-xl px-3 py-3 text-[13px] font-semibold transition-colors ${active === path ? 'bg-[#f5aa4e]/[.12] text-[#f7b967]' : 'text-[#9c93aa] hover:bg-white/[.04] hover:text-[#e9e0d6]'}`}>
              <span className="flex items-center gap-3"><Icon size={17} strokeWidth={1.8} /><span>{label}</span></span>
              {badge && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f5aa4e] px-1.5 text-[10px] font-bold text-[#26161a]">{badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5">
          <div className="mb-4 rounded-2xl border border-[#d99a5c]/20 bg-gradient-to-br from-[#392330] to-[#211c2e] p-4">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-[#efe1d7]">Daily streak</span><Zap size={15} className="text-[#f5aa4e]" /></div>
            <div className="mb-3 flex gap-1.5">{[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n < 4 ? 'bg-[#f5aa4e]' : 'bg-white/10'}`} />)}</div>
            <p className="mb-0 text-[11px] leading-relaxed text-[#aa8e91]">One more day unlocks a bigger drop.</p>
          </div>
          <div className="flex items-center gap-2.5 border-t border-white/[.07] pt-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#514367] text-xs font-bold text-[#f4cda1]">AV</div>
            <div className="min-w-0"><p className="truncate text-xs font-bold text-[#e6dce0]">Arcade visitor</p><p className="text-[10px] text-[#81778b]">Demo account</p></div>
            <button className="ml-auto text-[#776d82]" data-testid="button-profile-menu"><MoreHorizontal size={17} /></button>
          </div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} data-testid="button-overlay-close" />}
      <main className="md:pl-[252px]">
        <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-white/[.06] bg-[#100e18]/75 px-5 backdrop-blur-xl md:px-10">
          <button className="text-[#b3a8bc] md:hidden" onClick={() => setMobileOpen(true)} data-testid="button-open-menu"><Menu size={22} /></button>
          <div className="hidden items-center gap-2 text-xs text-[#7e748d] md:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#67d3aa]" /> Local demo mode · Credits have no cash value</div>
          <div className="ml-auto flex items-center gap-3">
            <button className="hidden text-[#9d91aa] sm:block" data-testid="button-notifications"><Bell size={18} /></button>
            <button onClick={onOpenWallet} className="flex items-center gap-2 rounded-xl border border-[#f5aa4e]/20 bg-[#f5aa4e]/[.09] px-3 py-2 text-xs font-bold text-[#f7c27b] transition hover:bg-[#f5aa4e]/[.16]" data-testid="button-header-wallet">
              <CircleDollarSign size={16} /><span>{formatCredits(credits)}</span><ChevronDown size={13} className="text-[#a77b54]" />
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-[1400px] px-5 py-7 pb-28 md:px-10 md:py-10 md:pb-12">{children}</div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/[.08] bg-[#151220]/95 px-2 py-2 backdrop-blur-xl md:hidden">
        <div className="flex justify-around">{navItems.slice(0, 5).map(({ label, path, Icon }) => <Link key={path} href={path} data-testid={`link-mobile-${label.toLowerCase()}`} className={`flex min-w-[54px] flex-col items-center gap-1 rounded-lg py-1 text-[9px] font-semibold ${active === path ? 'text-[#f5aa4e]' : 'text-[#84798e]'}`}><Icon size={17} /><span>{label}</span></Link>)}</div>
      </div>
    </div>
  );
}

function GameArt({ game, large = false }: { game: Game; large?: boolean }) {
  const Icon = game.Icon;
  return <div className={`relative overflow-hidden ${large ? 'h-full min-h-[280px]' : 'h-[150px]'}`} style={{ background: `radial-gradient(circle at 65% 30%, ${game.accent}33, transparent 30%), linear-gradient(135deg, ${game.color}, #181522)` }}>
    <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border border-white/[.07]" />
    <div className="absolute -right-1 top-3 h-28 w-28 rounded-full border border-white/[.06]" />
    {game.image ? <img src={game.image} alt="" className="absolute bottom-1 right-7 h-32 w-32 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,.35)]" /> : <Icon size={large ? 82 : 58} strokeWidth={1.1} className="absolute bottom-7 right-8" style={{ color: game.accent }} />}
    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[9px] uppercase tracking-wider text-white/60"><span className="h-1 w-1 rounded-full" style={{ backgroundColor: game.accent }} />{game.category}</div>
  </div>;
}

function GameCard({ game, onOpen }: { game: Game; onOpen: (slug: string) => void }) {
  return <button onClick={() => onOpen(game.slug)} className="game-card group overflow-hidden rounded-2xl border border-white/[.08] bg-[#1c1828] text-left" data-testid={`card-game-${game.slug}`}>
    <GameArt game={game} />
    <div className="p-4"><div className="mb-1 flex items-center justify-between"><h3 className="display text-[15px] font-bold text-[#f3e8de]">{game.name}</h3><Play size={13} className="text-[#f5aa4e] opacity-0 transition group-hover:opacity-100" fill="currentColor" /></div><p className="text-[11px] leading-relaxed text-[#93889c]">{game.description}</p></div>
  </button>;
}

function HomeView({ onOpenGame, onClaim, claimed }: { onOpenGame: (slug: string) => void; onClaim: () => void; claimed: boolean }) {
  return <div className="space-y-10">
    <section className="fade-up relative overflow-hidden rounded-[28px] border border-[#aa6980]/25 bg-[#251b2a] px-6 py-8 md:px-12 md:py-12">
      <div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(ellipse_at_70%_50%,#8e3d4d55,transparent_60%)]" />
      <div className="absolute -right-16 -top-20 h-80 w-80 rounded-full border border-[#e28a7350] md:h-[500px] md:w-[500px]" />
      <div className="relative max-w-[610px]"><div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#e8a870]"><Sparkles size={14} /> Your corner of chance</div>
        <h1 className="display max-w-[600px] text-4xl font-bold leading-[1.04] tracking-[-.05em] text-[#f7eee6] sm:text-6xl">A little luck<br /><span className="text-[#f5aa4e]">goes a long way.</span></h1>
        <p className="mt-5 max-w-[430px] text-sm leading-7 text-[#b6a2ac]">Eleven games, one private lounge. Play at your pace with credits made for the night, not the bank.</p>
        <div className="mt-7 flex flex-wrap gap-3"><button className="btn-primary flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold" onClick={() => onOpenGame('crash')} data-testid="button-play-crash"><Play size={15} fill="currentColor" /> Play Crash</button><Link href="/games" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-5 py-3 text-xs font-bold text-[#ddd0d1] hover:bg-white/[.09]" data-testid="link-browse-games">Browse games <ArrowRight size={14} /></Link></div>
      </div>
      <div className="relative mt-9 flex max-w-[500px] gap-7 border-t border-white/10 pt-5 md:absolute md:bottom-10 md:right-12 md:mt-0 md:border-t-0 md:pt-0"><div><div className="mono text-[10px] text-[#8f7887]">VISITORS TONIGHT</div><div className="display mt-1 text-lg font-bold text-[#f1e1d8]">1,284 <span className="ml-1 text-xs font-normal text-[#69ce9c]">+8.4%</span></div></div><div><div className="mono text-[10px] text-[#8f7887]">GAMES PLAYED</div><div className="display mt-1 text-lg font-bold text-[#f1e1d8]">48.7k</div></div></div>
    </section>
    <section className="fade-up delay-1 grid gap-5 md:grid-cols-[1.5fr_1fr]">
      <div className="glass flex min-h-[180px] flex-col justify-between rounded-2xl p-6"><div className="flex items-start justify-between"><div><span className="mono text-[10px] uppercase tracking-[.16em] text-[#8e8196]">Tonight's drop</span><h2 className="display mt-2 text-xl font-bold text-[#f0e2d9]">Your daily bonus is ready</h2></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5aa4e]/15 text-[#f5aa4e]"><Gift size={19} /></div></div><div className="flex items-end justify-between"><p className="text-xs text-[#948a99]">{claimed ? 'Come back tomorrow for another drop.' : 'A small thank-you for showing up.'}</p><button onClick={onClaim} disabled={claimed} className="btn-primary rounded-lg px-4 py-2 text-[11px] font-extrabold disabled:cursor-default disabled:opacity-40" data-testid="button-claim-home">{claimed ? 'Claimed' : 'Claim +250 cr'}</button></div></div>
      <div className="rounded-2xl border border-[#63518b]/30 bg-[#26213d] p-6"><div className="flex items-center gap-2 text-[#bea8f6]"><Users size={16} /><span className="mono text-[10px] uppercase tracking-[.16em]">Bring your people</span></div><h2 className="display mt-3 text-xl font-bold text-[#f0e5ee]">Share the room.</h2><p className="mt-1 text-xs leading-5 text-[#a59ab7]">Invite a friend and you both get a boost.</p><Link href="/referrals" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#d0bcff]" data-testid="link-referrals-card">See your invite link <ArrowRight size={13} /></Link></div>
    </section>
    <section className="fade-up delay-2"><div className="mb-5 flex items-end justify-between"><div><span className="mono text-[10px] uppercase tracking-[.18em] text-[#84778e]">The room</span><h2 className="display mt-1 text-2xl font-bold tracking-tight text-[#f2e7df]">Pick your poison</h2></div><Link href="/games" className="flex items-center gap-2 text-xs font-bold text-[#bdadbd] hover:text-[#f5aa4e]" data-testid="link-view-all-games">View all <ArrowRight size={14} /></Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{games.slice(0, 4).map((game) => <GameCard key={game.slug} game={game} onOpen={onOpenGame} />)}</div></section>
  </div>;
}

function GamesView({ onOpenGame }: { onOpenGame: (slug: string) => void }) {
  const [filter, setFilter] = useState('All games');
  const filters = ['All games', 'Arcade', 'Skill', 'Chance', 'Classic', 'Cards'];
  const visible = filter === 'All games' ? games : games.filter((g) => g.category === filter);
  return <div className="space-y-8 fade-up"><div><span className="mono text-[10px] uppercase tracking-[.18em] text-[#84778e]">Choose your room</span><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><h1 className="display text-4xl font-bold tracking-[-.04em] text-[#f3e9df]">All games</h1><span className="text-xs text-[#887d94]">{games.length} tables open tonight</span></div></div><div className="mobile-scroll flex gap-2 pb-1">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-bold transition ${filter === item ? 'border-[#f5aa4e] bg-[#f5aa4e] text-[#24171b]' : 'border-white/10 bg-white/[.035] text-[#a99eaf] hover:border-white/20'}`} data-testid={`button-filter-${item.toLowerCase().replace(' ', '-')}`}>{item}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((game) => <GameCard key={game.slug} game={game} onOpen={onOpenGame} />)}</div></div>;
}

function Stat({ label, value, detail, Icon }: { label: string; value: string; detail?: string; Icon: IconType }) {
  return <div className="glass rounded-2xl p-5"><Icon size={17} className="mb-4 text-[#f5aa4e]" /><div className="mono text-[9px] uppercase tracking-[.18em] text-[#877c90]">{label}</div><div className="display mt-1 text-2xl font-bold text-[#f3e7db]">{value}</div>{detail && <div className="mt-1 text-[11px] text-[#6bc99e]">{detail}</div>}</div>;
}

function WalletView({ credits, setCredits, onClaim, claimed }: { credits: number; setCredits: (n: number) => void; onClaim: () => void; claimed: boolean }) {
  const [amount, setAmount] = useState(500);
  const [notice, setNotice] = useState('');
  const activities: Array<{ name: string; time: string; val: string; Icon: IconType }> = [
    { name: 'Daily bonus', time: 'Today, 09:42', val: '+250 cr', Icon: Gift },
    { name: 'Crash · cashout', time: 'Yesterday, 23:18', val: '+184 cr', Icon: ArrowUpRight },
    { name: 'Monkey Tower · bet', time: 'Yesterday, 23:15', val: '−50 cr', Icon: ArrowDownLeft },
    { name: 'Demo top up', time: 'Monday, 18:05', val: '+500 cr', Icon: Plus },
  ];
  const add = () => { setCredits(credits + amount); setNotice(`Added ${formatCredits(amount)} to your demo wallet.`); };
  return <div className="space-y-8 fade-up"><div><span className="mono text-[10px] uppercase tracking-[.18em] text-[#84778e]">Your credits</span><h1 className="display mt-2 text-4xl font-bold tracking-[-.04em] text-[#f3e9df]">Wallet</h1></div><div className="grid gap-4 sm:grid-cols-3"><Stat label="Available balance" value={formatCredits(credits)} detail="Demo credits only" Icon={CircleDollarSign} /><Stat label="Total won" value="1,840 cr" detail="+12.6% this week" Icon={ArrowUpRight} /><Stat label="Total played" value="6,275 cr" Icon={HandCoins} /></div><div className="grid gap-5 lg:grid-cols-[1.05fr_1.6fr]"><section className="glass rounded-2xl p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="display font-bold text-[#efe2d9]">Top up demo credits</h2><p className="mt-1 text-xs text-[#887d91]">No payment. Just more room to play.</p></div><Coins size={21} className="text-[#f5aa4e]" /></div><div className="grid grid-cols-3 gap-2">{[250, 500, 1000].map((value) => <button key={value} onClick={() => setAmount(value)} className={`rounded-xl border py-3 text-xs font-bold ${amount === value ? 'border-[#f5aa4e] bg-[#f5aa4e]/15 text-[#f6be75]' : 'border-white/10 text-[#a497a6]'}`} data-testid={`button-amount-${value}`}>{value} cr</button>)}</div><button onClick={add} className="btn-primary mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold" data-testid="button-add-credits"><Plus size={15} /> Add {amount} credits</button>{!claimed && <button onClick={onClaim} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dca05f]/25 bg-[#dca05f]/[.07] py-3 text-xs font-bold text-[#eab36e]" data-testid="button-claim-wallet"><Gift size={15} /> Claim daily 250 cr</button>}{notice && <p className="mt-3 text-center text-[11px] text-[#70c99b]" data-testid="status-wallet-notice">{notice}</p>}</section><section className="glass rounded-2xl p-6"><div className="mb-5 flex items-center justify-between"><h2 className="display font-bold text-[#efe2d9]">Recent activity</h2><button className="text-[#83768e]" data-testid="button-wallet-more"><MoreHorizontal size={17} /></button></div><div className="space-y-1">{activities.map(({ name, time, val, Icon: ActivityIcon }) => <div className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-white/[.025]" key={name}><div className={`flex h-9 w-9 items-center justify-center rounded-lg ${val.startsWith('+') ? 'bg-[#65c99a]/10 text-[#65c99a]' : 'bg-[#f09a7a]/10 text-[#f09a7a]'}`}><ActivityIcon size={15} /></div><div className="min-w-0 flex-1"><p className="text-xs font-bold text-[#ddd0d3]">{name}</p><p className="mono text-[9px] text-[#746b7e]">{time}</p></div><span className={`mono text-xs font-medium ${val.startsWith('+') ? 'text-[#65c99a]' : 'text-[#e7a18c]'}`}>{val}</span><span className="text-[#665c70]"><ChevronDown size={13} className="-rotate-90" /></span></div>)}</div></section></div></div>;
}

function BonusesView({ onClaim, claimed }: { onClaim: () => void; claimed: boolean }) {
  return <div className="space-y-8 fade-up"><div><span className="mono text-[10px] uppercase tracking-[.18em] text-[#84778e]">Rewards for returning</span><h1 className="display mt-2 text-4xl font-bold tracking-[-.04em] text-[#f3e9df]">Bonuses</h1></div><section className="relative overflow-hidden rounded-2xl border border-[#e0a761]/30 bg-gradient-to-r from-[#3b2731] to-[#282037] p-7 md:p-9"><div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-[#f5aa4e]/20" /><div className="relative max-w-[550px]"><div className="mb-3 flex items-center gap-2 text-[#f5aa4e]"><Gift size={19} /><span className="mono text-[10px] uppercase tracking-[.18em]">Available now</span></div><h2 className="display text-3xl font-bold text-[#f6e8db]">Daily drop</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#bda6a0]">Open the lounge each day and we’ll leave a little something at the door. Keep your streak alive for bigger surprises.</p><button onClick={onClaim} disabled={claimed} className="btn-primary mt-6 rounded-xl px-5 py-3 text-xs font-extrabold disabled:opacity-40" data-testid="button-claim-bonus">{claimed ? 'Collected for today' : 'Collect 250 credits'}</button></div></section><div className="grid gap-4 md:grid-cols-3">{[['01','First visit','A warm welcome, on us.','250 cr'],['02','Three day streak','Keep the lights on.','500 cr'],['03','Lucky regular','Seven nights in a row.','1,000 cr']].map(([num, title, copy, value], index) => <div key={num} className={`glass rounded-2xl p-5 ${index === 0 ? 'border-[#f5aa4e]/30' : ''}`}><span className="mono text-[10px] text-[#f5aa4e]">{num}</span><h3 className="display mt-5 font-bold text-[#eee0d7]">{title}</h3><p className="mt-1 text-xs text-[#877d90]">{copy}</p><div className="mt-6 border-t border-white/[.07] pt-3 text-xs font-bold text-[#d5bdab]">{value}</div></div>)}</div></div>;
}

function ReferralsView() {
  const [copied, setCopied] = useState(false);
  const copy = () => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  return <div className="space-y-8 fade-up"><div><span className="mono text-[10px] uppercase tracking-[.18em] text-[#84778e]">Make it a group project</span><h1 className="display mt-2 text-4xl font-bold tracking-[-.04em] text-[#f3e9df]">Referrals</h1></div><section className="relative overflow-hidden rounded-2xl border border-[#63518b]/35 bg-[#27213d] p-7 md:p-10"><div className="absolute right-8 top-8 opacity-20"><Users size={120} strokeWidth={.7} /></div><div className="relative max-w-[520px]"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#bd9af5]/15 text-[#caaef9]"><Users size={21} /></div><h2 className="display text-3xl font-bold text-[#f3e7ec]">The more, the merrier.</h2><p className="mt-3 text-sm leading-6 text-[#b2a3bc]">Your friends get <strong className="text-[#e1c4ff]">250 credits</strong> to start. You get a bonus every time they find their way into a game.</p><div className="mt-7 flex max-w-md items-center rounded-xl border border-white/10 bg-black/20 p-1.5"><span className="mono min-w-0 flex-1 truncate px-3 text-xs text-[#c8b8d4]">rollers.lounge/invite/AV-7Q2K</span><button onClick={copy} className="flex items-center gap-2 rounded-lg bg-[#c9a5f4] px-3 py-2 text-[11px] font-bold text-[#261c35]" data-testid="button-copy-referral"><Copy size={14} /> {copied ? 'Copied' : 'Copy'}</button></div></div></section><div className="grid gap-4 sm:grid-cols-3"><Stat label="Friends invited" value="4" Icon={Users} /><Stat label="Credits earned" value="1,000 cr" Icon={Gift} /><Stat label="Next reward" value="1 friend" Icon={Star} /></div><section className="glass rounded-2xl p-6"><div className="mb-4 flex items-center justify-between"><h2 className="display font-bold text-[#efe2d9]">Your circle</h2><span className="rounded-full bg-[#65c99a]/10 px-2 py-1 text-[10px] font-bold text-[#65c99a]">4 active</span></div>{['Mina K.','Noah R.','Jules P.','Samir D.'].map((name, i) => <div key={name} className="flex items-center gap-3 border-t border-white/[.06] py-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4a3c5d] text-[10px] font-bold text-[#dec2ac]">{name.split(' ').map((v) => v[0]).join('')}</div><span className="flex-1 text-xs font-bold text-[#d4c7d0]">{name}</span><span className="text-[11px] text-[#6bc99e]">+250 cr</span><span className="text-[10px] text-[#756b7c]">{i + 1}d ago</span></div>)}</section></div>;
}

function SettingsView() {
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('Credits');
  const [sound, setSound] = useState(true);
  const [reduced, setReduced] = useState(false);
  return <div className="max-w-3xl space-y-8 fade-up"><div><span className="mono text-[10px] uppercase tracking-[.18em] text-[#84778e]">Make it yours</span><h1 className="display mt-2 text-4xl font-bold tracking-[-.04em] text-[#f3e9df]">Settings</h1></div><section className="glass overflow-hidden rounded-2xl"><div className="border-b border-white/[.07] p-6"><h2 className="display font-bold text-[#efe2d9]">Preferences</h2><p className="mt-1 text-xs text-[#84798d]">Small switches for a better night in.</p></div><SettingRow Icon={Languages} title="Language" copy="Choose how the lounge speaks to you"><select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-white/10 bg-[#171320] px-3 py-2 text-xs font-bold text-[#d9ccd5] outline-none" data-testid="select-language"><option>English</option><option>Español</option><option>Français</option></select></SettingRow><SettingRow Icon={CircleDollarSign} title="Display currency" copy="Your balance is always virtual"><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded-lg border border-white/10 bg-[#171320] px-3 py-2 text-xs font-bold text-[#d9ccd5] outline-none" data-testid="select-currency"><option>Credits</option><option>Tokens</option></select></SettingRow><SettingRow Icon={MessageCircle} title="Sound effects" copy="A little atmosphere when you play"><Toggle on={sound} setOn={setSound} testId="toggle-sound" /></SettingRow><SettingRow Icon={PanelLeft} title="Reduced motion" copy="Keep transitions calm and focused"><Toggle on={reduced} setOn={setReduced} testId="toggle-motion" /></SettingRow></section><section className="glass rounded-2xl p-6"><div className="flex items-start gap-4"><Shield size={20} className="mt-1 text-[#65c99a]" /><div><h2 className="display font-bold text-[#efe2d9]">Demo mode, by design</h2><p className="mt-2 text-xs leading-6 text-[#91869a]">Rollers is a private arcade lounge for play. Credits are fictional, there are no payments, withdrawals, or real-world prizes. Take a break whenever you need one.</p></div></div></section></div>;
}

function SettingRow({ Icon, title, copy, children }: { Icon: IconType; title: string; copy: string; children: React.ReactNode }) {
  return <div className="flex items-center gap-4 border-t border-white/[.07] px-6 py-5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[.045] text-[#aa9bab]"><Icon size={16} /></div><div className="flex-1"><h3 className="text-xs font-bold text-[#d9cbd0]">{title}</h3><p className="mt-1 text-[11px] text-[#81778a]">{copy}</p></div>{children}</div>;
}
function Toggle({ on, setOn, testId }: { on: boolean; setOn: (v: boolean) => void; testId: string }) {
  return <button onClick={() => setOn(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? 'bg-[#f5aa4e]' : 'bg-white/10'}`} data-testid={testId}><span className={`absolute top-1 h-4 w-4 rounded-full bg-[#251b2b] transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} /></button>;
}

function PlayView({ slug, credits, setCredits, onBack }: { slug: string; credits: number; setCredits: (n: number) => void; onBack: () => void }) {
  const game = games.find((item) => item.slug === slug) || games[0];
  const [bet, setBet] = useState(50);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState('Ready when you are.');
  const [active, setActive] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const Icon = game.Icon;
  const play = () => { if (credits < bet) { setStatus('Not enough credits for that bet.'); return; } setCredits(credits - bet); setActive(true); setStatus('Round live · cash out whenever it feels right'); setMultiplier(1.34 + (round % 4) * .27); setRound(round + 1); };
  const cashout = () => { const payout = Math.round(bet * multiplier); setCredits(credits + payout); setActive(false); setStatus(`Cashout complete · +${formatCredits(payout)}`); };
  return <div className="fade-up"><button onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-bold text-[#a99cab] hover:text-[#f5aa4e]" data-testid="button-back-lobby"><ArrowLeft size={15} /> Back to lobby</button><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2"><span className="rounded-full bg-[#f5aa4e]/10 px-2 py-1 mono text-[9px] uppercase tracking-widest text-[#f5aa4e]">Demo table</span><span className="text-xs text-[#746a80]">No cash value</span></div><h1 className="display text-4xl font-bold tracking-[-.04em] text-[#f3e9df]">{game.name}</h1></div><div className="glass flex items-center gap-2 rounded-xl px-4 py-2.5"><CircleDollarSign size={16} className="text-[#f5aa4e]" /><span className="mono text-sm text-[#e8d4bd]">{formatCredits(credits)}</span></div></div><div className="grid gap-5 lg:grid-cols-[1.65fr_.75fr]"><section className="relative min-h-[440px] overflow-hidden rounded-2xl border border-white/[.09] bg-[#1a1728]"><div className="absolute inset-0 opacity-60"><GameArt game={game} large /></div><div className="absolute inset-0 bg-gradient-to-t from-[#14111e] via-transparent to-[#14111e]/40" /><div className="relative flex h-full min-h-[440px] flex-col items-center justify-center p-8 text-center"><div className="mb-5 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/15 bg-white/[.08] shadow-2xl backdrop-blur-md"><Icon size={48} style={{ color: game.accent }} strokeWidth={1.15} /></div><div className={`display text-6xl font-bold tracking-[-.05em] ${active ? 'text-[#f5aa4e]' : 'text-[#f4e6dc]'}`} data-testid="text-game-multiplier">{active ? `${multiplier.toFixed(2)}x` : '—'}</div><p className="mt-3 text-xs text-[#c2afaf]" data-testid="status-game">{status}</p>{active && <div className="mt-5 h-1.5 w-48 overflow-hidden rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-[#f5aa4e]" /></div>}</div></section><aside className="glass rounded-2xl p-5"><div className="mb-5 flex items-center justify-between"><h2 className="display font-bold text-[#f0e1d8]">Place a bet</h2><span className="mono text-[9px] text-[#73697b]">ROUND {String(round + 1).padStart(3, '0')}</span></div><label className="mono text-[9px] uppercase tracking-[.15em] text-[#81758a]">Stake</label><div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/15 p-2"><button onClick={() => setBet(Math.max(10, bet - 10))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[.06] text-[#bcaebb]" data-testid="button-bet-minus"><Minus size={14} /></button><span className="mono flex-1 text-center text-sm text-[#ead7c5]">{formatCredits(bet)}</span><button onClick={() => setBet(Math.min(credits || 10, bet + 10))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[.06] text-[#bcaebb]" data-testid="button-bet-plus"><Plus size={14} /></button></div><div className="mt-3 grid grid-cols-4 gap-2">{[25, 50, 100, 250].map((value) => <button key={value} onClick={() => setBet(Math.min(credits || value, value))} className={`rounded-lg border py-2 text-[10px] font-bold ${bet === value ? 'border-[#f5aa4e] text-[#f5aa4e]' : 'border-white/10 text-[#867b8c]'}`} data-testid={`button-bet-preset-${value}`}>{value}</button>)}</div><button onClick={active ? cashout : play} className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-extrabold ${active ? 'bg-[#65c99a] text-[#15251f]' : 'btn-primary'}`} data-testid={active ? 'button-cashout' : 'button-place-bet'}>{active ? <><ArrowUpRight size={15} /> Cash out {formatCredits(Math.round(bet * multiplier))}</> : <><Play size={15} fill="currentColor" /> Place bet</>}</button><div className="mt-5 border-t border-white/[.07] pt-4"><div className="flex items-center justify-between text-[11px]"><span className="text-[#82788b]">Potential win</span><span className="mono text-[#c8b4a8]">{formatCredits(Math.round(bet * 2.4))}</span></div><div className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-[#6f6678]"><CircleHelp size={13} className="mt-0.5 shrink-0" /> Every result is simulated locally. Play responsibly, even in demo mode.</div></div></aside></div></div>;
}

function PageContent({ credits, setCredits, onClaim, claimed }: { credits: number; setCredits: (v: number) => void; onClaim: () => void; claimed: boolean }) {
  const [, setLocation] = useLocation();
  const params = useParams<{ slug?: string }>();
  const open = (slug: string) => setLocation(`/play/${slug}`);
  const path = window.location.pathname;
  if (path.startsWith('/play/')) return <PlayView slug={params.slug || 'crash'} credits={credits} setCredits={setCredits} onBack={() => setLocation('/')} />;
  if (path === '/games') return <GamesView onOpenGame={open} />;
  if (path === '/wallet') return <WalletView credits={credits} setCredits={setCredits} onClaim={onClaim} claimed={claimed} />;
  if (path === '/bonuses') return <BonusesView onClaim={onClaim} claimed={claimed} />;
  if (path === '/referrals') return <ReferralsView />;
  if (path === '/settings') return <SettingsView />;
  return <HomeView onOpenGame={open} onClaim={onClaim} claimed={claimed} />;
}

function Home() {
  const [credits, setCredits] = useState(1240);
  const [claimed, setClaimed] = useState(false);
  const [, setLocation] = useLocation();
  const claim = () => { if (!claimed) { setCredits((value) => value + 250); setClaimed(true); } };
  return <Shell credits={credits} onOpenWallet={() => setLocation('/wallet')}><PageContent credits={credits} setCredits={setCredits} onClaim={claim} claimed={claimed} /></Shell>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/games" component={Home} /><Route path="/wallet" component={Home} /><Route path="/bonuses" component={Home} /><Route path="/referrals" component={Home} /><Route path="/settings" component={Home} /><Route path="/play/:slug" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;