import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Edit3,
  Save,
  RotateCcw,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  UserCheck,
  FileCheck,
  MessageSquare,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { EmailRecord, ReviewStatus } from '../types';

interface ResponseCardProps {
  currentRecord: EmailRecord | null;
  onUpdateStatus: (id: string, status: ReviewStatus) => void;
  onUpdateEditedResponse: (id: string, newText: string) => void;
  onRegenerateWithInstruction: (customInstruction?: string) => void;
  onClearForm: () => void;
  isLoading: boolean;
}

const REFINEMENT_PRESETS = [
  'Tornar o texto mais conciso e direto ao ponto',
  'Adotar um tom mais formal e institucional',
  'Aumentar a empatia e acolhimento com o cliente',
  'Reforçar educadamente a solicitação dos dados pendentes',
];

export const ResponseCard: React.FC<ResponseCardProps> = ({
  currentRecord,
  onUpdateStatus,
  onUpdateEditedResponse,
  onRegenerateWithInstruction,
  onClearForm,
  isLoading,
}) => {
  const [copiedType, setCopiedType] = useState<'body' | 'full' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'meta'>('preview');

  useEffect(() => {
    if (currentRecord) {
      setEditedText(
        currentRecord.editedResponse !== undefined
          ? currentRecord.editedResponse
          : currentRecord.aiResponse.respostaSugerida
      );
      setIsEditing(false);
      setShowRegenerateModal(false);
    }
  }, [currentRecord]);

  const handleCopyBody = async () => {
    const textToCopy = editedText;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedType('body');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const handleCopyFullEmail = async () => {
    if (!currentRecord) return;
    const fullText = `De: Central de Atendimento ao Cliente
Para: ${currentRecord.senderName} <${currentRecord.senderEmail}>
Assunto: Re: ${currentRecord.subject}

${editedText}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedType('full');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const handleSaveEdit = () => {
    if (!currentRecord) return;
    onUpdateEditedResponse(currentRecord.id, editedText);
    setIsEditing(false);
  };

  const toggleStatus = () => {
    if (!currentRecord) return;
    const nextStatus: ReviewStatus =
      currentRecord.status === 'Revisado' ? 'Aguardando revisão' : 'Revisado';
    onUpdateStatus(currentRecord.id, nextStatus);
  };

  const handleApplyRegenerate = (instruction?: string) => {
    setShowRegenerateModal(false);
    onRegenerateWithInstruction(instruction || customPrompt);
    setCustomPrompt('');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
          </div>
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Processando e-mail com Inteligência Artificial
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          O Gemini está analisando a mensagem recebida, interpretando a intenção e estruturando uma resposta profissional e segura...
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-600">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
            🔍 Identificação de contexto
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
            🛡️ Verificação anti-alucinação
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
            ✉️ Redação personalizada
          </span>
        </div>
      </div>
    );
  }

  if (!currentRecord) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <Sparkles className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Aguardando mensagem para análise
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          Preencha o formulário ao lado com os dados do remetente e mensagem, ou selecione um dos casos de teste rápido para gerar a resposta instantaneamente.
        </p>
        <div className="mt-5 p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-left max-w-md w-full">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Como funciona a revisão:</strong> Toda sugestão gerada pela IA deve ser validada ou editada pelo atendente humano antes do envio, garantindo precisão e conformidade.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { aiResponse } = currentRecord;
  const isReviewed = currentRecord.status === 'Revisado';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden flex flex-col relative">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Resultado do Processamento
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isReviewed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {isReviewed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Revisado e Aprovado
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-amber-400" />
                    Aguardando revisão
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Resposta preparada para: <strong>{currentRecord.senderName}</strong>
            </p>
          </div>
        </div>

        {/* Toggle review button */}
        <button
          type="button"
          onClick={toggleStatus}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
            isReviewed
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-900/40'
          }`}
        >
          {isReviewed ? (
            <>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reabrir para Revisão</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Aprovar Atendimento</span>
            </>
          )}
        </button>
      </div>

      {/* Human-in-the-loop warning banner */}
      <div className="bg-amber-50 border-b border-amber-200/90 px-4 sm:px-6 py-2.5 flex items-center space-x-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-900 font-medium">
          <strong>Aprovação Humana:</strong> Resposta gerada por inteligência artificial (Gemini). Revise o conteúdo antes de enviá-lo ao remetente. Não há envio automático.
        </p>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 space-y-4 flex-1">
        {/* Identified category & intent summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              1. Categoria Identificada
            </span>
            <div className="flex items-center space-x-2">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-semibold text-xs border border-blue-200">
                {aiResponse.categoriaIdentificada}
              </span>
              <span className="text-[11px] text-slate-500">
                Tom: <strong>{aiResponse.tomUtilizado}</strong>
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Intenção Principal
            </span>
            <p className="text-xs font-semibold text-slate-800 truncate" title={aiResponse.intencaoPrincipal}>
              {aiResponse.intencaoPrincipal}
            </p>
          </div>
        </div>

        {/* 2. Resumo da solicitação */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            2. Resumo do E-mail Recebido
          </span>
          <p className="text-xs text-slate-700 leading-relaxed">
            {aiResponse.resumo}
          </p>
        </div>

        {/* Missing information alerts if present */}
        {aiResponse.informacoesFaltantes && aiResponse.informacoesFaltantes.length > 0 && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
            <div className="flex items-center space-x-1.5 text-blue-900 font-semibold mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
              <span>Informações Não Fornecidas / A Confirmar:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-blue-800 text-[11px]">
              {aiResponse.informacoesFaltantes.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
            <p className="text-[10px] text-blue-700 mt-1 italic">
              * A IA não inventou dados e redigiu a resposta solicitando educadamente estas informações ou informando a necessidade de consulta interna.
            </p>
          </div>
        )}

        {/* Notes for human reviewer */}
        {aiResponse.notasParaRevisor && (
          <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-700 block mb-0.5 text-[11px]">
              Observações para o Revisor Humano:
            </span>
            <p className="text-[11px] leading-relaxed">{aiResponse.notasParaRevisor}</p>
          </div>
        )}

        {/* 3. Resposta sugerida para o remetente */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                3. Resposta Sugerida para o Remetente
              </span>
              {currentRecord.editedResponse && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Editado manualmente
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>Salvar texto</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editar resposta</span>
                </button>
              )}
            </div>
          </div>

          {/* Email mockup preview */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {/* Mockup header */}
            <div className="bg-slate-50 border-b border-slate-200 p-2.5 px-3.5 text-[11px] text-slate-500 space-y-0.5">
              <div className="flex justify-between">
                <span><strong>Para:</strong> {currentRecord.senderName} &lt;{currentRecord.senderEmail}&gt;</span>
                <span className="text-slate-400 font-mono">Status: {currentRecord.status}</span>
              </div>
              <div>
                <strong>Assunto:</strong> Re: {currentRecord.subject}
              </div>
            </div>

            {/* Content area */}
            <div className="p-4">
              {isEditing ? (
                <div>
                  <textarea
                    rows={8}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    aria-label="Editor de resposta sugerida"
                    className="w-full text-xs font-sans text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 border border-blue-300 rounded-lg p-2.5 resize-y bg-blue-50/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Você pode editar a saudação, orientações específicas ou assinatura antes de aprovar.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                  {editedText}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons row */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center flex-wrap gap-2">
            {/* Copy options */}
            <button
              type="button"
              onClick={handleCopyBody}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                copiedType === 'body'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
              }`}
            >
              {copiedType === 'body' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Resposta copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar resposta</span>
                </>
              )}
            </button>

            {/* Copy full email with headers */}
            <button
              type="button"
              onClick={handleCopyFullEmail}
              className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors border cursor-pointer ${
                copiedType === 'full'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Copiar cabeçalhos Para, De, Assunto e Mensagem"
            >
              {copiedType === 'full' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>E-mail completo copiado!</span>
                </>
              ) : (
                <span>Copiar com cabeçalho</span>
              )}
            </button>

            {/* Regenerate button (opens refinement menu) */}
            <button
              type="button"
              onClick={() => setShowRegenerateModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Gerar nova resposta</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Clear form button */}
            <button
              type="button"
              onClick={onClearForm}
              className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar formulário</span>
            </button>
          </div>
        </div>
      </div>

      {/* Regenerate / Refinement Modal */}
      {showRegenerateModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-30 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-800">
                  Gerar Nova Versão da Resposta
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowRegenerateModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Escolha uma instrução rápida ou descreva como a IA deve ajustar a resposta:
            </p>

            <div className="space-y-1.5">
              {REFINEMENT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyRegenerate(preset)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                >
                  • {preset}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Ou digite uma instrução personalizada:
              </label>
              <input
                type="text"
                placeholder="Ex.: Solicitar telefone de contato para retorno urgente..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRegenerateModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleApplyRegenerate(customPrompt || undefined)}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm"
              >
                Gerar com Gemini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
