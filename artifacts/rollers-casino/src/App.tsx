import { useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  BadgeDollarSign,
  Bot,
  Check,
  ChevronRight,
  CircleHelp,
  Gift,
  Grid2X2,
  Heart,
  Languages,
  Menu,
  MoreVertical,
  Pencil,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';

type Screen = 'menu' | 'games' | 'game' | 'deposit' | 'gifts' | 'gift-detail' | 'bonus' | 'settings';

type Game = {
  name: string;
  description: string;
  Icon: typeof Trophy;
  tone: string;
};

const giftId = '5334887566804016544';
const giftReceiver = '@RCmoney98';

const games: Game[] = [
  { name: 'Crash', description: 'Cash out before the curve breaks.', Icon: Zap, tone: 'coral' },
  { name: 'Monkey Tower', description: 'Pick a tile and climb higher.', Icon: Trophy, tone: 'violet' },
  { name: 'Fishing', description: 'Cast your line for a catch.', Icon: Sparkles, tone: 'teal' },
  { name: 'Pachinko', description: 'Let gravity choose the route.', Icon: Grid2X2, tone: 'gold' },
  { name: 'Money Wheel', description: 'One spin, many possibilities.', Icon: CircleHelp, tone: 'pink' },
  { name: 'Blackjack', description: 'Beat the dealer with a cool hand.', Icon: BadgeDollarSign, tone: 'green' },
];

function formatCredits(value: number) {
  return `${value.toLocaleString('en-US')} credits`;
}

function InlineButton({
  children,
  onClick,
  tone = 'default',
  wide = false,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: 'default' | 'primary' | 'danger';
  wide?: boolean;
  disabled?: boolean;
}) {
  return (
    <button className={`inline-button inline-button-${tone} ${wide ? 'inline-button-wide' : ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function BotBubble({ children, time = 'now' }: { children: ReactNode; time?: string }) {
  return (
    <div className="bubble-row bubble-row-bot">
      <div className="bot-mini-avatar"><Bot size={16} /></div>
      <div className="bot-bubble">
        <div>{children}</div>
        <span className="bubble-time">{time}</span>
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="bubble-row bubble-row-user">
      <div className="user-bubble">
        <div>{children}</div>
        <span className="bubble-time">now</span>
      </div>
    </div>
  );
}

function ChatHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="chat-header">
      <button className="header-icon" onClick={onMenu} aria-label="Open bot menu"><Menu size={20} /></button>
      <div className="bot-avatar"><Bot size={22} /></div>
      <div className="chat-title">
        <strong>Rollers Casino</strong>
        <span>bot</span>
      </div>
      <button className="header-icon" aria-label="Bot options"><MoreVertical size={20} /></button>
    </header>
  );
}

function ChatKeyboard({ children }: { children: ReactNode }) {
  return <div className="chat-keyboard">{children}</div>;
}

function MenuScreen({
  credits,
  onSelect,
}: {
  credits: number;
  onSelect: (screen: Screen) => void;
}) {
  return (
    <>
      <BotBubble time="09:42">
        <p className="message-kicker">Welcome back</p>
        <h1>Rollers Casino</h1>
        <p className="message-copy">30+ games, fast rounds, and a smooth Telegram-first experience.</p>
        <div className="balance-line"><WalletCards size={16} /><span>Balance</span><strong>{formatCredits(credits)}</strong></div>
      </BotBubble>
      <BotBubble>
        <p className="message-copy">Choose an option below to get started.</p>
      </BotBubble>
      <ChatKeyboard>
        <InlineButton onClick={() => onSelect('games')} tone="primary" wide><Grid2X2 size={16} /> Games</InlineButton>
        <InlineButton onClick={() => onSelect('deposit')} tone="primary" wide><Gift size={16} /> Deposit</InlineButton>
        <div className="keyboard-grid">
          <InlineButton onClick={() => onSelect('bonus')}><Sparkles size={15} /> Bonus</InlineButton>
          <InlineButton onClick={() => onSelect('settings')}><Settings size={15} /> Settings</InlineButton>
        </div>
      </ChatKeyboard>
    </>
  );
}

function GamesScreen({ onBack, onGame }: { onBack: () => void; onGame: (game: Game) => void }) {
  return (
    <>
      <UserBubble>Games</UserBubble>
      <BotBubble>
        <p className="message-kicker">Game lobby</p>
        <h2>Pick a game</h2>
        <p className="message-copy">Tap a table to open a demo round. Credits have no cash value.</p>
      </BotBubble>
      <ChatKeyboard>
        {games.map((game) => {
          const Icon = game.Icon;
          return (
            <button key={game.name} className="game-inline-button" onClick={() => onGame(game)}>
              <span className={`game-icon game-icon-${game.tone}`}><Icon size={16} /></span>
              <span><strong>{game.name}</strong><small>{game.description}</small></span>
              <ChevronRight size={15} />
            </button>
          );
        })}
        <InlineButton onClick={onBack}><ArrowLeft size={15} /> Back</InlineButton>
      </ChatKeyboard>
    </>
  );
}

function GameScreen({ game, credits, setCredits, onBack }: { game: Game; credits: number; setCredits: (value: number) => void; onBack: () => void }) {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState('Ready when you are.');
  const [bet, setBet] = useState(50);
  const Icon = game.Icon;

  const placeBet = () => {
    if (credits < bet) {
      setMessage('Not enough credits for that round.');
      return;
    }
    setCredits(credits - bet);
    setActive(true);
    setMessage('Round live. Cash out whenever it feels right.');
  };

  const cashOut = () => {
    const payout = Math.round(bet * 1.72);
    setCredits(credits + payout);
    setActive(false);
    setMessage(`Cashout complete: +${formatCredits(payout)}.`);
  };

  return (
    <>
      <UserBubble>{game.name}</UserBubble>
      <BotBubble>
        <div className="game-message-head">
          <span className={`game-icon game-icon-${game.tone}`}><Icon size={18} /></span>
          <div><p className="message-kicker">Demo table</p><h2>{game.name}</h2></div>
        </div>
        <div className={`game-stage game-stage-${game.tone}`}>
          <span className={active ? 'multiplier-live' : ''}>{active ? '1.72x' : '—'}</span>
          <small>{message}</small>
        </div>
        <div className="stake-row">
          <button onClick={() => setBet(Math.max(10, bet - 10))}>−</button>
          <span>{formatCredits(bet)}</span>
          <button onClick={() => setBet(Math.min(Math.max(10, credits), bet + 10))}>+</button>
        </div>
      </BotBubble>
      <ChatKeyboard>
        <InlineButton onClick={active ? cashOut : placeBet} tone={active ? 'primary' : 'primary'} wide>
          {active ? <><BadgeDollarSign size={16} /> Cash out {formatCredits(Math.round(bet * 1.72))}</> : <><Zap size={16} /> Place demo bet</>}
        </InlineButton>
        <InlineButton onClick={onBack}><ArrowLeft size={15} /> Back to games</InlineButton>
      </ChatKeyboard>
    </>
  );
}

function DepositScreen({ onBack, onGifts }: { onBack: () => void; onGifts: () => void }) {
  return (
    <>
      <UserBubble>Deposit</UserBubble>
      <BotBubble>
        <p className="message-kicker">Add balance</p>
        <h2>Choose a deposit method</h2>
        <p className="message-copy">Top up through Telegram Gifts. INR deposits have been removed.</p>
      </BotBubble>
      <ChatKeyboard>
        <button
          className="inline-button inline-button-primary inline-button-wide gift-heart-button"
          onClick={onGifts}
          data-telegram-custom-emoji-id="5298801741209299033"
        >
          <Heart size={16} fill="currentColor" /> Telegram Gifts
        </button>
        <InlineButton onClick={onBack}><ArrowLeft size={15} /> Back</InlineButton>
      </ChatKeyboard>
    </>
  );
}

function GiftListScreen({ onBack, onSelect }: { onBack: () => void; onSelect: () => void }) {
  return (
    <>
      <UserBubble>Telegram Gifts</UserBubble>
      <BotBubble>
        <p className="message-kicker">Gift deposits</p>
        <h2>Choose a gift</h2>
        <p className="message-copy">Send an eligible Telegram gift to the receiving account below.</p>
      </BotBubble>
      <ChatKeyboard>
        <button className="gift-inline-button" onClick={onSelect}>
          <span className="gift-art"><Gift size={25} /></span>
          <span><strong>Plus Meme</strong><small>$3.00 · Gift ID {giftId}</small></span>
          <ChevronRight size={16} />
        </button>
        <InlineButton onClick={onBack}><ArrowLeft size={15} /> Back</InlineButton>
      </ChatKeyboard>
    </>
  );
}

function GiftDetailScreen({ onBack }: { onBack: () => void }) {
  return (
    <>
      <UserBubble>Plus Meme</UserBubble>
      <BotBubble time="09:44">
        <div className="gift-detail-title"><Gift size={21} /><span>Balance topped up with NFT gifts</span></div>
        <p className="gift-price"><span>Plus Meme</span> — <strong>$3.00</strong></p>
        <div className="instruction-line"><Send size={17} /><p>Send the gift to user <strong className="mention">{giftReceiver}</strong>, and the balance will be topped up automatically</p></div>
        <div className="restriction-note"><ShieldCheck size={19} /><p>If the NFT gift has a transfer restriction, the top-up will be credited only after the hold is lifted.</p></div>
        <p className="gift-id">Telegram gift ID: {giftId}</p>
      </BotBubble>
      <ChatKeyboard>
        <InlineButton onClick={onBack} wide><ArrowLeft size={15} /> Back</InlineButton>
      </ChatKeyboard>
    </>
  );
}

function BonusScreen({ onBack, claimed, onClaim }: { onBack: () => void; claimed: boolean; onClaim: () => void }) {
  return (
    <>
      <UserBubble>Bonus</UserBubble>
      <BotBubble>
        <p className="message-kicker">Daily reward</p>
        <h2>{claimed ? 'Bonus already claimed' : 'Your daily bonus is ready'}</h2>
        <p className="message-copy">{claimed ? 'Come back tomorrow for another drop.' : 'Claim 250 demo credits and keep your streak alive.'}</p>
      </BotBubble>
      <ChatKeyboard>
        <InlineButton onClick={onClaim} tone="primary" wide disabled={claimed}><Sparkles size={16} /> {claimed ? 'Claimed today' : 'Claim +250 credits'}</InlineButton>
        <InlineButton onClick={onBack}><ArrowLeft size={15} /> Back</InlineButton>
      </ChatKeyboard>
    </>
  );
}

function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [language, setLanguage] = useState('English');
  const [sound, setSound] = useState(true);
  return (
    <>
      <UserBubble>Settings</UserBubble>
      <BotBubble>
        <p className="message-kicker">Preferences</p>
        <h2>Settings</h2>
        <p className="message-copy">Configure how Rollers Casino behaves in this chat.</p>
      </BotBubble>
      <ChatKeyboard>
        <label className="setting-inline-button"><Languages size={16} /><span>Language</span><select value={language} onChange={(event) => setLanguage(event.target.value)}><option>English</option><option>Español</option><option>Français</option></select></label>
        <button className="setting-inline-button" onClick={() => setSound(!sound)}><Zap size={16} /><span>Sound effects</span><strong>{sound ? 'On' : 'Off'}</strong></button>
        <div className="demo-disclosure"><ShieldCheck size={15} /> Local demo mode · no real payments or withdrawals</div>
        <InlineButton onClick={onBack}><ArrowLeft size={15} /> Back</InlineButton>
      </ChatKeyboard>
    </>
  );
}

function BotApp() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedGame, setSelectedGame] = useState<Game>(games[0]);
  const [credits, setCredits] = useState(1240);
  const [claimed, setClaimed] = useState(false);

  const claim = () => {
    if (!claimed) {
      setCredits((current) => current + 250);
      setClaimed(true);
    }
  };

  const renderScreen = () => {
    if (screen === 'games') return <GamesScreen onBack={() => setScreen('menu')} onGame={(game) => { setSelectedGame(game); setScreen('game'); }} />;
    if (screen === 'game') return <GameScreen game={selectedGame} credits={credits} setCredits={setCredits} onBack={() => setScreen('games')} />;
    if (screen === 'deposit') return <DepositScreen onBack={() => setScreen('menu')} onGifts={() => setScreen('gifts')} />;
    if (screen === 'gifts') return <GiftListScreen onBack={() => setScreen('deposit')} onSelect={() => setScreen('gift-detail')} />;
    if (screen === 'gift-detail') return <GiftDetailScreen onBack={() => setScreen('gifts')} />;
    if (screen === 'bonus') return <BonusScreen onBack={() => setScreen('menu')} claimed={claimed} onClaim={claim} />;
    if (screen === 'settings') return <SettingsScreen onBack={() => setScreen('menu')} />;
    return <MenuScreen credits={credits} onSelect={setScreen} />;
  };

  return (
    <div className="telegram-page">
      <div className="telegram-shell">
        <ChatHeader onMenu={() => setScreen('menu')} />
        <main className="chat-scroll">
          <div className="chat-date">Today</div>
          {screen === 'menu' && <div className="bot-status-strip"><span className="status-dot" /> Demo session · private chat</div>}
          {renderScreen()}
        </main>
        <footer className="chat-composer">
          <button className="composer-icon" aria-label="Add attachment"><Pencil size={18} /></button>
          <div className="composer-input">Message Rollers Casino</div>
          <button className="composer-send" onClick={() => setScreen('menu')} aria-label="Send"><Send size={17} /></button>
        </footer>
      </div>
      <div className="telegram-side-note"><Bot size={16} /> Telegram bot interface · local demo</div>
    </div>
  );
}

export default function App() {
  return <BotApp />;
}