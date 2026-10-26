import React from 'react';
import { Mail, Sparkles, ShieldCheck, BookOpen, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  serverOnline: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  serverOnline,
  historyCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-inner shadow-blue-400/20 text-white ring-2 ring-blue-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  IA Mail Assist
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    Gemini 3.8 Flash
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Automatize sua comunicação com inteligência artificial
              </p>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-medium">
                {serverOnline ? 'Servidor Conectado' : 'Conectando...'}
              </span>
            </div>

            {/* Human in the loop badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Revisão Humana Ativa</span>
            </div>

            {/* History counter */}
            {historyCount > 0 && (
              <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-800/50 text-xs text-blue-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{historyCount} {historyCount === 1 ? 'e-mail na sessão' : 'e-mails na sessão'}</span>
              </div>
            )}

            {/* Guide & Docs Button */}
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-sm shadow-blue-900/30 active:scale-95"
              title="Abrir documentação acadêmica e instruções de configuração"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guia do Projeto</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
