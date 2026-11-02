import { CalculationResult, OperationMeta, OperationType } from '../types/calculator';

/**
 * Formata números para evitar .0 em inteiros (conforme a função formatar_numero de calculadora.py)
 */
export function formatarNumero(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Remove zeros redundantes e limita casas decimais a 6
  const fixed = Number(num.toFixed(6));
  return fixed.toString();
}

/**
 * Operações matemáticas centrais
 */
export const pythonCalculator = {
  adicao: (a: number, b: number): number => a + b,
  subtracao: (a: number, b: number): number => a - b,
  multiplicacao: (a: number, b: number): number => a * b,
  divisao: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('Erro: divisão por zero não é permitida.');
    }
    return a / b;
  },
  potenciacao: (a: number, b: number): number => Math.pow(a, b),
  resto: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('Erro: resto da divisão por zero não é permitido.');
    }
    return a % b;
  },
  // Função adicionada no relatório (Opção 7)
  porcentagem: (taxa: number, valor: number): number => {
    return (taxa * valor) / 100;
  },
  // Evoluções sugeridas no relatório
  acrescimo: (taxa: number, valor: number): number => {
    const aumento = (taxa * valor) / 100;
    return valor + aumento;
  },
  desconto: (taxa: number, valor: number): number => {
    const abatimento = (taxa * valor) / 100;
    return valor - abatimento;
  },
  variacao: (inicial: number, final: number): number => {
    if (inicial === 0) {
      throw new Error('Erro: valor inicial não pode ser zero para cálculo de variação.');
    }
    return ((final - inicial) / inicial) * 100;
  },
};

/**
 * Metadados detalhados das operações com prompts contextuais em português
 */
export const OPERATIONS_CATALOG: Record<OperationType, OperationMeta> = {
  adicao: {
    id: 'adicao',
    key: '1',
    name: 'Adição',
    symbol: '+',
    cliOption: '1. Adição (+)',
    description: 'Soma dois números reais ou inteiros.',
    firstPrompt: 'Digite o primeiro número:',
    secondPrompt: 'Digite o segundo número:',
  },
  subtracao: {
    id: 'subtracao',
    key: '2',
    name: 'Subtração',
    symbol: '-',
    cliOption: '2. Subtração (-)',
    description: 'Subtrai o segundo número do primeiro.',
    firstPrompt: 'Digite o primeiro número:',
    secondPrompt: 'Digite o segundo número:',
  },
  multiplicacao: {
    id: 'multiplicacao',
    key: '3',
    name: 'Multiplicação',
    symbol: '*',
    cliOption: '3. Multiplicação (*)',
    description: 'Multiplica dois valores numéricos.',
    firstPrompt: 'Digite o primeiro número:',
    secondPrompt: 'Digite o segundo número:',
  },
  divisao: {
    id: 'divisao',
    key: '4',
    name: 'Divisão',
    symbol: '/',
    cliOption: '4. Divisão (/)',
    description: 'Divide o primeiro valor pelo segundo (com validação de zero).',
    firstPrompt: 'Digite o numerador (dividendo):',
    secondPrompt: 'Digite o denominador (divisor):',
  },
  potenciacao: {
    id: 'potenciacao',
    key: '5',
    name: 'Potenciação',
    symbol: '^',
    cliOption: '5. Potenciação (^)',
    description: 'Eleva a base ao expoente fornecido.',
    firstPrompt: 'Digite a base:',
    secondPrompt: 'Digite o expoente:',
  },
  resto: {
    id: 'resto',
    key: '6',
    name: 'Resto da Divisão',
    symbol: 'mod',
    cliOption: '6. Resto da Divisão (mod)',
    description: 'Calcula o resto da divisão inteira (módulo). Notação "mod" para evitar confusão com %.',
    firstPrompt: 'Digite o dividendo:',
    secondPrompt: 'Digite o divisor:',
  },
  porcentagem: {
    id: 'porcentagem',
    key: '7',
    name: 'Porcentagem',
    symbol: '% de',
    cliOption: '7. Porcentagem (% de um valor)',
    description: 'Calcula a porcentagem específica de um valor base: (taxa * valor) / 100.',
    firstPrompt: 'Digite a taxa da porcentagem (ex: 15 para 15%):',
    secondPrompt: 'Digite o valor base:',
  },
  acrescimo: {
    id: 'acrescimo',
    key: '8',
    name: 'Acréscimo Percentual',
    symbol: '+ % em',
    cliOption: '8. Acréscimo (+ %)',
    description: 'Aplica um acréscimo percentual ao valor base: valor + (taxa * valor / 100).',
    firstPrompt: 'Digite a taxa de acréscimo (ex: 10 para +10%):',
    secondPrompt: 'Digite o valor base:',
  },
  desconto: {
    id: 'desconto',
    key: '9',
    name: 'Desconto Percentual',
    symbol: '- % em',
    cliOption: '9. Desconto (- %)',
    description: 'Aplica um desconto percentual ao valor base: valor - (taxa * valor / 100).',
    firstPrompt: 'Digite a taxa de desconto (ex: 15 para -15%):',
    secondPrompt: 'Digite o valor base original:',
  },
  variacao: {
    id: 'variacao',
    key: 'v',
    name: 'Variação Percentual',
    symbol: 'var %',
    cliOption: 'Variação (%) entre dois valores',
    description: 'Calcula o crescimento ou queda percentual entre valor inicial e valor final.',
    firstPrompt: 'Digite o valor inicial:',
    secondPrompt: 'Digite o valor final:',
  },
};

