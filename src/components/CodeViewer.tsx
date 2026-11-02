import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Sparkles, BookOpen, Layers } from 'lucide-react';
import {
  PYTHON_CODE_CALCULADORA,
  PYTHON_CODE_TESTS,
} from '../services/pythonCalculator';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'calculadora' | 'tests'>('calculadora');
  const [copied, setCopied] = useState(false);

  const currentCode =
    selectedFile === 'calculadora' ? PYTHON_CODE_CALCULADORA : PYTHON_CODE_TESTS;
  const fileName = selectedFile === 'calculadora' ? 'calculadora.py' : 'test_calculadora.py';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const lines = currentCode.trim().split('\n');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Código-Fonte Python
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Implementação dos arquivos <code className="font-mono text-xs">calculadora.py</code> e <code className="font-mono text-xs">test_calculadora.py</code>.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setSelectedFile('calculadora')}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors flex items-center gap-2 ${
            selectedFile === 'calculadora'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-blue-500" />
          <span>calculadora.py</span>
          <span className="text-[10px] text-slate-400">({PYTHON_CODE_CALCULADORA.trim().split('\n').length} linhas)</span>
        </button>

        <button
          onClick={() => setSelectedFile('tests')}
          className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors flex items-center gap-2 ${
            selectedFile === 'tests'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-500" />
          <span>test_calculadora.py</span>
          <span className="text-[10px] text-slate-400">({PYTHON_CODE_TESTS.trim().split('\n').length} linhas)</span>
        </button>
      </div>

      {/* Code Container with Line Numbers */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">Python 3</span>
            <span>·</span>
            <span>UTF-8</span>
          </div>
          <span>{fileName}</span>
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed max-h-[640px] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const lineNum = idx + 1;
                // Highlight comments and docstrings
                const isComment = line.trim().startsWith('#') || line.trim().startsWith('"""');
                const isDef = line.trim().startsWith('def ') || line.trim().startsWith('class ');
                const isReturn = line.trim().startsWith('return ');

                return (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="w-10 pr-4 text-right text-slate-600 select-none text-xs tabular-nums">
                      {lineNum}
                    </td>
                    <td className="text-slate-200 whitespace-pre">
                      {isComment ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : isDef ? (
                        <span className="text-blue-400 font-semibold">{line}</span>
                      ) : isReturn ? (
                        <span className="text-pink-400">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Highlights from the report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>1. Separação de mod e %</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            O operador de resto foi rotulado como <code className="font-mono text-blue-600">mod</code>, liberando o termo porcentagem para a Opção 7 com clareza cognitiva.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>2. Prompts Contextualizados</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Mensagens dedicadas: <code className="font-mono text-xs">Digite a taxa da porcentagem...</code> e <code className="font-mono text-xs">Digite o valor base...</code> evitam ambiguidades.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 shadow-xs">
          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>3. Função formatar_numero()</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Garante que números inteiros sejam impressos limpos (ex: <code className="font-mono text-emerald-600">30</code> em vez de <code className="font-mono text-slate-400">30.0</code>).
          </p>
        </div>
      </div>
    </div>
  );
};
