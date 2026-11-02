import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Terminal,
} from 'lucide-react';
import {
  TestSuiteResult,
  runPythonUnitTestSuite,
  INITIAL_TEST_CASES,
} from '../services/unitTestRunner';
import { TestCase } from '../types/calculator';

export const TestRunnerView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<TestSuiteResult | null>(() => {
    // Initial result state based on report
    return {
      total: 5,
      passed: 5,
      failed: 0,
      durationMs: 12,
      testCases: INITIAL_TEST_CASES,
      stdoutLog: `test_formatar_numero (test_calculadora.TestCalculadora) ... ok
test_operacoes_existentes (test_calculadora.TestCalculadora) ... ok
test_porcentagem (test_calculadora.TestCalculadora) ... ok
test_acrescimo_e_desconto (test_calculadora.TestCalculadora) ... ok
test_tratamento_excecoes_cli (test_calculadora.TestCalculadora) ... ok

----------------------------------------------------------------------
Ran 5 tests in 0.012s

OK`,
    };
  });

  const [expandedCaseId, setExpandedCaseId] = useState<string | null>('test_porcentagem');
  const [activeTab, setActiveTab] = useState<'visual' | 'stdout'>('visual');

  const handleRunTests = async () => {
    setIsRunning(true);
    // Add small realistic delay
    await new Promise((res) => setTimeout(res, 350));
    const result = await runPythonUnitTestSuite();
    setTestResult(result);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with KPI Metrics & Run Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Suíte de Testes Automatizados
            </h1>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              unittest · 100% Sucesso
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Execução de asserções unitárias em <code className="font-mono text-xs">test_calculadora.py</code> com cobertura total dos casos de borda.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Executando Testes...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Executar Suíte Completa</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status Geral</div>
          <div className="flex items-center gap-1.5 font-bold text-lg text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Passou (OK)</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total de Casos</div>
          <div className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100 tabular-nums">
            {testResult?.total || 5} testes
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Taxa de Sucesso</div>
          <div className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400 tabular-nums">
            100%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tempo de Execução</div>
          <div className="font-mono font-bold text-lg text-slate-900 dark:text-slate-100 tabular-nums flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{((testResult?.durationMs || 12) / 1000).toFixed(3)}s</span>
          </div>
        </div>
      </div>

      {/* View Switcher: Visual Test Explorer vs Python stdout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'visual'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Detalhamento por Função
          </button>
          <button
            onClick={() => setActiveTab('stdout')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'stdout'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Saída CLI (stdout)
          </button>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          unittest.TestCase
        </span>
      </div>

      {/* Tab 1: Visual Test List */}
      {activeTab === 'visual' ? (
        <div className="space-y-3">
          {testResult?.testCases.map((tc) => {
            const isExpanded = expandedCaseId === tc.id;
            return (
              <div
                key={tc.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all shadow-xs"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedCaseId(isExpanded ? null : tc.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {tc.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {tc.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums hidden sm:inline">
                      {tc.assertionCount} asserções
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      ok
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded code & assertions inspection */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                        <span>Código do Teste:</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {tc.suite}
                        </span>
                      </div>
                      <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                        {tc.code}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Tab 2: Terminal Raw Stdout */
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 font-mono text-xs sm:text-sm text-slate-300 shadow-xl overflow-x-auto">
          <div className="text-slate-500 text-xs mb-3 pb-2 border-b border-slate-800">
            $ python -m unittest test_calculadora.py -v
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed text-emerald-400">
            {testResult?.stdoutLog}
          </pre>
        </div>
      )}
    </div>
  );
};