/**
 * Executa uma operação matemática e retorna o resultado formatado
 */
export function executarCalculo(
  op: OperationType,
  a: number,
  b: number
): CalculationResult {
  const meta = OPERATIONS_CATALOG[op];
  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = Date.now();

  try {
    let result = 0;
    let displayFormula = '';
    let stepsExplanation = '';

    switch (op) {
      case 'adicao':
        result = pythonCalculator.adicao(a, b);
        displayFormula = `${formatarNumero(a)} + ${formatarNumero(b)} = ${formatarNumero(result)}`;
        stepsExplanation = `Soma simples: ${formatarNumero(a)} + ${formatarNumero(b)}`;
        break;
      case 'subtracao':
        result = pythonCalculator.subtracao(a, b);
        displayFormula = `${formatarNumero(a)} - ${formatarNumero(b)} = ${formatarNumero(result)}`;
        stepsExplanation = `Diferença entre ${formatarNumero(a)} e ${formatarNumero(b)}`;
        break;
      case 'multiplicacao':
        result = pythonCalculator.multiplicacao(a, b);
        displayFormula = `${formatarNumero(a)} * ${formatarNumero(b)} = ${formatarNumero(result)}`;
        stepsExplanation = `Produto: ${formatarNumero(a)} × ${formatarNumero(b)}`;
        break;
      case 'divisao':
        result = pythonCalculator.divisao(a, b);
        displayFormula = `${formatarNumero(a)} / ${formatarNumero(b)} = ${formatarNumero(result)}`;
        stepsExplanation = `Divisão: ${formatarNumero(a)} ÷ ${formatarNumero(b)}`;
        break;
      case 'potenciacao':
        result = pythonCalculator.potenciacao(a, b);
        displayFormula = `${formatarNumero(a)} ^ ${formatarNumero(b)} = ${formatarNumero(result)}`;
        stepsExplanation = `Base ${formatarNumero(a)} elevada ao expoente ${formatarNumero(b)}`;
        break;
      case 'resto':
        result = pythonCalculator.resto(a, b);
        displayFormula = `${formatarNumero(a)} mod ${formatarNumero(b)} = ${formatarNumero(result)}`;
        stepsExplanation = `Resto inteiro da divisão de ${formatarNumero(a)} por ${formatarNumero(b)}`;
        break;
      case 'porcentagem':
        // a = taxa, b = valor base
        result = pythonCalculator.porcentagem(a, b);
        displayFormula = `${formatarNumero(a)}% de ${formatarNumero(b)} = ${formatarNumero(result)}`;
        stepsExplanation = `(${formatarNumero(a)} × ${formatarNumero(b)}) / 100 = ${formatarNumero(a * b)} / 100 = ${formatarNumero(result)}`;
        break;
      case 'acrescimo':
        // a = taxa, b = valor base
        result = pythonCalculator.acrescimo(a, b);
        const acrescimoParcial = (a * b) / 100;
        displayFormula = `${formatarNumero(b)} + ${formatarNumero(a)}% = ${formatarNumero(result)}`;
        stepsExplanation = `Valor base (${formatarNumero(b)}) + acréscimo de ${formatarNumero(a)}% (${formatarNumero(acrescimoParcial)}) = ${formatarNumero(result)}`;
        break;
      case 'desconto':
        // a = taxa, b = valor base
        result = pythonCalculator.desconto(a, b);
        const descontoParcial = (a * b) / 100;
        displayFormula = `${formatarNumero(b)} - ${formatarNumero(a)}% = ${formatarNumero(result)}`;
        stepsExplanation = `Valor base (${formatarNumero(b)}) - desconto de ${formatarNumero(a)}% (${formatarNumero(descontoParcial)}) = ${formatarNumero(result)}`;
        break;
      case 'variacao':
        // a = inicial, b = final
        result = pythonCalculator.variacao(a, b);
        displayFormula = `Variação de ${formatarNumero(a)} para ${formatarNumero(b)} = ${formatarNumero(result)}%`;
        stepsExplanation = `((${formatarNumero(b)} - ${formatarNumero(a)}) / ${formatarNumero(a)}) × 100 = ${formatarNumero(result)}%`;
        break;
    }

    return {
      id,
      timestamp,
      operation: op,
      operandA: a,
      operandB: b,
      result,
      formattedResult: formatarNumero(result),
      displayFormula,
      stepsExplanation,
      isError: false,
    };
  } catch (err: any) {
    return {
      id,
      timestamp,
      operation: op,
      operandA: a,
      operandB: b,
      result: 0,
      formattedResult: 'Erro',
      displayFormula: `${formatarNumero(a)} ${meta.symbol} ${formatarNumero(b)}`,
      errorMessage: err?.message || 'Erro durante a operação',
      isError: true,
    };
  }
}

