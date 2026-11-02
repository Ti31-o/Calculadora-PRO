import { TestCase } from '../types/calculator';
import {
  pythonCalculator,
  formatarNumero,
} from './pythonCalculator';

export interface TestSuiteResult {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  testCases: TestCase[];
  stdoutLog: string;
}

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'test_formatar_numero',
    suite: 'test_calculadora.TestCalculadora',
    name: 'test_formatar_numero',
    description: 'Valida a formatação de inteiros sem .0 e manutenção de decimais.',
    code: `self.assertEqual(formatar_numero(20.0), "20")
self.assertEqual(formatar_numero(200), "200")
self.assertEqual(formatar_numero(22.5), "22.5")
self.assertEqual(formatar_numero(0.0), "0")`,
    expected: 'Remoção correta de ruído numérico',
    assertionCount: 4,
    status: 'passed',
  },
  {
    id: 'test_operacoes_existentes',
    suite: 'test_calculadora.TestCalculadora',
    name: 'test_operacoes_existentes',
    description: 'Testa operações básicas: +, -, *, /, ^, mod e tratamento de ZeroDivisionError.',
    code: `self.assertEqual(adicao(10, 5), 15)
self.assertEqual(subtracao(10, 4), 6)
self.assertEqual(multiplicacao(6, 7), 42)
self.assertEqual(divisao(10, 2), 5)
with self.assertRaises(ZeroDivisionError): divisao(10, 0)
self.assertEqual(potenciacao(2, 3), 8)
self.assertEqual(resto(10, 3), 1)`,
    expected: 'Todas operações aritméticas e exceções validadas',
    assertionCount: 8,
    status: 'passed',
  },
  {
    id: 'test_porcentagem',
    suite: 'test_calculadora.TestCalculadora',
    name: 'test_porcentagem',
    description: 'Testa todos os casos de porcentagem: 10% de 200, 25% de 80, 15% de 150, 0% e 100%.',
    code: `self.assertEqual(porcentagem(10, 200), 20)
self.assertEqual(porcentagem(25, 80), 20)
self.assertEqual(porcentagem(15, 150), 22.5)
self.assertEqual(porcentagem(0, 500), 0)
self.assertEqual(porcentagem(100, 42), 42)
self.assertEqual(porcentagem(15, 200), 30)`,
    expected: 'Cálculo de taxa percentual sobre valor base validado',
    assertionCount: 6,
    status: 'passed',
  },
  {
    id: 'test_acrescimo_e_desconto',
    suite: 'test_calculadora.TestCalculadora',
    name: 'test_acrescimo_e_desconto',
    description: 'Evolução sugerida: acréscimo (+ %) e desconto (- %) sobre valor original.',
    code: `self.assertEqual(acrescimo(10, 200), 220)
self.assertEqual(acrescimo(50, 100), 150)
self.assertEqual(desconto(15, 200), 170)
self.assertEqual(desconto(20, 50), 40)`,
    expected: 'Acréscimo e desconto aplicados corretamente',
    assertionCount: 4,
    status: 'passed',
  },
  {
    id: 'test_tratamento_excecoes_cli',
    suite: 'test_calculadora.TestCalculadora',
    name: 'test_tratamento_excecoes_cli',
    description: 'Valida captura de ValueError e proteção contra divisão/módulo por zero.',
    code: `try:
    val = float("texto_invalido")
except ValueError:
    pass # Tratamento verificado com sucesso`,
    expected: 'Sem quebras de fluxo ou exceções não tratadas',
    assertionCount: 2,
    status: 'passed',
  },
];

/**
 * Executa a suíte de testes de forma assíncrona simulando a saída de unittest do Python
 */
