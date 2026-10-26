import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  User,
  AtSign,
  Tag,
  FileText,
  RotateCcw,
  Zap,
  SlidersHorizontal,
  Headphones,
  ShoppingBag,
  Wrench,
  Package,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { EmailCategory, QuickExample } from '../types';

interface EmailFormProps {
  onGenerate: (data: {
    senderName: string;
    senderEmail: string;
    subject: string;
    content: string;
    category: EmailCategory;
    refinementTone?: string;
  }) => Promise<void>;
  isLoading: boolean;
  onClear: () => void;
  senderName: string;
  setSenderName: (val: string) => void;
  senderEmail: string;
  setSenderEmail: (val: string) => void;
  subject: string;
  setSubject: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  category: EmailCategory;
  setCategory: (val: EmailCategory) => void;
}

const CATEGORIES: { label: EmailCategory; icon: React.ReactNode; color: string; desc: string }[] = [
  {
    label: 'Atendimento',
    icon: <Headphones className="w-4 h-4" />,
    color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100',
    desc: 'Cadastros e SAC',
  },
  {
    label: 'Vendas',
    icon: <ShoppingBag className="w-4 h-4" />,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    desc: 'Orçamentos e produtos',
  },
  {
    label: 'Suporte Técnico',
    icon: <Wrench className="w-4 h-4" />,
    color: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100',
    desc: 'Falhas e orientações',
  },
  {
    label: 'Pedido',
    icon: <Package className="w-4 h-4" />,
    color: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100',
    desc: 'Rastreio e prazos',
  },
  {
    label: 'Dúvidas Gerais',
    icon: <HelpCircle className="w-4 h-4" />,
    color: 'text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-200',
    desc: 'Informações gerais',
  },
];

const TEST_EXAMPLES: QuickExample[] = [
  {
    title: 'Exemplo 1 — Atendimento',
    badge: 'Atendimento',
    category: 'Atendimento',
    senderName: 'Mariana Silva',
    senderEmail: 'mariana.silva@exemplo.com.br',
    subject: 'Atualização de dados cadastrais',
    content: 'Olá, gostaria de saber como posso atualizar meus dados cadastrais.',
  },
  {
    title: 'Exemplo 2 — Vendas',
    badge: 'Vendas',
    category: 'Vendas',
    senderName: 'Carlos Eduardo Rocha',
    senderEmail: 'carlos.rocha@empresa.com.br',
    subject: 'Informações sobre catálogo e preços',
    content: 'Bom dia, gostaria de receber informações sobre os produtos e preços disponíveis.',
  },
  {
    title: 'Exemplo 3 — Suporte',
    badge: 'Suporte',
    category: 'Suporte Técnico',
    senderName: 'Fernanda Alves',
    senderEmail: 'fernanda.alves@tech.com.br',
    subject: 'Dificuldade de acesso ao sistema',
    content: 'Estou com dificuldades para utilizar o serviço e preciso de ajuda.',
  },
  {
    title: 'Exemplo 4 — Pedido',
    badge: 'Pedido',
    category: 'Pedido',
    senderName: 'Roberto Mendes',
    senderEmail: 'roberto.mendes@email.com',
    subject: 'Previsão de entrega da encomenda',
    content: 'Gostaria de saber a previsão de entrega do meu pedido.',
  },
];

const TONE_OPTIONS = [
  'Padrão Corporativo (Cordial e Objetivo)',
  'Formal e Institucional',
  'Acolhedor e Empático (Foco em SAC)',
  'Técnico e Direto ao Ponto',
  'Conciso e Ágil',
];

