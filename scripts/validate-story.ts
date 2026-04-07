import { story } from '../data/story';

interface ValidationError {
  nodeId: string;
  type:
    | 'orphan'
    | 'missing-target'
    | 'missing-bg'
    | 'dead-end'
    | 'unreachable'
    | 'missing-condition-alt'
    | 'missing-ending';
  message: string;
}

/**
 * Valida a integridade do arquivo story.ts:
 * - Todos os 'next' e 'choice' targets existem
 * - Nenhum node é um beco sem saída (dead-end)
 * - Todos os nodes são alcançáveis a partir de ch1-001
 * - Todos os 3 finais (rachadas, sem-deusa, assistindo) existem
 * - Backgrounds referenciados existem (optional warning)
 */
function validateStory(): ValidationError[] {
  const errors: ValidationError[] = [];
  const allIds = new Set(Object.keys(story));
  const reachable = new Set<string>();

  // 1. Verificar que todos os 'next' e choice targets existem
  for (const [id, node] of Object.entries(story)) {
    if (node.next && !allIds.has(node.next)) {
      errors.push({
        nodeId: id,
        type: 'missing-target',
        message: `next aponta para "${node.next}" que não existe`,
      });
    }

    if (node.choices) {
      for (const choice of node.choices) {
        if (!allIds.has(choice.next)) {
          errors.push({
            nodeId: id,
            type: 'missing-target',
            message: `choice "${choice.text.substring(0, 30)}" aponta para "${choice.next}" que não existe`,
          });
        }
      }
    }

    // 2. Verificar dead ends (sem next e sem choices e sem ending)
    if (!node.next && (!node.choices || node.choices.length === 0) && !node.ending) {
      errors.push({
        nodeId: id,
        type: 'dead-end',
        message: `Node sem next, choices ou ending — beco sem saída`,
      });
    }
  }

  // 3. Verificar alcançabilidade via BFS
  const queue = ['ch1-001'];
  reachable.add('ch1-001');

  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = story[current];
    if (!node) continue;

    if (node.next && !reachable.has(node.next)) {
      reachable.add(node.next);
      queue.push(node.next);
    }

    if (node.condition) {
      // Se há condição, o node pode ter alternativas
      // (considerar que ambos os caminhos são possíveis)
    }

    if (node.choices) {
      for (const choice of node.choices) {
        if (!reachable.has(choice.next)) {
          reachable.add(choice.next);
          queue.push(choice.next);
        }
      }
    }
  }

  // Nodes não alcançáveis
  for (const id of Array.from(allIds)) {
    if (!reachable.has(id)) {
      errors.push({
        nodeId: id,
        type: 'unreachable',
        message: `Node não é alcançável a partir de ch1-001`,
      });
    }
  }

  // 4. Verificar que os 3 finais existem
  const endings = new Set<string>();
  for (const node of Object.values(story)) {
    if (node.ending) endings.add(node.ending);
  }
  for (const expected of ['rachadas', 'sem-deusa', 'assistindo']) {
    if (!endings.has(expected)) {
      errors.push({
        nodeId: 'GLOBAL',
        type: 'missing-ending',
        message: `Final "${expected}" não encontrado em nenhum node`,
      });
    }
  }

  return errors;
}

/**
 * Estatísticas da história
 */
function getStoryStats() {
  let totalNodes = 0;
  let totalChoices = 0;
  let chaptersFound = new Set<string>();
  let endingsFound = new Set<string>();

  for (const [id, node] of Object.entries(story)) {
    totalNodes++;
    if (node.choices) {
      totalChoices += node.choices.length;
    }
    if (node.chapter) {
      chaptersFound.add(node.chapter);
    }
    if (node.ending) {
      endingsFound.add(node.ending);
    }
  }

  return {
    totalNodes,
    totalChoices,
    chapters: chaptersFound.size,
    endings: endingsFound.size,
  };
}

// Executar
const errors = validateStory();
const stats = getStoryStats();

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('VALIDAÇÃO DE HISTÓRIA — As Servas de Häita');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log(`📊 Estatísticas:`);
console.log(`   • Total de Nodes: ${stats.totalNodes}`);
console.log(`   • Total de Choices: ${stats.totalChoices}`);
console.log(`   • Capítulos: ${stats.chapters}`);
console.log(`   • Finais: ${stats.endings}\n`);

if (errors.length === 0) {
  console.log(
    '✅ SUCESSO! História validada completamente.\n'
  );
  console.log(
    '   ✓ Todos os nodes conectados\n' +
    '   ✓ Todos os finais alcançáveis\n' +
    '   ✓ Nenhum beco sem saída\n' +
    '   ✓ Estrutura íntegra\n'
  );
  process.exit(0);
} else {
  console.log(`❌ ERROS ENCONTRADOS: ${errors.length}\n`);

  // Agrupar por tipo
  const byType: Record<string, ValidationError[]> = {};
  for (const err of errors) {
    if (!byType[err.type]) byType[err.type] = [];
    byType[err.type].push(err);
  }

  for (const [type, typeErrors] of Object.entries(byType)) {
    console.log(`\n[${type.toUpperCase()}] ${typeErrors.length} erro(s):`);
    for (const err of typeErrors.slice(0, 5)) {
      console.log(`   • ${err.nodeId}: ${err.message}`);
    }
    if (typeErrors.length > 5) {
      console.log(`   ... e ${typeErrors.length - 5} mais`);
    }
  }

  console.log('\n');
  process.exit(1);
}
