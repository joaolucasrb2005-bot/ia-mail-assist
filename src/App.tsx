/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { EmailForm } from './components/EmailForm';
import { ResponseCard } from './components/ResponseCard';
import { HistoryList } from './components/HistoryList';
import { GuideModal } from './components/GuideModal';
import { EmailCategory, EmailRecord, ReviewStatus, CompanySettings } from './types';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  ShieldCheck,
  Zap,
  Building2,
  Sliders,
  Check,
  Clock,
  ThumbsUp,
} from 'lucide-react';

const STORAGE_KEY = 'ia_mail_assist_history_v1';
const SETTINGS_KEY = 'ia_mail_assist_settings_v1';

export default function App() {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<EmailCategory>('Atendimento');

  const [isLoading, setIsLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<EmailRecord | null>(null);
  const [history, setHistory] = useState<EmailRecord[]>([]);
  const [serverOnline, setServerOnline] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Corporate Identity Settings
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'TechCorp Soluções Empresariais',
    departmentName: 'Central de Atendimento ao Cliente',
    agentName: 'Equipe de Atendimento',
  });

  // Load session history and settings from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          if (parsed.length > 0) {
            setCurrentRecord(parsed[0]);
          }
        }
      }

      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && parsed.companyName) {
          setCompanySettings(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar dados locais:', e);
    }
  }, []);

  const saveHistory = (newHistory: EmailRecord[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.warn('Erro ao salvar histórico:', e);
    }
  };

  const saveCompanySettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Erro ao salvar configurações:', e);
    }
    setIsSettingsOpen(false);
    showToast('Identidade empresarial atualizada com sucesso!', 'success');
  };

  // Check server health
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'online') {
          setServerOnline(true);
        }
      })
      .catch((err) => {
        console.warn('Servidor backend em inicialização...', err);
        setServerOnline(false);
      });
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleGenerate = async (formData: {
    senderName: string;
    senderEmail: string;
    subject: string;
    content: string;
    category: EmailCategory;
    refinementTone?: string;
    customInstruction?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-email-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          companySettings,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || 'Falha ao processar o e-mail com a inteligência artificial.'
        );
      }

      const newRecord: EmailRecord = {
        id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        subject: formData.subject,
        content: formData.content,
        category: formData.category,
        timestamp: result.generatedAt || new Date().toISOString(),
        aiResponse: result.data,
        status: 'Aguardando revisão',
      };

      setCurrentRecord(newRecord);
      const updatedHistory = [newRecord, ...history];
      saveHistory(updatedHistory);

      showToast('Resposta gerada com sucesso! Revise antes de aprovar.', 'success');
    } catch (err: any) {
      console.error('Erro na requisição:', err);
      const msg =
        err?.message ||
        'Não foi possível conectar ao serviço de inteligência artificial. Verifique se o servidor está ativo e a chave do Gemini configurada.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ReviewStatus) => {
    const updated = history.map((rec) =>
      rec.id === id ? { ...rec, status: newStatus } : rec
    );
    saveHistory(updated);

    if (currentRecord && currentRecord.id === id) {
      setCurrentRecord({ ...currentRecord, status: newStatus });
    }

    showToast(
      newStatus === 'Revisado'
        ? 'Atendimento aprovado e marcado como Revisado!'
        : 'Atendimento reaberto para revisão.',
      'success'
    );
  };

  const handleUpdateEditedResponse = (id: string, newText: string) => {
    const updated = history.map((rec) =>
      rec.id === id ? { ...rec, editedResponse: newText } : rec
    );
    saveHistory(updated);

    if (currentRecord && currentRecord.id === id) {
      setCurrentRecord({ ...currentRecord, editedResponse: newText });
    }

    showToast('Alterações salvas na resposta com sucesso!', 'success');
  };

  const handleRegenerateWithInstruction = (customInstruction?: string) => {
    if (!senderName || !content || !subject) {
      showToast('Preencha os campos do formulário para gerar novamente.', 'error');
      return;
    }
    handleGenerate({
      senderName,
      senderEmail,
      subject,
      content,
      category,
      customInstruction,
    });
  };

  const handleClearForm = () => {
    setSenderName('');
    setSenderEmail('');
    setSubject('');
    setContent('');
    setCategory('Atendimento');
    setErrorMessage(null);
    showToast('Formulário limpo com sucesso.', 'info');
  };

  const handleClearHistory = () => {
    saveHistory([]);
    setCurrentRecord(null);
    showToast('Histórico da sessão apagado com sucesso.', 'info');
  };

  const handleSelectRecord = (record: EmailRecord) => {
    setCurrentRecord(record);
    setSenderName(record.senderName);
    setSenderEmail(record.senderEmail);
    setSubject(record.subject);
    setContent(record.content);
    setCategory(record.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Atendimento "${record.subject}" carregado.`, 'info');
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const total = history.length;
    const reviewed = history.filter((h) => h.status === 'Revisado').length;
    const pending = total - reviewed;
    const approvalRate = total > 0 ? Math.round((reviewed / total) * 100) : 0;
    return { total, reviewed, pending, approvalRate };
  }, [history]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200 bg-white border-slate-200">
          {toastMessage.type === 'success' && (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          {toastMessage.type === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          {toastMessage.type === 'info' && (
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span className="text-slate-800">{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        serverOnline={serverOnline}
        historyCount={history.length}
      />

      {/* Hero / System Overview Bar */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                Sistema Empresarial de Demonstração
              </span>
              <span className="text-xs text-slate-400">• Gemini 3.8 Flash / 3.1 Flash Lite</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Painel de Triagem e Resposta Inteligente de E-mails
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Interpreta a intenção do cliente, classifica a categoria e redige respostas profissionais personalizadas em português brasileiro com revisão humana obrigatória.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Configurar dados da empresa para assinatura"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Assinatura Corporativa</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Como Funciona a IA</span>
            </button>
          </div>
        </div>

        {/* Real-time Session KPI Strip */}
        {metrics.total > 0 && (
          <div className="max-w-7xl mx-auto mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                {metrics.total}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Processados</span>
                <p className="text-xs font-bold text-white">{metrics.total} e-mails</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                {metrics.reviewed}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Revisados & Prontos</span>
                <p className="text-xs font-bold text-emerald-300">{metrics.reviewed} aprovados</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                {metrics.pending}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Aguardando Revisão</span>
                <p className="text-xs font-bold text-amber-300">{metrics.pending} pendentes</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                {metrics.approvalRate}%
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Taxa de Conclusão</span>
                <p className="text-xs font-bold text-indigo-300">{metrics.approvalRate}% finalizados</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Error alert banner if any */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-red-900">Atenção ao Processar a Requisição</h4>
              <p className="mt-0.5 text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-600 hover:text-red-900 font-bold text-xs"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout: 2 Columns on Desktop */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Entrada de E-mails Form (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <EmailForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onClear={handleClearForm}
              senderName={senderName}
              setSenderName={setSenderName}
              senderEmail={senderEmail}
              setSenderEmail={setSenderEmail}
              subject={subject}
              setSubject={setSubject}
              content={content}
              setContent={setContent}
              category={category}
              setCategory={setCategory}
            />
          </div>

          {/* Column 2: Exibição da Resposta & Aprovação Humana (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <ResponseCard
              currentRecord={currentRecord}
              onUpdateStatus={handleUpdateStatus}
              onUpdateEditedResponse={handleUpdateEditedResponse}
              onRegenerateWithInstruction={handleRegenerateWithInstruction}
              onClearForm={handleClearForm}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Section 5: Histórico de Atendimentos */}
        <div className="pt-2">
          <HistoryList
            history={history}
            onSelectRecord={handleSelectRecord}
            onClearHistory={handleClearHistory}
            onToggleStatus={handleUpdateStatus}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">IA Mail Assist</span>
            <span>—</span>
            <span>Automação Inteligente de E-mails Empresariais</span>
            <span className="text-slate-400">• {companySettings.companyName}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Human-in-the-Loop Ativo
            </span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-blue-600 transition-colors font-medium underline"
            >
              Documentação do Projeto
            </button>
          </div>
        </div>
      </footer>

      {/* Company Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Identidade da Empresa & Assinatura
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Estes dados serão inseridos na saudação e no encerramento das respostas geradas pela IA:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                saveCompanySettings({
                  companyName: (form.elements.namedItem('companyName') as HTMLInputElement).value,
                  departmentName: (form.elements.namedItem('departmentName') as HTMLInputElement).value,
                  agentName: (form.elements.namedItem('agentName') as HTMLInputElement).value,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome da Empresa:
                </label>
                <input
                  name="companyName"
                  type="text"
                  defaultValue={companySettings.companyName}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Departamento:
                </label>
                <input
                  name="departmentName"
                  type="text"
                  defaultValue={companySettings.departmentName}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assinatura / Responsável:
                </label>
                <input
                  name="agentName"
                  type="text"
                  defaultValue={companySettings.agentName}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-xs"
                >
                  Salvar Configuração
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guide & Academic Presentation Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
