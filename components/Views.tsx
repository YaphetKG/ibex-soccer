import React, { useState } from 'react';
import { RetroButton, RetroCard, LoadingSpinner } from './RetroUI';
import { TeamEvent, RecruitProfile, ScoutCard, ViewState } from '../types';
import { generateScoutCard, getTacticalAdvice, generateKit, generateChant } from '../services/geminiService';

// --- HOME VIEW ---
export const HomeView: React.FC<{ onNavigate: (view: ViewState) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in p-4">
      
      {/* Hero Section simulating the Logo */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-retro-navy blur-3xl opacity-50 rounded-full"></div>
        <div className="relative z-10 border-8 border-double border-retro-gold p-6 bg-retro-accent box-shadow-retro">
          <h1 className="font-header text-4xl md:text-7xl text-white text-shadow-retro leading-tight tracking-wider">
            IBEX FC
          </h1>
          <div className="w-full h-2 bg-retro-gold my-2"></div>
          <h2 className="font-header text-lg md:text-2xl text-retro-navy bg-white inline-block px-2">RALEIGH, NC</h2>
        </div>
      </div>

      <p className="font-body text-2xl text-retro-gold max-w-2xl tracking-wide">
        CLIMB HIGHER. PLAY HARDER. PIXELATED GLORY.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-8">
        <RetroCard title="NEXT MATCH" className="hover:bg-retro-navy/50 transition-colors cursor-pointer" onClick={() => onNavigate(ViewState.EVENTS)}>
          <p className="font-body text-2xl text-white">VS. DURHAM DYNAMO</p>
          <p className="font-body text-xl text-retro-gold">SATURDAY 15:00</p>
        </RetroCard>
        <RetroCard title="TEAM KIT" className="hover:bg-retro-navy/50 transition-colors cursor-pointer" onClick={() => onNavigate(ViewState.KIT_GEN)}>
          <p className="font-body text-2xl text-white">NEW SEASON DRIP</p>
          <p className="font-body text-xl text-retro-accent">DESIGN YOURS</p>
        </RetroCard>
      </div>

      <div className="mt-12 border-t-2 border-retro-gold/30 pt-8 w-full max-w-4xl">
        <h3 className="font-header text-sm text-retro-gold mb-6">/// CLUB HOUSE ///</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left font-body text-lg text-gray-400">
          <button onClick={() => onNavigate(ViewState.RECRUIT)} className="flex items-center gap-2 hover:text-white group">
            <span className="text-retro-green group-hover:text-retro-gold">✓</span> Join The Squad
          </button>
          <button onClick={() => onNavigate(ViewState.TACTICS)} className="flex items-center gap-2 hover:text-white group">
            <span className="text-retro-green group-hover:text-retro-gold">✓</span> Tactical Board
          </button>
          <button onClick={() => onNavigate(ViewState.CHANTS)} className="flex items-center gap-2 hover:text-white group">
            <span className="text-retro-green group-hover:text-retro-gold">✓</span> Ultras Songbook
          </button>
        </div>
      </div>
    </div>
  );
};

