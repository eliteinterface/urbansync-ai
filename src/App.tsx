import { useState } from 'react';
import CinematicIntro from './components/CinematicIntro';
import HeroSection from './components/HeroSection';
import DashboardView from './components/modules/DashboardView';
import RoutesView from './components/modules/RoutesView';
import CitizenView from './components/modules/CitizenView';

const App = () => {
  const [introComplete, setIntroComplete] = useState(
    typeof window !== 'undefined' && sessionStorage.getItem('intro_seen') === 'true'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Cinematic Intro — plays once per session */}
      {!introComplete && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}

      {/* Hero — impact numbers */}
      <HeroSection />

      {/* Section 1: Municipal Dashboard */}
      <DashboardView />

      {/* Divider */}
      <div className="mx-auto h-px max-w-lg bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* Section 2: Route Optimization Map */}
      <RoutesView />

      {/* Divider */}
      <div className="mx-auto h-px max-w-lg bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* Section 3: Citizen Experience */}
      <CitizenView />

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-xs text-slate-600">
          UrbanSync AI © 2026 — Candidato Agencia I+D+i (TAD)
        </p>
        <p className="mt-1 text-[10px] text-slate-700">
          Demo de concepto · Datos simulados · No representa un producto en producción
        </p>
      </footer>
    </div>
  );
};

export default App;
