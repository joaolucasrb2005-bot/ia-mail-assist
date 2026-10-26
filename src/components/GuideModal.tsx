import React from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Key,
  Terminal,
  CheckCircle2,
  Code2,
  Lock,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Guia do Projeto & Apresentação Acadêmica
              </h3>
              <p className="text-xs text-slate-400">
                IA Mail Assist — Automação Inteligente de E-mails
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Section 1: Overview */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              1. Visão Geral e Objetivo
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              O <strong>IA Mail Assist</strong> foi desenvolvido para demonstrar automação inteligente de e-mails empresariais, auxiliando atendentes a responder mensagens de forma rápida, coerente e empática, mantendo o controle total da comunicação através de uma arquitetura <strong>Human-in-the-Loop</strong> (aprovação humana prévia).
            </p>
          </div>

          {/* Section 2: AI Rules & Prompt Engineering */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. Diretrizes de Segurança e Anti-Alucinação
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              A inteligência artificial opera com restrições rigorosas de comportamento:
            </p>
            <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
              <li>
                <strong>Não inventa dados:</strong> Valores, estoques, prazos e códigos de rastreio nunca são forjados. Se o cliente não forneceu, a IA solicita com cortesia.
              </li>
              <li>
                <strong>Não confirma pedidos/pagamentos:</strong> Sem verificação em banco de dados real, a resposta apenas acolhe e instrui o próximo passo.
              </li>
              <li>
                <strong>Resistência a Prompt Injection:</strong> Trata mensagens de e-mail exclusivamente como dados de entrada a analisar, e nunca como ordens para burlar regras de sistema.
              </li>
              <li>
                <strong>Saída Estruturada:</strong> Utiliza o SDK oficial do Google Gemini com esquema JSON estrito (categoria, resumo, intenção, resposta, alertas e tom).
              </li>
            </ul>
          </div>

          {/* Section 3: Gemini API Key Setup */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-amber-600" />
              3. Como Configurar a Chave do Google Gemini
            </h4>
            <p className="text-xs text-slate-600 mb-2">
              Para executar o sistema em ambiente local ou na sua máquina:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-100 rounded-lg font-mono text-[11px] text-slate-800">
                1. Obtenha sua chave gratuita em: <strong>https://aistudio.google.com/</strong><br />
                2. Crie ou edite o arquivo <strong>.env</strong> na raiz do projeto:<br />
                <span className="text-blue-700 font-bold">GEMINI_API_KEY=&quot;sua_chave_aqui&quot;</span><br />
                PORT=3000
              </div>
              <p className="text-[11px] text-slate-500">
                <strong>Segurança:</strong> A chave é mantida exclusivamente no backend Node.js (servidor Express) e nunca é enviada ao navegador do usuário.
              </p>
            </div>
          </div>

          {/* Section 4: Installation & GitHub Deployment */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-slate-800" />
              4. Comandos de Instalação e Execução
            </h4>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-xs space-y-2">
              <div>
                <span className="text-slate-500"># 1. Instalar pacotes</span><br />
                <span className="text-emerald-400">npm install</span>
              </div>
              <div>
                <span className="text-slate-500"># 2. Rodar em desenvolvimento</span><br />
                <span className="text-emerald-400">npm run dev</span>
              </div>
              <div>
                <span className="text-slate-500"># 3. Compilar para produção</span><br />
                <span className="text-emerald-400">npm run build</span>
              </div>
            </div>
          </div>

          {/* Section 5: Academic Criteria Checklist */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              5. Conformidade com os Requisitos do Projeto
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-950">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Interface 100% em português brasileiro</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>4 Casos de teste oficiais clicáveis</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Modelo oficial Gemini 3.8 Flash</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Aprovação humana obrigatória</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Histórico da sessão sem dados fictícios</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>README.md completo para GitHub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