/**
 * Código Python original e documentado de calculadora.py
 */
export const PYTHON_CODE_CALCULADORA = `"""
calculadora.py
Calculadora interativa via CLI em Python.
Atualizada com suporte a porcentagem, acréscimo, desconto e tratamento de erros.
"""

def adicao(a, b):
    return a + b

def subtracao(a, b):
    return a - b

def multiplicacao(a, b):
    return a * b

def divisao(a, b):
    if b == 0:
        raise ZeroDivisionError("Erro: divisão por zero não é permitida.")
    return a / b

def potenciacao(a, b):
    return a ** b

def resto(a, b):
    if b == 0:
        raise ZeroDivisionError("Erro: resto da divisão por zero não é permitido.")
    return a % b

def porcentagem(taxa, valor):
    """Calcula a taxa percentual de um valor base."""
    return (taxa * valor) / 100

def acrescimo(taxa, valor):
    """Calcula o valor original acrescido da porcentagem."""
    return valor + ((taxa * valor) / 100)

def desconto(taxa, valor):
    """Calcula o valor original com dedução da porcentagem."""
    return valor - ((taxa * valor) / 100)

def formatar_numero(num):
    """Remove zeros desnecessários (.0) em números inteiros."""
    if isinstance(num, (int, float)) and num == int(num):
        return str(int(num))
    return f"{num:.4f}".rstrip('0').rstrip('.')

def exibir_menu():
    print("=" * 30)
    print("      CALCULADORA EM PYTHON")
    print("=" * 30)
    print("1. Adição (+)")
    print("2. Subtração (-)")
    print("3. Multiplicação (*)")
    print("4. Divisão (/)")
    print("5. Potenciação (^)")
    print("6. Resto da Divisão (mod)")
    print("7. Porcentagem (% de um valor)")
    print("8. Acréscimo (+ %)")
    print("9. Desconto (- %)")
    print("0. Sair")
    print("=" * 30)

def executar_cli():
    operacoes = {
        '1': (adicao, '+', 'Digite o primeiro número: ', 'Digite o segundo número: '),
        '2': (subtracao, '-', 'Digite o primeiro número: ', 'Digite o segundo número: '),
        '3': (multiplicacao, '*', 'Digite o primeiro número: ', 'Digite o segundo número: '),
        '4': (divisao, '/', 'Digite o numerador: ', 'Digite o denominador: '),
        '5': (potenciacao, '^', 'Digite a base: ', 'Digite o expoente: '),
        '6': (resto, 'mod', 'Digite o dividendo: ', 'Digite o divisor: '),
        '7': (porcentagem, '% de', 'Digite a taxa da porcentagem (ex: 15 para 15%): ', 'Digite o valor base: '),
        '8': (acrescimo, '+ % em', 'Digite a taxa de acréscimo: ', 'Digite o valor base: '),
        '9': (desconto, '- % em', 'Digite a taxa de desconto: ', 'Digite o valor base: '),
    }

    while True:
        exibir_menu()
        opcao = input("Escolha uma opção (0-9): ").strip()

        if opcao == '0':
            print("\\nEncerrando a calculadora. Até mais!")
            break

        if opcao not in operacoes:
            print("\\n[!] Opção inválida! Escolha entre 0 e 9.\\n")
            continue

        func, rotulo, prompt1, prompt2 = operacoes[opcao]

        try:
            val1 = float(input(prompt1))
            val2 = float(input(prompt2))
            resultado = func(val1, val2)

            if opcao == '7':
                print(f"\\n Resultado: {formatar_numero(val1)}% de {formatarNumero(val2)} = {formatar_numero(resultado)}\\n")
            elif opcao == '8':
                print(f"\\n Resultado: {formatar_numero(val2)} + {formatar_numero(val1)}% = {formatar_numero(resultado)}\\n")
            elif opcao == '9':
                print(f"\\n Resultado: {formatar_numero(val2)} - {formatar_numero(val1)}% = {formatar_numero(resultado)}\\n")
            else:
                print(f"\\n Resultado: {formatar_numero(val1)} {rotulo} {formatar_numero(val2)} = {formatar_numero(resultado)}\\n")

        except ValueError:
            print("\\n[!] Erro de Entrada: Digite apenas números válidos.\\n")
        except ZeroDivisionError as err:
            print(f"\\n[!] {err}\\n")

if __name__ == '__main__':
    executar_cli()
`;

