import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, Download, Copy, Check, Calculator, ArrowUpRight } from 'lucide-react';
import { CalculationResult, OperationType } from '../types/calculator';

interface HistoryPanelProps {
  history: CalculationResult[];
  onClearHistory: () => void;
  onSelectCalculation: (calc: CalculationResult) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onClearHistory,
  onSelectCalculation,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'percentage') {
      return ['porcentagem', 'acrescimo', 'desconto', 'variacao'].includes(item.operation);
    }
    if (filter === 'arithmetic') {
      return ['adicao', 'subtracao', 'multiplicacao', 'divisao', 'potenciacao', 'resto'].includes(
        item.operation
      );
    }
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportText = () => {
    if (history.length === 0) return;
    const lines = [
      'HISTÓRICO DA CALCULADORA PYTHON PRO',
      '==================================',
      ...history.map(
        (h) => `[${new Date(h.timestamp).toLocaleTimeString()}] ${h.displayFormula}`
      ),
      '==================================',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_calculadora_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Histórico da Sessão
            </h1>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              ({history.length} operações registradas)
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Registro cronológico das operações realizadas na sessão atual com suporte a exportação.
          </p>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportText}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar TXT</span>
          </button>

          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Todas ({history.length})
        </button>
        <button
          onClick={() => setFilter('percentage')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filter === 'percentage'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Porcentagem & Variação
        </button>
        <button
          onClick={() => setFilter('arithmetic')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            filter === 'arithmetic'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Aritmética
        </button>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="py-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <HistoryIcon className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500 mb-2 opacity-60" />
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Nenhum cálculo registrado neste filtro
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Realize operações na Calculadora Visual ou no Terminal CLI para vê-las listadas aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono">{new Date(item.timestamp).toLocaleTimeString()}</span>
                  <span>·</span>
                  <span className="capitalize">{item.operation}</span>
                  {item.isError && (
                    <span className="text-red-500 font-medium">· Erro capturado</span>
                  )}
                </div>

                <div className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">
                  {item.displayFormula}
                </div>

                {item.stepsExplanation && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {item.stepsExplanation}
                  </div>
                )}
              </div>

              {/* Actions per item */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleCopy(item.id, item.formattedResult)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs flex items-center gap-1"
                  title="Copiar resultado"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Copiar</span>
                </button>

                <button
                  onClick={() => onSelectCalculation(item)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Reabrir</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
