import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Inbox,
  Filter,
  ExternalLink,
  Download,
  Search,
  FileSpreadsheet,
} from 'lucide-react';
import { EmailRecord, ReviewStatus } from '../types';

interface HistoryListProps {
  history: EmailRecord[];
  onSelectRecord: (record: EmailRecord) => void;
  onClearHistory: () => void;
  onToggleStatus: (id: string, currentStatus: ReviewStatus) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectRecord,
  onClearHistory,
  onToggleStatus,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const handleCopy = async (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filterCategory !== 'Todas' && item.category !== filterCategory) return false;
    if (filterStatus !== 'Todos' && item.status !== filterStatus) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchSubject = item.subject.toLowerCase().includes(term);
      const matchSender = item.senderName.toLowerCase().includes(term);
      const matchEmail = item.senderEmail.toLowerCase().includes(term);
      if (!matchSubject && !matchSender && !matchEmail) return false;
    }
    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ia-mail-assist-historico-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsTextReport = () => {
    let report = `========================================================================\n`;
    report += `IA MAIL ASSIST — RELATÓRIO DE ATENDIMENTOS DA SESSÃO\n`;
    report += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
    report += `Total de atendimentos: ${history.length}\n`;
    report += `========================================================================\n\n`;

    history.forEach((item, index) => {
      report += `[ATENDIMENTO #${index + 1}]\n`;
      report += `Data/Hora: ${formatDate(item.timestamp)}\n`;
      report += `Situação: ${item.status}\n`;
      report += `Categoria: ${item.category}\n`;
      report += `Remetente: ${item.senderName} <${item.senderEmail}>\n`;
      report += `Assunto: ${item.subject}\n\n`;
      report += `--- MENSAGEM DO CLIENTE ---\n${item.content}\n\n`;
      report += `--- RESUMO DA IA ---\n${item.aiResponse.resumo}\n\n`;
      report += `--- RESPOSTA GERADA (Aprovada pelo Operador) ---\n${item.editedResponse || item.aiResponse.respostaSugerida}\n\n`;
      report += `------------------------------------------------------------------------\n\n`;
    });

    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(report);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `relatorio-atendimentos-${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const reviewedCount = history.filter((h) => h.status === 'Revisado').length;
  const pendingCount = history.filter((h) => h.status === 'Aguardando revisão').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-slate-50">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Histórico de Atendimentos da Sessão
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold font-mono">
              {history.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            E-mails processados e analisados com IA durante sua navegação
          </p>
        </div>

        {/* Badges and Export Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {history.length > 0 && (
            <>
              {/* Metrics pills */}
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                  {reviewedCount} Revisados
                </span>
                <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                  {pendingCount} Pendentes
                </span>
              </div>

              {/* Export dropdown / buttons */}
              <button
                type="button"
                onClick={exportAsTextReport}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                title="Exportar relatório formatado em TXT para entrega acadêmica"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Exportar Relatório</span>
              </button>

              <button
                type="button"
                onClick={exportAsJSON}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
                title="Exportar dados brutos em JSON"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>JSON</span>
              </button>
            </>
          )}

          {/* Clear History Controls */}
          {history.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-red-700">Limpar tudo?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-xs cursor-pointer"
                  >
                    Sim, limpar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
                  title="Limpar todos os atendimentos da sessão"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpar histórico</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search (only visible if history has items) */}
      {history.length > 0 && (
        <div className="p-3 px-4 bg-slate-50/50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center flex-wrap gap-3">
            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">Filtros:</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span>Categoria:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filtrar por Categoria"
                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-600"
              >
                <option value="Todas">Todas</option>
                <option value="Atendimento">Atendimento</option>
                <option value="Vendas">Vendas</option>
                <option value="Suporte Técnico">Suporte Técnico</option>
                <option value="Pedido">Pedido</option>
                <option value="Dúvidas Gerais">Dúvidas Gerais</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span>Situação:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filtrar por Situação"
                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-600"
              >
                <option value="Todos">Todos</option>
                <option value="Aguardando revisão">Aguardando revisão</option>
                <option value="Revisado">Revisado</option>
              </select>
            </div>
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por remetente ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-600 placeholder-slate-400"
            />
          </div>
        </div>
      )}

      {/* History Items or Empty State */}
      <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Nenhum e-mail processado nesta sessão
            </p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Conforme as diretrizes, não apresentamos dados fictícios. Utilize o formulário acima para processar seu primeiro e-mail ou experimente um dos exemplos rápidos de teste.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-xs">Nenhum atendimento corresponde aos filtros e busca selecionados.</p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            const isReviewed = item.status === 'Revisado';
            const displayText = item.editedResponse || item.aiResponse.respostaSugerida;

            return (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                {/* Main row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.subject}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {item.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isReviewed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isReviewed ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            Revisado
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                            Aguardando revisão
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span>Remetente: <strong className="text-slate-700">{item.senderName}</strong> ({item.senderEmail})</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{formatDate(item.timestamp)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Toggle Status Button */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(item.id, item.status)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        isReviewed
                          ? 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title="Alternar situação entre Revisado e Aguardando revisão"
                    >
                      {isReviewed ? 'Reabrir' : 'Marcar Revisado'}
                    </button>

                    {/* Copy Response Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopy(item.id, displayText, e)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Copiar resposta"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* View in Card Button */}
                    <button
                      type="button"
                      onClick={() => onSelectRecord(item)}
                      className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                      title="Carregar atendimento no painel principal"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {/* Expand icon */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                      aria-label={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="bg-slate-100/70 p-2.5 rounded-lg text-slate-700">
                      <span className="font-semibold block text-[11px] text-slate-800 mb-0.5">
                        Mensagem original recebida:
                      </span>
                      <p className="italic">{item.content}</p>
                    </div>

                    <div className="bg-blue-50/50 p-2.5 rounded-lg text-slate-800 border border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[11px] text-blue-900">
                          Resposta sugerida pela IA ({item.aiResponse.tomUtilizado}):
                        </span>
                        {item.editedResponse && (
                          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Versão Editada pelo Atendente
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-line leading-relaxed text-slate-800">
                        {displayText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
