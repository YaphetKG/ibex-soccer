
import React, { useState, useEffect } from 'react';
import { ViewState, TeamEvent, HistoryItem } from './types';
import { HomeView, EventsView, RecruitView, TacticsView, KitGenView, ChantView, HistoryView, AdminView } from './components/Views';
import { fetchFromSheet } from './services/sheetService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Data State ---
  const [events, setEvents] = useState<TeamEvent[]>([
    { id: 1, title: 'League Match vs Durham Dynamo', date: '2023-11-15 15:00', location: 'WRAL Park', type: 'MATCH' },
    { id: 2, title: 'Goat Yoga Recovery', date: '2023-11-16 10:00', location: 'City Plaza', type: 'SOCIAL' },
  ]);

  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, title: "2023 CUP FINAL", description: "Ibex FC 2 - 1 Highlanders", year: "2023", type: "TROPHY", imageUrl: "🏆" },
    { id: 2, title: "SUNDAY LEAGUE", description: "Division 2 Champions", year: "2022", type: "TROPHY", imageUrl: "🥇" },
    { id: 3, title: "FIRST MATCH", description: "The squad assembles for the first time.", year: "2021", type: "MOMENT", imageUrl: "" },
  ]);

  // Load data from Sheets if configured
  const refreshData = async () => {
    setLoading(true);
    const remoteEvents = await fetchFromSheet('getEvents');
    if (remoteEvents) setEvents(remoteEvents);

    const remoteHistory = await fetchFromSheet('getHistory');
    if (remoteHistory) setHistory(remoteHistory);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAddEvent = (newEvent: TeamEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const NavItem = ({ view, label }: { view: ViewState; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMenuOpen(false);
      }}
      className={`font-header text-sm uppercase tracking-wider hover:text-retro-gold transition-colors ${
        currentView === view ? 'text-retro-gold underline decoration-4 decoration-retro-accent' : 'text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-retro-bg text-white flex flex-col crt relative selection:bg-retro-gold selection:text-black">
      {/* Scanline overlay fixed to screen */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>

      {/* Navigation */}
      <nav className="border-b-4 border-white bg-retro-navy sticky top-0 z-40 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView(ViewState.HOME)}
          >
            {/* Logo Placeholder / Icon */}
            <div className="w-10 h-10 relative">
               <div className="absolute inset-0 bg-retro-gold transform rotate-3 group-hover:rotate-6 transition-transform border-2 border-black"></div>
               <div className="absolute inset-0 bg-retro-accent transform -rotate-3 group-hover:-rotate-6 transition-transform border-2 border-white flex items-center justify-center">
                  <span className="font-header text-xs">I</span>
               </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-header text-lg md:text-xl text-white group-hover:text-retro-gold transition-colors">IBEX FC</span>
              <span className="font-body text-xs text-retro-gold tracking-widest">RALEIGH, NC</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 lg:gap-8">
            <NavItem view={ViewState.HOME} label="Home" />
            <NavItem view={ViewState.EVENTS} label="Fixtures" />
            <NavItem view={ViewState.HISTORY} label="History" />
            <NavItem view={ViewState.RECRUIT} label="Join" />
            <NavItem view={ViewState.TACTICS} label="Gaffer" />
            <NavItem view={ViewState.KIT_GEN} label="Kit Lab" />
            <NavItem view={ViewState.CHANTS} label="Ultras" />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white font-header" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? 'X' : 'MENU'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-retro-navy border-b-4 border-white p-4 flex flex-col gap-4 absolute w-full z-50 shadow-xl">
            <NavItem view={ViewState.HOME} label="Home" />
            <NavItem view={ViewState.EVENTS} label="Fixtures" />
            <NavItem view={ViewState.HISTORY} label="Club History" />
            <NavItem view={ViewState.RECRUIT} label="Join Us" />
            <NavItem view={ViewState.TACTICS} label="The Gaffer" />
            <NavItem view={ViewState.KIT_GEN} label="Kit Lab" />
            <NavItem view={ViewState.CHANTS} label="Ultras Songbook" />
            <div className="pt-4 border-t border-white/20">
               <NavItem view={ViewState.ADMIN} label="Admin Portal" />
            </div>
          </div>
        )}
      </nav>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-20 right-4 z-50">
          <div className="w-4 h-4 bg-retro-green animate-pulse"></div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-8 relative">
        {currentView === ViewState.HOME && <HomeView onNavigate={setCurrentView} />}
        {currentView === ViewState.EVENTS && <EventsView events={events} />}
        {currentView === ViewState.HISTORY && <HistoryView history={history} />}
        {currentView === ViewState.RECRUIT && <RecruitView />}
        {currentView === ViewState.TACTICS && <TacticsView />}
        {currentView === ViewState.KIT_GEN && <KitGenView />}
        {currentView === ViewState.CHANTS && <ChantView />}
        {currentView === ViewState.ADMIN && <AdminView onAddEvent={handleAddEvent} onRefresh={refreshData} />}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-white bg-retro-navy py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
             <p className="font-body text-xl text-retro-gold">
              © 2024 IBEX FOOTBALL CLUB • EST. RALEIGH
            </p>
             <button 
               onClick={() => setCurrentView(ViewState.ADMIN)}
               className="text-gray-600 hover:text-retro-accent font-header text-[10px] uppercase"
             >
               [ Staff Login ]
             </button>
          </div>
         
          <div className="flex justify-center gap-4 font-header text-xs text-white">
            <a href="#" className="hover:text-retro-gold">INSTAGRAM</a>
            <a href="#" className="hover:text-retro-gold">DISCORD</a>
            <a href="#" className="hover:text-retro-gold">LEAGUE TABLE</a>
          </div>
          <p className="mt-4 font-body text-sm text-gray-500">
            GOATS CLIMB HIGHER
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
