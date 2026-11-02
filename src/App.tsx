/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { VisualCalculator } from './components/VisualCalculator';
import { CliTerminal } from './components/CliTerminal';
import { TestRunnerView } from './components/TestRunnerView';
import { CodeViewer } from './components/CodeViewer';
import { HistoryPanel } from './components/HistoryPanel';
import { CalculationResult } from './types/calculator';
import { executarCalculo } from './services/pythonCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  // Calculation history, preloaded with the benchmark operations from the report
  const [history, setHistory] = useState<CalculationResult[]>(() => {
    return [
      executarCalculo('porcentagem', 15, 200),
      executarCalculo('porcentagem', 10, 200),
      executarCalculo('porcentagem', 25, 80),
      executarCalculo('porcentagem', 15, 150),
      executarCalculo('porcentagem', 0, 500),
      executarCalculo('porcentagem', 100, 42),
      executarCalculo('acrescimo', 10, 200),
      executarCalculo('desconto', 15, 200),
    ];
  });

  const [injectedCliScript, setInjectedCliScript] = useState<string | null>(null);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleAddCalculation = (calc: CalculationResult) => {
    setHistory((prev) => [calc, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSendToCli = (commands: string) => {
    setInjectedCliScript(commands);
    setActiveTab('cli');
  };

  const handleRunQuickTests = () => {
    setActiveTab('tests');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-500/20">
      {/* 3-Zone Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onRunQuickTests={handleRunQuickTests}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'calculator' && (
          <VisualCalculator
            onCalculationDone={handleAddCalculation}
            onSendToCli={handleSendToCli}
          />
        )}

        {activeTab === 'cli' && (
          <CliTerminal
            injectedScript={injectedCliScript}
            onClearInjectedScript={() => setInjectedCliScript(null)}
          />
        )}

        {activeTab === 'tests' && <TestRunnerView />}

        {activeTab === 'code' && <CodeViewer />}

        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onClearHistory={handleClearHistory}
            onSelectCalculation={() => {
              setActiveTab('calculator');
            }}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span>Calculadora Python Pro</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Opção 7 (% de um valor)</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="font-mono">formatar_numero()</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="font-mono">unittest</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Código-Fonte
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Testes Unitários
            </button>
            <button
              onClick={() => setActiveTab('cli')}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              Terminal CLI
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
