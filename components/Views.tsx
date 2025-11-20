
import React, { useState, useEffect } from 'react';
import { RetroButton, RetroCard, LoadingSpinner } from './RetroUI';
import { TeamEvent, RecruitProfile, ScoutCard, ViewState, HistoryItem, SquadMember } from '../types';
import { generateScoutCard, getTacticalAdvice, generateKit, generateChant } from '../services/geminiService';
import { addEvent, addHistoryItem, addRecruit, subscribeToRecruits, approveRecruit, subscribeToSquad } from '../services/firebase';

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
          <button onClick={() => onNavigate(ViewState.HISTORY)} className="flex items-center gap-2 hover:text-white group">
            <span className="text-retro-green group-hover:text-retro-gold">✓</span> Club History
          </button>
        </div>
      </div>
    </div>
  );
};

// --- EVENTS VIEW ---
export const EventsView: React.FC<{ events: TeamEvent[] }> = ({ events }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 animate-slide-up">
      <h2 className="font-header text-3xl text-retro-gold mb-8 text-center text-shadow-retro">SEASON SCHEDULE</h2>
      <div className="space-y-6">
        {events.length === 0 && (
          <p className="text-center font-body text-2xl text-gray-500">NO FIXTURES SCHEDULED. THE GAFFER IS SLEEPING.</p>
        )}
        {events.map(evt => (
          <div key={evt.id} className="relative group">
             <div className="absolute inset-0 bg-retro-navy translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
             <div className="relative bg-black border-2 border-white p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-left w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 font-header text-xs text-black ${evt.type === 'MATCH' ? 'bg-retro-gold' : evt.type === 'TRAINING' ? 'bg-retro-green' : 'bg-retro-accent'}`}>
                      {evt.type}
                    </span>
                    <span className="font-body text-xl text-gray-400">{evt.date.replace('T', ' ')}</span>
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

// --- HISTORY VIEW ---
export const HistoryView: React.FC<{ history: HistoryItem[] }> = ({ history }) => {
  const trophies = history.filter(h => h.type === 'TROPHY');
  const moments = history.filter(h => h.type === 'MOMENT');

  return (
    <div className="max-w-5xl mx-auto p-4 animate-slide-up">
       <h2 className="font-header text-3xl text-retro-gold mb-12 text-center text-shadow-retro">CLUB ARCHIVES</h2>

       {/* Section 1: The Trophy Case */}
       <div className="mb-16">
         <h3 className="font-header text-xl text-retro-accent mb-6 border-b border-retro-accent pb-2 inline-block">HONOR ROLL</h3>
         {trophies.length === 0 ? <p className="font-body text-gray-500">NO SILVERWARE YET.</p> : (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trophies.map((item) => (
                 <div key={item.id} className="bg-retro-navy p-6 border-4 border-double border-retro-gold text-center hover:-translate-y-2 transition-transform">
                    <div className="text-5xl mb-4">
                      {item.imageUrl && item.imageUrl.startsWith('http') ? (
                         <img src={item.imageUrl} alt={item.title} className="w-20 h-20 mx-auto object-contain" />
                      ) : (
                        '🏆'
                      )}
                    </div>
                    <h4 className="font-header text-white text-sm mb-2">{item.title}</h4>
                    <p className="font-body text-gray-400 text-xl">{item.description}</p>
                    <span className="inline-block mt-2 px-2 bg-retro-gold text-black font-header text-[10px]">{item.year}</span>
                 </div>
              ))}
           </div>
         )}
       </div>

       {/* Section 2: Scrapbook Gallery */}
       <div>
         <h3 className="font-header text-xl text-retro-green mb-8 border-b border-retro-green pb-2 inline-block">THE SCRAPBOOK</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {moments.length === 0 && <p className="font-body text-gray-500">NO MEMORIES LOGGED.</p>}
            {moments.map((item, idx) => {
              const rotateClass = idx % 3 === 0 ? 'rotate-2' : idx % 3 === 1 ? '-rotate-3' : 'rotate-1';
              return (
                <div key={item.id} className={`bg-white p-3 shadow-lg transform ${rotateClass} hover:rotate-0 transition-transform duration-300 w-full`}>
                  <div className="bg-gray-800 h-48 w-full flex items-center justify-center overflow-hidden relative group">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                      ) : (
                         <>
                          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%,transparent),radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%,transparent)] bg-[length:8px_8px] bg-[position:0_0,4px_4px] opacity-20"></div>
                          <span className="font-header text-white opacity-50 text-5xl">{idx + 1}</span>
                         </>
                      )}
                  </div>
                  <div className="mt-3">
                    <div className="font-body text-black text-xl text-center uppercase leading-none">{item.title}</div>
                    <div className="font-body text-gray-500 text-sm text-center">{item.year}</div>
                    <p className="font-body text-black mt-2 text-sm leading-tight border-t border-gray-300 pt-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
         </div>
       </div>
    </div>
  );
};

// --- ADMIN VIEW ---
export const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'SQUAD' | 'HISTORY'>('EVENTS');

  // Logic for Events
  const [eventForm, setEventForm] = useState({ title: '', date: '', location: '', type: 'MATCH' as const });
  
  // Logic for History
  const [historyForm, setHistoryForm] = useState({ title: '', description: '', year: new Date().getFullYear().toString(), type: 'MOMENT' as const, imageUrl: '' });

  // Logic for Recruits/Squad
  const [recruits, setRecruits] = useState<RecruitProfile[]>([]);
  const [squad, setSquad] = useState<SquadMember[]>([]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'SQUAD') {
      const unsubRecruits = subscribeToRecruits(setRecruits);
      const unsubSquad = subscribeToSquad(setSquad);
      return () => { unsubRecruits(); unsubSquad(); };
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin.toUpperCase() === 'IBEX') {
      setIsAuthenticated(true);
    } else {
      alert('INVALID ACCESS CODE');
      setPin('');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEvent(eventForm);
      alert('EVENT ADDED TO FIREBASE');
      setEventForm({ title: '', date: '', location: '', type: 'MATCH' });
    } catch (err) {
      alert('ERROR: CHECK CONSOLE OR FIREBASE CONFIG');
    }
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addHistoryItem(historyForm);
      alert('HISTORY ITEM ARCHIVED');
      setHistoryForm({ title: '', description: '', year: new Date().getFullYear().toString(), type: 'MOMENT', imageUrl: '' });
    } catch (err) {
      alert('ERROR SAVING HISTORY');
    }
  };

  const handleApproveRecruit = async (r: RecruitProfile) => {
    if (!r.id) return;
    const confirm = window.confirm(`Promote ${r.name} to the official squad?`);
    if (confirm) {
      await approveRecruit(r.id, r);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[60vh] animate-fade-in">
         <div className="bg-black border-4 border-red-600 p-8 max-w-md w-full text-center box-shadow-retro">
            <h2 className="font-header text-red-600 text-2xl mb-6 blink">RESTRICTED ACCESS</h2>
            <p className="font-body text-gray-400 mb-6 text-xl">ENTER STAFF ACCESS CODE</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                className="w-full bg-gray-900 border border-red-800 text-red-500 font-header text-center p-4 tracking-[1em] text-xl focus:outline-none"
                value={pin}
                onChange={e => setPin(e.target.value)}
                maxLength={4}
                placeholder="____"
                autoFocus
              />
              <RetroButton variant="danger" type="submit" className="w-full">AUTHENTICATE</RetroButton>
            </form>
            <p className="mt-4 text-[10px] text-gray-600 font-mono">
              NOTE: Configure Firebase in services/firebase.ts
            </p>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-slide-up">
      <div className="flex justify-between items-end mb-6 border-b-2 border-white pb-4">
         <div>
            <h2 className="font-header text-3xl text-white">ADMIN CONSOLE</h2>
            <p className="font-body text-green-500">FIREBASE: CONNECTED</p>
         </div>
         <button onClick={() => setIsAuthenticated(false)} className="font-header text-xs text-red-500 hover:text-red-400">[ LOGOUT ]</button>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-4 mb-8">
        {['EVENTS', 'SQUAD', 'HISTORY'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`font-header text-xs px-4 py-2 border-2 ${activeTab === tab ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-gray-700 hover:border-gray-400'}`}
          >
            {tab} MANAGER
          </button>
        ))}
      </div>

      {activeTab === 'EVENTS' && (
        <RetroCard title="ADD NEW FIXTURE">
           <form onSubmit={handleAddEvent} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label className="block font-header text-xs text-gray-400 mb-2">EVENT TITLE</label>
                   <input
                    required
                    type="text"
                    value={eventForm.title}
                    onChange={e => setEventForm({...eventForm, title: e.target.value})}
                    className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none"
                    placeholder="VS. TEAM NAME"
                   />
                 </div>
                 <div>
                   <label className="block font-header text-xs text-gray-400 mb-2">DATE & TIME</label>
                   <input
                    required
                    type="datetime-local"
                    value={eventForm.date}
                    onChange={e => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none"
                   />
                 </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label className="block font-header text-xs text-gray-400 mb-2">LOCATION</label>
                   <input
                    required
                    type="text"
                    value={eventForm.location}
                    onChange={e => setEventForm({...eventForm, location: e.target.value})}
                    className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none"
                    placeholder="FIELD NAME"
                   />
                 </div>
                 <div>
                   <label className="block font-header text-xs text-gray-400 mb-2">EVENT TYPE</label>
                   <select
                    value={eventForm.type}
                    onChange={e => setEventForm({...eventForm, type: e.target.value as any})}
                    className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none"
                   >
                     <option value="MATCH">LEAGUE MATCH</option>
                     <option value="TRAINING">TRAINING SESSION</option>
                     <option value="SOCIAL">SOCIAL EVENT</option>
                   </select>
                 </div>
              </div>
              <RetroButton type="submit" className="w-full mt-4">PUBLISH EVENT</RetroButton>
           </form>
        </RetroCard>
      )}

      {activeTab === 'HISTORY' && (
        <RetroCard title="ARCHIVE A MOMENT">
           <form onSubmit={handleAddHistory} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <label className="block font-header text-xs text-gray-400 mb-2">TITLE</label>
                   <input required type="text" value={historyForm.title} onChange={e => setHistoryForm({...historyForm, title: e.target.value})} className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none" />
                 </div>
                 <div>
                   <label className="block font-header text-xs text-gray-400 mb-2">YEAR</label>
                   <input required type="text" value={historyForm.year} onChange={e => setHistoryForm({...historyForm, year: e.target.value})} className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none" />
                 </div>
              </div>
              <div>
                <label className="block font-header text-xs text-gray-400 mb-2">IMAGE URL (OPTIONAL)</label>
                <input type="text" value={historyForm.imageUrl} onChange={e => setHistoryForm({...historyForm, imageUrl: e.target.value})} className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none" placeholder="https://..." />
              </div>
              <div>
                 <label className="block font-header text-xs text-gray-400 mb-2">TYPE</label>
                 <select value={historyForm.type} onChange={e => setHistoryForm({...historyForm, type: e.target.value as any})} className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none">
                    <option value="MOMENT">MEMORABLE MOMENT</option>
                    <option value="TROPHY">TROPHY / AWARD</option>
                 </select>
              </div>
              <div>
                 <label className="block font-header text-xs text-gray-400 mb-2">DESCRIPTION</label>
                 <textarea required rows={3} value={historyForm.description} onChange={e => setHistoryForm({...historyForm, description: e.target.value})} className="w-full bg-retro-navy/50 border-b-2 border-white text-white font-body text-xl p-2 focus:outline-none"></textarea>
              </div>
              <RetroButton type="submit" className="w-full mt-4">ARCHIVE ITEM</RetroButton>
           </form>
        </RetroCard>
      )}

      {activeTab === 'SQUAD' && (
        <div className="space-y-8">
           {/* Recruits Section */}
           <div>
             <h3 className="font-header text-xl text-retro-yellow mb-4">PENDING APPLICATIONS ({recruits.filter(r => r.status === 'PENDING').length})</h3>
             <div className="grid gap-4">
                {recruits.filter(r => r.status === 'PENDING').length === 0 && <p className="font-body text-gray-500">NO NEW APPLICATIONS.</p>}
                {recruits.filter(r => r.status === 'PENDING').map(r => (
                   <div key={r.id} className="bg-gray-900 border border-gray-700 p-4 flex justify-between items-center">
                      <div>
                        <p className="font-header text-white">{r.name}</p>
                        <p className="font-body text-gray-400">{r.position} | Exp: {r.experience}</p>
                      </div>
                      <RetroButton onClick={() => handleApproveRecruit(r)} variant="secondary" className="text-[10px] py-2">APPROVE</RetroButton>
                   </div>
                ))}
             </div>
           </div>

           {/* Active Squad Section */}
           <div>
             <h3 className="font-header text-xl text-retro-green mb-4">ACTIVE SQUAD ({squad.length})</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {squad.map(player => (
                   <div key={player.id} className="bg-retro-navy border border-retro-green p-4 text-center">
                      <p className="font-header text-2xl text-white mb-1">{player.number}</p>
                      <p className="font-body text-lg text-retro-gold uppercase">{player.name}</p>
                      <p className="font-header text-[10px] text-gray-400">{player.position}</p>
                   </div>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- RECRUIT VIEW ---
export const RecruitView: React.FC = () => {
  const [step, setStep] = useState<'FORM' | 'LOADING' | 'RESULT'>('FORM');
  const [formData, setFormData] = useState<RecruitProfile>({
    name: '', position: 'Striker', favoritePlayer: '', experience: 'Sunday League', status: 'PENDING', submittedAt: ''
  });
  const [scoutCard, setScoutCard] = useState<ScoutCard | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('LOADING');
    
    // 1. Generate the fun AI card
    const card = await generateScoutCard(formData);
    setScoutCard(card);

    // 2. Save to Firebase
    try {
      await addRecruit({
        name: formData.name,
        position: formData.position,
        favoritePlayer: formData.favoritePlayer,
        experience: formData.experience
      });
    } catch (e) {
      console.error("Could not save recruit to DB", e);
    }

    setStep('RESULT');
  };

  const reset = () => {
    setFormData({ name: '', position: 'Striker', favoritePlayer: '', experience: 'Sunday League', status: 'PENDING', submittedAt: '' });
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
              
              <div className="bg-green-900/30 border border-green-500 p-2 mb-4 text-center">
                 <p className="font-header text-xs text-green-400">APPLICATION SAVED TO DATABASE</p>
              </div>

              <div className="flex gap-4">
                <RetroButton onClick={reset} variant="secondary" className="flex-1">RESET / NEW</RetroButton>
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
