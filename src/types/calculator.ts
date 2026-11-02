export type OperationType =
  | 'adicao'
  | 'subtracao'
  | 'multiplicacao'
  | 'divisao'
  | 'potenciacao'
  | 'resto'
  | 'porcentagem'
  | 'acrescimo'
  | 'desconto'
  | 'variacao';

export interface OperationMeta {
  id: OperationType;
  key: string;
  name: string;
  symbol: string;
  cliOption: string;
  description: string;
  firstPrompt: string;
  secondPrompt: string;
}

export interface CalculationResult {
  id: string;
  timestamp: number;
  operation: OperationType;
  operandA: number;
  operandB: number;
  result: number;
  formattedResult: string;
  displayFormula: string;
  stepsExplanation?: string;
  isError?: boolean;
  errorMessage?: string;
}

export interface TestCase {
  id: string;
  suite: string;
  name: string;
  code: string;
  expected: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  durationMs?: number;
  assertionCount: number;
  error?: string;
}

export interface CliLine {
  id: string;
  type: 'system' | 'output' | 'input' | 'prompt' | 'error' | 'success';
  text: string;
}
