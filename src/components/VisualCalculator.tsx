import React, { useState } from 'react';
import {
  Percent,
  Plus,
  Minus,
  X,
  Divide,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { CalculationResult, OperationType } from '../types/calculator';
import {
  executarCalculo,
  formatarNumero,
  OPERATIONS_CATALOG,
} from '../services/pythonCalculator';

interface VisualCalculatorProps {
  onCalculationDone: (result: CalculationResult) => void;
  onSendToCli: (command: string) => void;
}

export const VisualCalculator: React.FC<VisualCalculatorProps> = ({
  onCalculationDone,
  onSendToCli,
}) => {
  // Current active mode: 'percentage' | 'arithmetic'
  const [calcMode, setCalcMode] = useState<'percentage' | 'arithmetic'>('percentage');

  // Percentage form inputs
  const [selectedPercentageOp, setSelectedPercentageOp] = useState<OperationType>('porcentagem');
  const [taxaInput, setTaxaInput] = useState<string>('15');
  const [valorBaseInput, setValorBaseInput] = useState<string>('200');

  // Arithmetic inputs
  const [selectedArithOp, setSelectedArithOp] = useState<OperationType>('adicao');
  const [numAInput, setNumAInput] = useState<string>('10');
  const [numBInput, setNumBInput] = useState<string>('5');

  // Latest result
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(() => {
    return executarCalculo('porcentagem', 15, 200);
  });

  const [copied, setCopied] = useState(false);

  const handleCalculatePercentage = (
    op: OperationType = selectedPercentageOp,
    taxa: string = taxaInput,
    base: string = valorBaseInput
  ) => {
    const t = parseFloat(taxa);
    const v = parseFloat(base);

    if (isNaN(t) || isNaN(v)) {
      alert('Por favor, informe números válidos para a taxa e o valor base.');
      return;
    }

    const res = executarCalculo(op, t, v);
    setCurrentResult(res);
    onCalculationDone(res);
  };

  const handleCalculateArithmetic = (
    op: OperationType = selectedArithOp,
    a: string = numAInput,
    b: string = numBInput
  ) => {
    const valA = parseFloat(a);
    const valB = parseFloat(b);

    if (isNaN(valA) || isNaN(valB)) {
      alert('Por favor, digite valores numéricos válidos.');
      return;
    }

    const res = executarCalculo(op, valA, valB);
    setCurrentResult(res);
    onCalculationDone(res);
  };

  const handleCopy = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult.formattedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetClick = (op: OperationType, a: number, b: number) => {
    if (['porcentagem', 'acrescimo', 'desconto', 'variacao'].includes(op)) {
      setCalcMode('percentage');
      setSelectedPercentageOp(op);
      setTaxaInput(a.toString());
      setValorBaseInput(b.toString());
      handleCalculatePercentage(op, a.toString(), b.toString());
    } else {
      setCalcMode('arithmetic');
      setSelectedArithOp(op);
      setNumAInput(a.toString());
      setNumBInput(b.toString());
      handleCalculateArithmetic(op, a.toString(), b.toString());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Calculadora Interativa
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Mapeamento fiel do código <code className="font-mono text-xs">calculadora.py</code> com formatação limpa e suporte a porcentagem contextual.
          </p>
        </div>

        {/* Mode Selector Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => setCalcMode('percentage')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              calcMode === 'percentage'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Porcentagem & Variação</span>
          </button>
          <button
            onClick={() => setCalcMode('arithmetic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              calcMode === 'arithmetic'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Operações Aritméticas</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calculator Sandbox + Live Result Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Input Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          {calcMode === 'percentage' ? (
            /* Mode 1: Contextual Percentage Module */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Operações Percentuais
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Opções 7, 8 e 9 do Menu CLI
                </span>
              </div>

              {/* Operation Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'porcentagem' as OperationType,
                    label: '7. % de Valor',
                    sub: 'taxa * valor / 100',
                    icon: Percent,
                  },
                  {
                    id: 'acrescimo' as OperationType,
                    label: '8. Acréscimo (+%)',
                    sub: 'valor + taxa%',
                    icon: TrendingUp,
                  },
                  {
                    id: 'desconto' as OperationType,
                    label: '9. Desconto (-%)',
                    sub: 'valor - taxa%',
                    icon: TrendingDown,
                  },
                  {
                    id: 'variacao' as OperationType,
                    label: 'Variação (%)',
                    sub: 'crescimento relativo',
                    icon: Sparkles,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedPercentageOp === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedPercentageOp(item.id);
                        handleCalculatePercentage(item.id, taxaInput, valorBaseInput);
                      }}
                      className={`p-3 text-left rounded-lg border transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-semibold text-xs mb-1">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {item.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Contextual Prompts Form matching Python CLI */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {selectedPercentageOp === 'variacao'
                      ? 'Digite o valor inicial:'
                      : selectedPercentageOp === 'acrescimo'
                      ? 'Digite a taxa de acréscimo (ex: 10 para +10%):'
                      : selectedPercentageOp === 'desconto'
                      ? 'Digite a taxa de desconto (ex: 15 para -15%):'
                      : 'Digite a taxa da porcentagem (ex: 15 para 15%):'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={taxaInput}
                      onChange={(e) => {
                        setTaxaInput(e.target.value);
                        handleCalculatePercentage(selectedPercentageOp, e.target.value, valorBaseInput);
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
                      placeholder="ex: 15"
                    />
                    {selectedPercentageOp !== 'variacao' && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                        %
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {selectedPercentageOp === 'variacao'
                      ? 'Digite o valor final:'
                      : selectedPercentageOp === 'desconto'
                      ? 'Digite o valor original base:'
                      : 'Digite o valor base:'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={valorBaseInput}
                    onChange={(e) => {
                      setValorBaseInput(e.target.value);
                      handleCalculatePercentage(selectedPercentageOp, taxaInput, e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
                    placeholder="ex: 200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleCalculatePercentage()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Calcular Resultado</span>
                </button>

                <button
                  onClick={() => {
                    setTaxaInput('0');
                    setValorBaseInput('0');
                    handleCalculatePercentage(selectedPercentageOp, '0', '0');
                  }}
                  className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Zerar</span>
                </button>

                <button
                  onClick={() => {
                    const opt = selectedPercentageOp === 'porcentagem' ? '7' : selectedPercentageOp === 'acrescimo' ? '8' : '9';
                    onSendToCli(`${opt}\n${taxaInput}\n${valorBaseInput}\n`);
                  }}
                  className="ml-auto px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition-colors flex items-center gap-1.5"
                  title="Executar este cálculo no terminal interativo"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Enviar para CLI</span>
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Standard Arithmetic Operations */
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Operações Aritméticas (1 a 6)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  mod vs % diferenciados
                </span>
              </div>

              {/* Arithmetic Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'adicao' as OperationType, label: '1. Adição', symbol: '+', icon: Plus },
                  { id: 'subtracao' as OperationType, label: '2. Subtração', symbol: '-', icon: Minus },
                  { id: 'multiplicacao' as OperationType, label: '3. Multipl.', symbol: '*', icon: X },
                  { id: 'divisao' as OperationType, label: '4. Divisão', symbol: '/', icon: Divide },
                  { id: 'potenciacao' as OperationType, label: '5. Potência', symbol: '^', icon: HelpCircle },
                  { id: 'resto' as OperationType, label: '6. Resto', symbol: 'mod', icon: Percent },
                ].map((item) => {
                  const isActive = selectedArithOp === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedArithOp(item.id);
                        handleCalculateArithmetic(item.id, numAInput, numBInput);
                      }}
                      className={`p-3 text-center rounded-lg border transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-sm font-mono font-bold mb-0.5">{item.symbol}</div>
                      <div className="text-[11px] truncate text-slate-500 dark:text-slate-400">{item.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {OPERATIONS_CATALOG[selectedArithOp].firstPrompt}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={numAInput}
                    onChange={(e) => {
                      setNumAInput(e.target.value);
                      handleCalculateArithmetic(selectedArithOp, e.target.value, numBInput);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {OPERATIONS_CATALOG[selectedArithOp].secondPrompt}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={numBInput}
                    onChange={(e) => {
                      setNumBInput(e.target.value);
                      handleCalculateArithmetic(selectedArithOp, numAInput, e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
                  />
                </div>
              </div>

              {/* Quick Keypad */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleCalculateArithmetic()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Calcular</span>
                </button>
                <button
                  onClick={() => {
                    setNumAInput('0');
                    setNumBInput('0');
                    handleCalculateArithmetic(selectedArithOp, '0', '0');
                  }}
                  className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Zerar</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Presets Bar from the test report */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
              <span>Casos de Teste do Relatório (1 clique):</span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">100% testado</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '15% de 200 (= 30)', op: 'porcentagem' as OperationType, a: 15, b: 200 },
                { label: '10% de 200 (= 20)', op: 'porcentagem' as OperationType, a: 10, b: 200 },
                { label: '25% de 80 (= 20)', op: 'porcentagem' as OperationType, a: 25, b: 80 },
                { label: '15% de 150 (= 22.5)', op: 'porcentagem' as OperationType, a: 15, b: 150 },
                { label: '0% de 500 (= 0)', op: 'porcentagem' as OperationType, a: 0, b: 500 },
                { label: '100% de 42 (= 42)', op: 'porcentagem' as OperationType, a: 100, b: 42 },
                { label: '200 + 10% (= 220)', op: 'acrescimo' as OperationType, a: 10, b: 200 },
                { label: '200 - 15% (= 170)', op: 'desconto' as OperationType, a: 15, b: 200 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(p.op, p.a, p.b)}
                  className="px-2.5 py-1.5 text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Result Stage & Mathematical Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Resultado formatado
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                formatar_numero()
              </span>
            </div>

            {/* Big Result Display */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center mb-5">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
                {currentResult?.displayFormula || 'Aguardando operação'}
              </div>
              <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-50 tabular-nums">
                {currentResult?.isError ? (
                  <span className="text-red-500 text-2xl font-sans">{currentResult.errorMessage}</span>
                ) : (
                  currentResult?.formattedResult || '0'
                )}
              </div>
            </div>

            {/* Step-by-Step Mathematical Explanation */}
            {currentResult && !currentResult.isError && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-left">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Detalhamento da Operação:
                </div>
                <div className="p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentResult.stepsExplanation}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>Sem .0 em inteiros:</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                    {currentResult.formattedResult}
                  </span>
                </div>
              </div>
            )}

            {/* Copy Button */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={handleCopy}
                disabled={!currentResult || currentResult.isError}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado para a área de transferência!' : 'Copiar Resultado'}</span>
              </button>
            </div>
          </div>

          {/* Educational Note Card */}
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl text-xs text-blue-900 dark:text-blue-200 space-y-2">
            <div className="font-semibold flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Por que a Opção 7 foi isolada?</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Na versão anterior, o operador de resto da divisão utilizava o símbolo <code className="font-mono text-blue-700 dark:text-blue-300">%</code>, gerando ambiguidade. Agora o resto é rotulado como <code className="font-mono font-semibold">mod</code>, e a opção 7 gerencia com precisão <code className="font-mono font-semibold">% de um valor</code> com prompts separados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
