import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Send,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { CliLine } from '../types/calculator';
import {
  formatarNumero,
  pythonCalculator,
  OPERATIONS_CATALOG,
} from '../services/pythonCalculator';

interface CliTerminalProps {
  onCalculationDone?: (calc: any) => void;
  injectedScript?: string | null;
  onClearInjectedScript?: () => void;
}

type StepState =
  | 'WAITING_OPTION'
  | 'WAITING_FIRST_INPUT'
  | 'WAITING_SECOND_INPUT'
  | 'TERMINATED';

const MENU_TEXT = `==============================
      CALCULADORA EM PYTHON
==============================
1. Adição (+)
2. Subtração (-)
3. Multiplicação (*)
4. Divisão (/)
5. Potenciação (^)
6. Resto da Divisão (mod)
7. Porcentagem (% de um valor)
8. Acréscimo (+ %)
9. Desconto (- %)
0. Sair
==============================`;

export const CliTerminal: React.FC<CliTerminalProps> = ({
  onCalculationDone,
  injectedScript,
  onClearInjectedScript,
}) => {
  const [lines, setLines] = useState<CliLine[]>([
    { id: '1', type: 'system', text: '$ python calculadora.py' },
    { id: '2', type: 'output', text: MENU_TEXT },
    { id: '3', type: 'prompt', text: 'Escolha uma opção (0-9): ' },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [stepState, setStepState] = useState<StepState>('WAITING_OPTION');
  const [currentOption, setCurrentOption] = useState<string>('');
  const [firstValue, setFirstValue] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Handle injected script if passed from other views
  useEffect(() => {
    if (injectedScript) {
      const parts = injectedScript.split('\n').filter((p) => p.trim() !== '');
      if (parts.length > 0) {
        processSequence(parts);
      }
      onClearInjectedScript?.();
    }
  }, [injectedScript]);

  const processSequence = async (sequence: string[]) => {
    for (const item of sequence) {
      await new Promise((res) => setTimeout(res, 250));
      handleUserSubmit(item);
    }
  };

  const restartSession = () => {
    setLines([
      { id: Date.now().toString(), type: 'system', text: '$ python calculadora.py' },
      { id: (Date.now() + 1).toString(), type: 'output', text: MENU_TEXT },
      { id: (Date.now() + 2).toString(), type: 'prompt', text: 'Escolha uma opção (0-9): ' },
    ]);
    setStepState('WAITING_OPTION');
    setCurrentOption('');
    setFirstValue(null);
    setInputVal('');
  };

  const handleUserSubmit = (userText: string) => {
    const text = userText.trim();
    if (stepState === 'TERMINATED') {
      if (text.toLowerCase() === 'python calculadora.py' || text === 'python') {
        restartSession();
      } else {
        setLines((prev) => [
          ...prev,
          { id: Math.random().toString(), type: 'input', text },
          { id: Math.random().toString(), type: 'system', text: 'Sessão encerrada. Clique em "Reiniciar Sessão" para abrir novamente o script.' },
        ]);
      }
      setInputVal('');
      return;
    }

    // Step 1: User chooses option
    if (stepState === 'WAITING_OPTION') {
      const newLines: CliLine[] = [
        ...lines,
        { id: Math.random().toString(), type: 'input', text },
      ];

      if (text === '0') {
        newLines.push(
          { id: Math.random().toString(), type: 'system', text: '\nEncerrando a calculadora. Até mais!' }
        );
        setLines(newLines);
        setStepState('TERMINATED');
        setInputVal('');
        return;
      }

      const validOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      if (!validOptions.includes(text)) {
        newLines.push(
          { id: Math.random().toString(), type: 'error', text: '\n[!] Opção inválida! Escolha entre 0 e 9.\n' },
          { id: Math.random().toString(), type: 'output', text: MENU_TEXT },
          { id: Math.random().toString(), type: 'prompt', text: 'Escolha uma opção (0-9): ' }
        );
        setLines(newLines);
        setInputVal('');
        return;
      }

      // Prompt 1
      setCurrentOption(text);
      setStepState('WAITING_FIRST_INPUT');
      let prompt1 = 'Digite o primeiro número: ';
      if (text === '4') prompt1 = 'Digite o numerador (dividendo): ';
      if (text === '5') prompt1 = 'Digite a base: ';
      if (text === '6') prompt1 = 'Digite o dividendo: ';
      if (text === '7') prompt1 = 'Digite a taxa da porcentagem (ex: 15 para 15%): ';
      if (text === '8') prompt1 = 'Digite a taxa de acréscimo (ex: 10 para +10%): ';
      if (text === '9') prompt1 = 'Digite a taxa de desconto (ex: 15 para -15%): ';

      newLines.push({ id: Math.random().toString(), type: 'prompt', text: prompt1 });
      setLines(newLines);
      setInputVal('');
      return;
    }

    // Step 2: User provides first input
    if (stepState === 'WAITING_FIRST_INPUT') {
      const val1 = parseFloat(text);
      const newLines: CliLine[] = [
        ...lines,
        { id: Math.random().toString(), type: 'input', text },
      ];

      if (isNaN(val1)) {
        // ValueError catch
        newLines.push(
          { id: Math.random().toString(), type: 'error', text: '\n[!] Erro de Entrada (ValueError): Digite apenas números válidos.\n' },
          { id: Math.random().toString(), type: 'output', text: MENU_TEXT },
          { id: Math.random().toString(), type: 'prompt', text: 'Escolha uma opção (0-9): ' }
        );
        setStepState('WAITING_OPTION');
        setLines(newLines);
        setInputVal('');
        return;
      }

      setFirstValue(val1);
      setStepState('WAITING_SECOND_INPUT');

      let prompt2 = 'Digite o segundo número: ';
      if (currentOption === '4') prompt2 = 'Digite o denominador (divisor): ';
      if (currentOption === '5') prompt2 = 'Digite o expoente: ';
      if (currentOption === '6') prompt2 = 'Digite o divisor: ';
      if (currentOption === '7') prompt2 = 'Digite o valor base: ';
      if (currentOption === '8') prompt2 = 'Digite o valor base: ';
      if (currentOption === '9') prompt2 = 'Digite o valor base original: ';

      newLines.push({ id: Math.random().toString(), type: 'prompt', text: prompt2 });
      setLines(newLines);
      setInputVal('');
      return;
    }

    // Step 3: User provides second input & execute calculation
    if (stepState === 'WAITING_SECOND_INPUT') {
      const val2 = parseFloat(text);
      const newLines: CliLine[] = [
        ...lines,
        { id: Math.random().toString(), type: 'input', text },
      ];

      if (isNaN(val2)) {
        newLines.push(
          { id: Math.random().toString(), type: 'error', text: '\n[!] Erro de Entrada (ValueError): Digite apenas números válidos.\n' },
          { id: Math.random().toString(), type: 'output', text: MENU_TEXT },
          { id: Math.random().toString(), type: 'prompt', text: 'Escolha uma opção (0-9): ' }
        );
        setStepState('WAITING_OPTION');
        setLines(newLines);
        setInputVal('');
        return;
      }

      const val1 = firstValue!;
      let resultText = '';

      try {
        if (currentOption === '1') {
          const res = pythonCalculator.adicao(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val1)} + ${formatarNumero(val2)} = ${formatarNumero(res)}\n`;
        } else if (currentOption === '2') {
          const res = pythonCalculator.subtracao(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val1)} - ${formatarNumero(val2)} = ${formatarNumero(res)}\n`;
        } else if (currentOption === '3') {
          const res = pythonCalculator.multiplicacao(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val1)} * ${formatarNumero(val2)} = ${formatarNumero(res)}\n`;
        } else if (currentOption === '4') {
          const res = pythonCalculator.divisao(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val1)} / ${formatarNumero(val2)} = ${formatarNumero(res)}\n`;
        } else if (currentOption === '5') {
          const res = pythonCalculator.potenciacao(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val1)} ^ ${formatarNumero(val2)} = ${formatarNumero(res)}\n`;
        } else if (currentOption === '6') {
          const res = pythonCalculator.resto(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val1)} mod ${formatarNumero(val2)} = ${formatarNumero(res)}\n`;
        } else if (currentOption === '7') {
          // Option 7: porcentagem (% de um valor)
          const res = pythonCalculator.porcentagem(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val1)}% de ${formatarNumero(val2)} = ${formatarNumero(res)}\n`;
        } else if (currentOption === '8') {
          // Option 8: acréscimo (+ %)
          const res = pythonCalculator.acrescimo(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val2)} + ${formatarNumero(val1)}% = ${formatarNumero(res)}\n`;
        } else if (currentOption === '9') {
          // Option 9: desconto (- %)
          const res = pythonCalculator.desconto(val1, val2);
          resultText = `\n Resultado: ${formatarNumero(val2)} - ${formatarNumero(val1)}% = ${formatarNumero(res)}\n`;
        }

        newLines.push(
          { id: Math.random().toString(), type: 'success', text: resultText },
          { id: Math.random().toString(), type: 'output', text: MENU_TEXT },
          { id: Math.random().toString(), type: 'prompt', text: 'Escolha uma opção (0-9): ' }
        );
      } catch (err: any) {
        newLines.push(
          { id: Math.random().toString(), type: 'error', text: `\n[!] ${err.message}\n` },
          { id: Math.random().toString(), type: 'output', text: MENU_TEXT },
          { id: Math.random().toString(), type: 'prompt', text: 'Escolha uma opção (0-9): ' }
        );
      }

      setLines(newLines);
      setStepState('WAITING_OPTION');
      setCurrentOption('');
      setFirstValue(null);
      setInputVal('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUserSubmit(inputVal);
    }
  };

  const handleCopyLogs = () => {
    const raw = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar for Terminal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Terminal Python Interativo
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              python 3.12 · CLI REPL
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Simulação fidedigna da sessão descrita no item 3 do relatório com a nova opção 7 e prompts contextuais.
          </p>
        </div>

        {/* Quick Simulation Macros */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => processSequence(['7', '15', '200'])}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Reproduz a sessão exata do item 3 do relatório (15% de 200)"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Simular Caso do Relatório (15% de 200)</span>
          </button>

          <button
            onClick={restartSession}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reiniciar Sessão"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
        {/* Window Chrome Header */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-2 text-xs text-slate-400 font-mono">bash - python calculadora.py</span>
          </div>

          <button
            onClick={handleCopyLogs}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Saída'}</span>
          </button>
        </div>

        {/* Terminal Body */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="p-4 sm:p-6 min-h-[380px] max-h-[560px] overflow-y-auto space-y-1 cursor-text text-slate-200"
        >
          {lines.map((line) => {
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-slate-400 leading-relaxed">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'output') {
              return (
                <pre key={line.id} className="font-mono text-slate-300 whitespace-pre-wrap leading-tight my-1">
                  {line.text}
                </pre>
              );
            }
            if (line.type === 'prompt') {
              return (
                <span key={line.id} className="text-yellow-400 font-semibold mr-1">
                  {line.text}
                </span>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-green-400 font-bold inline">
                  {line.text}
                  <br />
                </div>
              );
            }
            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-red-400 font-medium whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'success') {
              return (
                <div key={line.id} className="text-emerald-400 font-bold text-sm sm:text-base whitespace-pre-wrap">
                  {line.text}
                </div>
              );
            }
            return null;
          })}

          {/* Interactive Input Line */}
          {stepState !== 'TERMINATED' && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-blue-400 font-bold">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="digite o comando e pressione Enter..."
                className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-xs sm:text-sm placeholder:text-slate-600"
              />
              <button
                onClick={() => handleUserSubmit(inputVal)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-sans font-medium flex items-center gap-1 transition-colors"
              >
                <span>Enviar</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Helpful Pre-made Scenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => processSequence(['7', '25', '80'])}
          className="p-3 text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-400 transition-colors"
        >
          <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
            Teste: 25% de 80
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Opção 7 · Taxa 25 · Base 80 · Resultado 20
          </div>
        </button>

        <button
          onClick={() => processSequence(['4', '10', '0'])}
          className="p-3 text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-red-400 transition-colors"
        >
          <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Tratamento de ZeroDivisionError</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Opção 4 · 10 / 0 · Dispara erro tratado
          </div>
        </button>

        <button
          onClick={() => processSequence(['7', 'abc'])}
          className="p-3 text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-amber-400 transition-colors"
        >
          <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
            Tratamento de ValueError
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Input texto "abc" · Captura sem crash
          </div>
        </button>
      </div>
    </div>
  );
};