/**
 * Código Python da suíte de testes unitários test_calculadora.py
 */
export const PYTHON_CODE_TESTS = `"""
test_calculadora.py
Suíte de testes automatizados com unittest para a Calculadora Python.
Validação de operações matemáticas, casos de borda e nova funcionalidade de porcentagem.
"""

import unittest
from calculadora import (
    adicao,
    subtracao,
    multiplicacao,
    divisao,
    potenciacao,
    resto,
    porcentagem,
    acrescimo,
    desconto,
    formatar_numero
)

class TestCalculadora(unittest.TestCase):

    def test_formatar_numero(self):
        """Verifica a remoção de zeros (.0) em inteiros e preservação de decimais."""
        self.assertEqual(formatar_numero(20.0), "20")
        self.assertEqual(formatar_numero(200), "200")
        self.assertEqual(formatar_numero(22.5), "22.5")
        self.assertEqual(formatar_numero(0.0), "0")

    def test_operacoes_existentes(self):
        """Testa adição, subtração, multiplicação, divisão, potência e resto."""
        # Adição
        self.assertEqual(adicao(10, 5), 15)
        self.assertEqual(adicao(-3, 3), 0)

        # Subtração
        self.assertEqual(subtracao(10, 4), 6)

        # Multiplicação
        self.assertEqual(multiplicacao(6, 7), 42)

        # Divisão
        self.assertEqual(divisao(10, 2), 5)
        self.assertAlmostEqual(divisao(7, 2), 3.5)
        with self.assertRaises(ZeroDivisionError):
            divisao(10, 0)

        # Potenciação
        self.assertEqual(potenciacao(2, 3), 8)
        self.assertEqual(potenciacao(5, 0), 1)

        # Resto (mod)
        self.assertEqual(resto(10, 3), 1)
        with self.assertRaises(ZeroDivisionError):
            resto(10, 0)

    def test_porcentagem(self):
        """Bateria de testes da funcionalidade de porcentagem (Opção 7)."""
        # Casos do relatório
        self.assertEqual(porcentagem(10, 200), 20)      # 10% de 200 = 20
        self.assertEqual(porcentagem(25, 80), 20)       # 25% de 80 = 20
        self.assertEqual(porcentagem(15, 150), 22.5)    # 15% de 150 = 22.5
        self.assertEqual(porcentagem(0, 500), 0)        # 0% de 500 = 0 (borda zero)
        self.assertEqual(porcentagem(100, 42), 42)      # 100% de 42 = 42 (borda total)
        self.assertEqual(porcentagem(15, 200), 30)      # 15% de 200 = 30 (caso CLI)

    def test_acrescimo_e_desconto(self):
        """Verifica as evoluções de acréscimo (+ %) e desconto (- %)."""
        # Acréscimo (ex: 200 + 10% = 220)
        self.assertEqual(acrescimo(10, 200), 220)
        self.assertEqual(acrescimo(50, 100), 150)

        # Desconto (ex: 200 - 15% = 170)
        self.assertEqual(desconto(15, 200), 170)
        self.assertEqual(desconto(20, 50), 40)

if __name__ == '__main__':
    unittest.main()
`;