// --- EVENTS VIEW ---
export const EventsView: React.FC = () => {
  const [events] = useState<TeamEvent[]>([
    { id: 1, title: 'League Match vs Durham Dynamo', date: '2023-11-15 15:00', location: 'WRAL Park', type: 'MATCH' },
    { id: 2, title: 'Goat Yoga Recovery', date: '2023-11-16 10:00', location: 'City Plaza', type: 'SOCIAL' },
    { id: 3, title: 'Tactical Drill', date: '2023-11-17 19:00', location: 'Training Ground B', type: 'TRAINING' },
    { id: 4, title: 'Cup Semi-Final', date: '2023-11-25 15:00', location: 'WakeMed Park', type: 'MATCH' },
  ]);

  return (
    <div className="max-w-4xl mx-auto p-4 animate-slide-up">
      <h2 className="font-header text-3xl text-retro-gold mb-8 text-center text-shadow-retro">SEASON SCHEDULE</h2>
      <div className="space-y-6">
        {events.map(evt => (
          <div key={evt.id} className="relative group">
             <div className="absolute inset-0 bg-retro-navy translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
             <div className="relative bg-black border-2 border-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-left w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 font-header text-xs text-black ${evt.type === 'MATCH' ? 'bg-retro-gold' : evt.type === 'TRAINING' ? 'bg-retro-green' : 'bg-retro-accent'}`}>
                      {evt.type}
                    </span>
                    <span className="font-body text-xl text-gray-400">{evt.date}</span>
                  </div>
                  <h3 className="font-header text-xl text-white">{evt.title}</h3>
                  <p className="font-body text-lg text-retro-green mt-1">@{evt.location}</p>
                </div>
                <RetroButton variant="secondary">DETAILS</RetroButton>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- RECRUIT VIEW ---
export const RecruitView: React.FC = () => {
  const [step, setStep] = useState<'FORM' | 'LOADING' | 'RESULT'>('FORM');
  const [formData, setFormData] = useState<RecruitProfile>({
    name: '', position: 'Striker', favoritePlayer: '', experience: 'Sunday League'
  });
  const [scoutCard, setScoutCard] = useState<ScoutCard | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('LOADING');
    const card = await generateScoutCard(formData);
    setScoutCard(card);
    setStep('RESULT');
  };

  const reset = () => {
    setFormData({ name: '', position: 'Striker', favoritePlayer: '', experience: 'Sunday League' });
    setStep('FORM');
    setScoutCard(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-slide-up">
      <h2 className="font-header text-3xl text-retro-accent mb-8 text-center text-shadow-retro">JOIN THE HERD</h2>

      {step === 'FORM' && (
        <RetroCard title="PLAYER REGISTRATION">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-header text-xs text-retro-gold mb-2">PLAYER NAME</label>
              <input
                required
                type="text"
                className="w-full bg-retro-navy/50 border-b-2 border-retro-gold text-white font-body text-2xl p-2 focus:outline-none focus:bg-retro-navy"
                placeholder="ENTER NAME..."
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-header text-xs text-retro-green mb-2">POSITION</label>
              <select
                className="w-full bg-retro-navy/50 border-b-2 border-retro-green text-white font-body text-2xl p-2 focus:outline-none"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
              >
                <option>Striker</option>
                <option>Midfielder</option>
                <option>Defender</option>
                <option>Goalkeeper</option>
                <option>Wing Back</option>
              </select>
            </div>
            <div>
              <label className="block font-header text-xs text-retro-yellow mb-2">PLAYING STYLE (LIKE WHO?)</label>
              <input
                required
                type="text"
                className="w-full bg-retro-navy/50 border-b-2 border-retro-yellow text-white font-body text-2xl p-2 focus:outline-none focus:bg-retro-navy"
                placeholder="E.G. RONALDO, BUT OLDER"
                value={formData.favoritePlayer}
                onChange={e => setFormData({...formData, favoritePlayer: e.target.value})}
              />
            </div>
            <div>
               <label className="block font-header text-xs text-retro-accent mb-2">EXPERIENCE LEVEL</label>
               <input
                required
                type="text"
                className="w-full bg-retro-navy/50 border-b-2 border-retro-accent text-white font-body text-2xl p-2 focus:outline-none focus:bg-retro-navy"
                placeholder="E.G. HIGH SCHOOL VARSITY"
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
              />
            </div>
            <RetroButton type="submit" className="w-full mt-4">GENERATE SCOUT CARD</RetroButton>
          </form>
        </RetroCard>
      )}

      {step === 'LOADING' && <LoadingSpinner />}

      {step === 'RESULT' && scoutCard && (
        <div className="animate-scale-in">
           <RetroCard className="bg-retro-navy">
              <div className="border-4 border-double border-white p-4 mb-4 text-center bg-black">
                <h3 className="font-header text-2xl text-retro-gold mb-2">{scoutCard.nickname}</h3>
                <p className="font-body text-xl text-gray-400">{formData.name}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="font-header text-xs text-retro-gold mb-1">SPD</div>
                  <div className="font-header text-3xl text-white">{scoutCard.stats.speed}</div>
                </div>
                <div>
                  <div className="font-header text-xs text-retro-green mb-1">PWR</div>
                  <div className="font-header text-3xl text-white">{scoutCard.stats.power}</div>
                </div>
                <div>
                  <div className="font-header text-xs text-retro-accent mb-1">TEC</div>
                  <div className="font-header text-3xl text-white">{scoutCard.stats.technique}</div>
                </div>
              </div>

              <div className="bg-black/50 p-4 border border-gray-700 mb-6">
                <p className="font-body text-xl text-green-400 leading-relaxed">
                  "{scoutCard.description}"
                </p>
              </div>

              <div className="flex gap-4">
                <RetroButton onClick={reset} variant="secondary" className="flex-1">RESET</RetroButton>
                <RetroButton onClick={() => alert("Application Sent to the Coach!")} className="flex-1">CONFIRM JOIN</RetroButton>
              </div>
           </RetroCard>
        </div>
      )}
    </div>
  );
};

// --- TACTICS VIEW ---
export const TacticsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askCoach = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    const advice = await getTacticalAdvice(query);
    setResponse(advice);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-full flex flex-col animate-slide-up">
      <h2 className="font-header text-3xl text-white mb-2 text-center text-shadow-retro">THE GAFFER'S OFFICE</h2>
      <p className="text-center font-body text-gray-400 mb-8 text-xl">ASK FOR TACTICAL ADVICE. THE IBEX WAY.</p>
      
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-retro-navy border-4 border-white p-6 min-h-[200px] flex items-center justify-center relative overflow-hidden">
          {loading ? (
             <p className="font-header text-retro-gold animate-pulse">THE GAFFER IS THINKING...</p>
          ) : response ? (
             <div className="w-full animate-fade-in">
                <p className="font-header text-retro-green text-sm mb-2">COACH SAYS:</p>
                <p className="font-body text-3xl md:text-4xl text-white uppercase leading-none tracking-wide">
                  "{response}"
                </p>
             </div>
          ) : (
             <p className="font-body text-2xl text-gray-400">"GOT A QUESTION? SPEAK UP."</p>
          )}
          
          {/* Decorative scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
        </div>

        <div className="flex gap-2 mt-4">
           <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askCoach()}
            placeholder="E.G. HOW DO WE BREAK THE DEFENSE?"
            className="flex-1 bg-black border-2 border-retro-gold text-white font-body text-2xl p-4 focus:outline-none placeholder-gray-700"
           />
           <RetroButton onClick={askCoach} className="h-auto">ASK</RetroButton>
        </div>
      </div>
    </div>
  );
};

// --- KIT GEN VIEW ---
export const KitGenView: React.FC = () => {
  const [colors, setColors] = useState('Brick Red, Navy, Gold');
  const [style, setStyle] = useState('Stripes');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imgUrl = await generateKit(colors, style);
      setImage(imgUrl);
    } catch (e) {
      alert('Error generating kit. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-slide-up">
      <h2 className="font-header text-3xl text-retro-gold mb-8 text-center text-shadow-retro">IBEX KIT LAB</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <RetroCard title="DESIGN SPECS">
          <form onSubmit={handleGenerate} className="space-y-6">
             <div>
                <label className="block font-header text-xs text-retro-yellow mb-2">TEAM COLORS</label>
                <input 
                  required
                  type="text"
                  value={colors}
                  onChange={e => setColors(e.target.value)}
                  className="w-full bg-retro-navy/50 border-b-2 border-retro-yellow text-white font-body text-2xl p-2 focus:outline-none"
                  placeholder="E.G. RED AND GOLD"
                />
             </div>
             <div>
                <label className="block font-header text-xs text-retro-accent mb-2">PATTERN / STYLE</label>
                <select 
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  className="w-full bg-retro-navy/50 border-b-2 border-retro-accent text-white font-body text-2xl p-2 focus:outline-none"
                >
                  <option>Vertical Stripes</option>
                  <option>Hoops</option>
                  <option>Sash</option>
                  <option>Checkerboard</option>
                  <option>Mountain Peaks</option>
                </select>
             </div>
             <RetroButton type="submit" className="w-full" disabled={loading}>
               {loading ? 'STITCHING...' : 'GENERATE KIT'}
             </RetroButton>
          </form>
        </RetroCard>

        <div className="flex items-center justify-center min-h-[300px] bg-black border-4 border-white relative">
           {loading && <LoadingSpinner />}
           {!loading && !image && <p className="font-body text-gray-600">NO KIT DETECTED</p>}
           {!loading && image && (
             <img src={image} alt="Generated Kit" className="w-full h-full object-contain animate-scale-in p-4" />
           )}
           {/* Scanline overlay */}
           <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/20 bg-[length:100%_4px]"></div>
        </div>
      </div>
    </div>
  );
};

// --- CHANT VIEW ---
export const ChantView: React.FC = () => {
  const [opponent, setOpponent] = useState('');
  const [chant, setChant] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChant = async () => {
    if (!opponent) return;
    setLoading(true);
    setChant(await generateChant(opponent));
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-center animate-slide-up">
      <h2 className="font-header text-3xl text-retro-gold mb-8 text-shadow-retro">IBEX ULTRAS</h2>
      
      <div className="flex flex-col gap-4 mb-8">
        <input 
          type="text"
          placeholder="WHO ARE WE PLAYING?"
          className="bg-black border-2 border-retro-green text-white font-body text-3xl p-4 text-center focus:outline-none uppercase placeholder-gray-700"
          value={opponent}
          onChange={e => setOpponent(e.target.value)}
        />
        <RetroButton onClick={handleChant} disabled={loading || !opponent}>
          {loading ? 'COMPOSING...' : 'GENERATE CHANT'}
        </RetroButton>
      </div>

      {chant && (
        <div className="bg-white text-black p-8 border-4 border-retro-accent transform -rotate-1 animate-scale-in box-shadow-retro">
          <p className="font-header text-xl leading-relaxed whitespace-pre-line">
            {chant}
          </p>
        </div>
      )}
    </div>
  );
};