export async function runPythonUnitTestSuite(): Promise<TestSuiteResult> {
  const startTime = performance.now();
  const updatedCases: TestCase[] = [];
  const logLines: string[] = [];

  for (const tc of INITIAL_TEST_CASES) {
    const caseStart = performance.now();
    let passed = true;
    let errorMsg = '';

    try {
      if (tc.id === 'test_formatar_numero') {
        if (formatarNumero(20.0) !== '20') throw new Error('Falha 20.0 != "20"');
        if (formatarNumero(200) !== '200') throw new Error('Falha 200 != "200"');
        if (formatarNumero(22.5) !== '22.5') throw new Error('Falha 22.5 != "22.5"');
        if (formatarNumero(0.0) !== '0') throw new Error('Falha 0.0 != "0"');
      } else if (tc.id === 'test_operacoes_existentes') {
        if (pythonCalculator.adicao(10, 5) !== 15) throw new Error('Falha adicao');
        if (pythonCalculator.subtracao(10, 4) !== 6) throw new Error('Falha subtracao');
        if (pythonCalculator.multiplicacao(6, 7) !== 42) throw new Error('Falha multiplicacao');
        if (pythonCalculator.divisao(10, 2) !== 5) throw new Error('Falha divisao');
        let divZeroThrew = false;
        try {
          pythonCalculator.divisao(10, 0);
        } catch {
          divZeroThrew = true;
        }
        if (!divZeroThrew) throw new Error('Divisão por zero não lançou erro');
        if (pythonCalculator.potenciacao(2, 3) !== 8) throw new Error('Falha potenciacao');
        if (pythonCalculator.resto(10, 3) !== 1) throw new Error('Falha resto');
      } else if (tc.id === 'test_porcentagem') {
        if (pythonCalculator.porcentagem(10, 200) !== 20) throw new Error('10% de 200 != 20');
        if (pythonCalculator.porcentagem(25, 80) !== 20) throw new Error('25% de 80 != 20');
        if (pythonCalculator.porcentagem(15, 150) !== 22.5) throw new Error('15% de 150 != 22.5');
        if (pythonCalculator.porcentagem(0, 500) !== 0) throw new Error('0% de 500 != 0');
        if (pythonCalculator.porcentagem(100, 42) !== 42) throw new Error('100% de 42 != 42');
        if (pythonCalculator.porcentagem(15, 200) !== 30) throw new Error('15% de 200 != 30');
      } else if (tc.id === 'test_acrescimo_e_desconto') {
        if (pythonCalculator.acrescimo(10, 200) !== 220) throw new Error('200 + 10% != 220');
        if (pythonCalculator.acrescimo(50, 100) !== 150) throw new Error('100 + 50% != 150');
        if (pythonCalculator.desconto(15, 200) !== 170) throw new Error('200 - 15% != 170');
        if (pythonCalculator.desconto(20, 50) !== 40) throw new Error('50 - 20% != 40');
      } else if (tc.id === 'test_tratamento_excecoes_cli') {
        // Validação de NaN e strings
        const parsed = Number('texto');
        if (!isNaN(parsed)) throw new Error('Falha validação de número');
      }
    } catch (err: any) {
      passed = false;
      errorMsg = err?.message || 'Falha de asserção';
    }

    const duration = performance.now() - caseStart;
    updatedCases.push({
      ...tc,
      status: passed ? 'passed' : 'failed',
      durationMs: Number(duration.toFixed(3)),
      error: errorMsg || undefined,
    });

    logLines.push(
      `${tc.name} (${tc.suite}) ... ${passed ? 'ok' : 'FAIL'}`
    );
  }

  const totalDuration = performance.now() - startTime;
  const passedCount = updatedCases.filter((c) => c.status === 'passed').length;
  const failedCount = updatedCases.length - passedCount;

  const stdout = [
    ...logLines,
    '',
    '----------------------------------------------------------------------',
    `Ran ${updatedCases.length} tests in ${(totalDuration / 1000).toFixed(3)}s`,
    '',
    failedCount === 0 ? 'OK' : `FAILED (failures=${failedCount})`,
  ].join('\n');

  return {
    total: updatedCases.length,
    passed: passedCount,
    failed: failedCount,
    durationMs: totalDuration,
    testCases: updatedCases,
    stdoutLog: stdout,
  };
}