export const EmailForm: React.FC<EmailFormProps> = ({
  onGenerate,
  isLoading,
  onClear,
  senderName,
  setSenderName,
  senderEmail,
  setSenderEmail,
  subject,
  setSubject,
  content,
  setContent,
  category,
  setCategory,
}) => {
  const [selectedTone, setSelectedTone] = useState(TONE_OPTIONS[0]);
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!senderName.trim()) {
      errors.senderName = 'Informe o nome do remetente.';
    }
    if (!senderEmail.trim()) {
      errors.senderEmail = 'Informe o e-mail do remetente.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail.trim())) {
      errors.senderEmail = 'Informe um endereço de e-mail válido.';
    }
    if (!subject.trim()) {
      errors.subject = 'Informe o assunto do e-mail.';
    }
    if (!content.trim()) {
      errors.content = 'Digite ou cole o conteúdo do e-mail recebido.';
    } else if (content.trim().length < 5) {
      errors.content = 'O conteúdo do e-mail deve ter pelo menos 5 caracteres.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onGenerate({
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      subject: subject.trim(),
      content: content.trim(),
      category,
      refinementTone: selectedTone,
    });
  };

  const loadExample = (example: QuickExample) => {
    setSenderName(example.senderName);
    setSenderEmail(example.senderEmail);
    setSubject(example.subject);
    setContent(example.content);
    setCategory(example.category);
    setValidationErrors({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Top Banner / Quick Tests */}
      <div className="bg-slate-50 border-b border-slate-200/90 p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Casos de Teste do Sistema (Clique para carregar):
            </span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Exemplos oficiais</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEST_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadExample(ex)}
              disabled={isLoading}
              className="group text-left px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all duration-150 active:scale-98 disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                  {ex.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5" title={ex.content}>
                {ex.content}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Entrada de E-mail
            </h2>
            <p className="text-xs text-slate-500">
              Preencha os dados da mensagem recebida para processamento com IA
            </p>
          </div>
          {(senderName || senderEmail || subject || content) && (
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar formulário</span>
            </button>
          )}
        </div>

        {/* Sender details row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Nome do Remetente *
            </label>
            <input
              type="text"
              placeholder="Ex.: Mariana Silva"
              value={senderName}
              onChange={(e) => {
                setSenderName(e.target.value);
                if (validationErrors.senderName) {
                  setValidationErrors((prev) => ({ ...prev, senderName: '' }));
                }
              }}
              disabled={isLoading}
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 ${
                validationErrors.senderName
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            {validationErrors.senderName && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.senderName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5 text-slate-400" />
              E-mail do Remetente *
            </label>
            <input
              type="email"
              placeholder="Ex.: mariana.silva@exemplo.com.br"
              value={senderEmail}
              onChange={(e) => {
                setSenderEmail(e.target.value);
                if (validationErrors.senderEmail) {
                  setValidationErrors((prev) => ({ ...prev, senderEmail: '' }));
                }
              }}
              disabled={isLoading}
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 ${
                validationErrors.senderEmail
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-200 focus:border-blue-600'
              }`}
            />
            {validationErrors.senderEmail && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.senderEmail}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            Assunto do E-mail *
          </label>
          <input
            type="text"
            placeholder="Ex.: Atualização de dados cadastrais"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (validationErrors.subject) {
                setValidationErrors((prev) => ({ ...prev, subject: '' }));
              }
            }}
            disabled={isLoading}
            className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 ${
              validationErrors.subject
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-200 focus:border-blue-600'
            }`}
          />
          {validationErrors.subject && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.subject}
            </p>
          )}
        </div>

        {/* Category selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Selecione a Categoria Principal do Atendimento *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg mb-1 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 hidden sm:inline">
                    {cat.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Conteúdo do E-mail Recebido *
            </label>
            <span className="text-[11px] text-slate-400">
              {content.length} caracteres
            </span>
          </div>
          <textarea
            rows={5}
            placeholder="Cole aqui a mensagem recebida do cliente..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (validationErrors.content) {
                setValidationErrors((prev) => ({ ...prev, content: '' }));
              }
            }}
            disabled={isLoading}
            className={`w-full p-3.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white text-slate-800 placeholder-slate-400 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 resize-y ${
              validationErrors.content
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-200 focus:border-blue-600'
            }`}
          />
          {validationErrors.content && (
            <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.content}
            </p>
          )}
        </div>

        {/* Advanced tone toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowToneSelector(!showToneSelector)}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-blue-700 font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>
              {showToneSelector ? 'Ocultar opções de tom' : 'Personalizar tom da resposta (opcional)'}
            </span>
          </button>

          {showToneSelector && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Tom de Comunicação Desejado:
              </label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                disabled={isLoading}
                aria-label="Tom de Comunicação Desejado"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {TONE_OPTIONS.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 hover:from-blue-600 hover:via-blue-700 hover:to-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 active:scale-99 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processando com Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>Gerar resposta com IA</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            A resposta será apresentada para revisão humana antes de qualquer envio.
          </p>
        </div>
      </form>
    </div>
  );
};
