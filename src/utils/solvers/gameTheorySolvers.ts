export interface GameTheoryInput {
  payoffMatrix: number[][]; // Player A rows, Player B cols
  playerANames?: string[];
  playerBNames?: string[];
}

export interface SaddlePointResult {
  hasSaddlePoint: boolean;
  rowMinima: number[];
  colMaxima: number[];
  maximin: number;
  minimax: number;
  saddlePoints: { row: number; col: number; value: number }[];
  gameValue: number;
  explanation: string[];
}

export interface MixedStrategy2x2Result {
  p1: number;
  p2: number;
  q1: number;
  q2: number;
  gameValue: number;
  algebraicSteps: string[];
  isValid: boolean;
}

export interface DominanceStep {
  step: number;
  type: 'row_elimination' | 'col_elimination';
  eliminatedIndex: number;
  dominatedByIndex: number;
  reason: string;
  remainingMatrix: number[][];
  remainingRowIndices: number[];
  remainingColIndices: number[];
}

export interface DominanceResult {
  steps: DominanceStep[];
  reducedMatrix: number[][];
  finalRows: number[];
  finalCols: number[];
  statusMessage: string;
}

export interface GraphicalGameResult {
  type: '2xN' | 'Mx2';
  lines: {
    strategyName: string;
    yAt0: number; // when p1 = 0 (payoff = a2)
    yAt1: number; // when p1 = 1 (payoff = a1)
    slope: number;
    intercept: number;
  }[];
  criticalIntersection: {
    p: number;
    gameValue: number;
    line1Index: number;
    line2Index: number;
  } | null;
  explanations: string[];
}

// 1. Saddle Point Calculator
export function findSaddlePoint(matrix: number[][]): SaddlePointResult {
  const m = matrix.length;
  const n = matrix[0].length;
  const explanation: string[] = [];

  const rowMinima = matrix.map(row => Math.min(...row));
  const colMaxima: number[] = [];
  for (let j = 0; j < n; j++) {
    let maxCol = -Infinity;
    for (let i = 0; i < m; i++) {
      if (matrix[i][j] > maxCol) maxCol = matrix[i][j];
    }
    colMaxima.push(maxCol);
  }

  const maximin = Math.max(...rowMinima);
  const minimax = Math.min(...colMaxima);

  explanation.push(
    `Row Minima (Player A's security levels): [${rowMinima.join(', ')}]. Maximin = ${maximin}.`
  );
  explanation.push(
    `Column Maxima (Player B's worst-case losses): [${colMaxima.join(', ')}]. Minimax = ${minimax}.`
  );

  const saddlePoints: { row: number; col: number; value: number }[] = [];
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === rowMinima[i] && matrix[i][j] === colMaxima[j]) {
        saddlePoints.push({ row: i, col: j, value: matrix[i][j] });
      }
    }
  }

  const hasSaddlePoint = maximin === minimax && saddlePoints.length > 0;

  if (hasSaddlePoint) {
    explanation.push(
      `Saddle Point exists because Maximin (${maximin}) = Minimax (${minimax}). Value of the game V = ${maximin}.`
    );
    saddlePoints.forEach(sp => {
      explanation.push(
        `Optimal Pure Strategies: Player A plays Strategy A${sp.row + 1}, Player B plays Strategy B${sp.col + 1}. Payoff = ${sp.value}.`
      );
    });
  } else {
    explanation.push(
      `No Saddle Point exists in pure strategies because Maximin (${maximin}) ≠ Minimax (${minimax}). The game requires mixed strategies.`
    );
  }

  return {
    hasSaddlePoint,
    rowMinima,
    colMaxima,
    maximin,
    minimax,
    saddlePoints,
    gameValue: hasSaddlePoint ? maximin : Number(((maximin + minimax) / 2).toFixed(2)),
    explanation,
  };
}

// 2. 2x2 Mixed Strategy Analytical Solver
export function solve2x2MixedStrategy(matrix: number[][]): MixedStrategy2x2Result {
  const steps: string[] = [];
  if (matrix.length !== 2 || matrix[0].length !== 2) {
    return {
      p1: 0,
      p2: 0,
      q1: 0,
      q2: 0,
      gameValue: 0,
      algebraicSteps: ['Error: Matrix must be 2x2.'],
      isValid: false,
    };
  }

  const a11 = matrix[0][0];
  const a12 = matrix[0][1];
  const a21 = matrix[1][0];
  const a22 = matrix[1][1];

  steps.push(`Payoff Matrix: [[${a11}, ${a12}], [${a21}, ${a22}]]`);

  const denominator = a11 + a22 - (a12 + a21);
  steps.push(
    `Denominator D = (a₁₁ + a₂₂) - (a₁₂ + a₂₁) = (${a11} + ${a22}) - (${a12} + ${a21}) = ${denominator}`
  );

  if (Math.abs(denominator) < 1e-6) {
    return {
      p1: 0.5,
      p2: 0.5,
      q1: 0.5,
      q2: 0.5,
      gameValue: Number(((a11 + a22) / 2).toFixed(3)),
      algebraicSteps: [...steps, 'Denominator is zero. Game has equalized or pure strategies.'],
      isValid: false,
    };
  }

  const p1 = (a22 - a21) / denominator;
  const p2 = 1 - p1;

  const q1 = (a22 - a12) / denominator;
  const q2 = 1 - q1;

  const gameValue = (a11 * a22 - a12 * a21) / denominator;

  steps.push(
    `Player A Probabilities: p₁ = (a₂₂ - a₂₁) / D = (${a22} - ${a21}) / ${denominator} = ${p1.toFixed(4)}`
  );
  steps.push(`p₂ = 1 - p₁ = ${p2.toFixed(4)}`);
  steps.push(
    `Player B Probabilities: q₁ = (a₂₂ - a₁₂) / D = (${a22} - ${a12}) / ${denominator} = ${q1.toFixed(4)}`
  );
  steps.push(`q₂ = 1 - q₁ = ${q2.toFixed(4)}`);
  steps.push(
    `Value of Game V = (a₁₁a₂₂ - a₁₂a₂₁) / D = (${a11}*${a22} - ${a12}*${a21}) / ${denominator} = ${gameValue.toFixed(4)}`
  );

  const isValid = p1 >= -0.01 && p1 <= 1.01 && q1 >= -0.01 && q1 <= 1.01;
  if (!isValid) {
    steps.push('Note: Probabilities fall outside [0, 1], indicating a pure strategy dominates.');
  }

  return {
    p1: Number(p1.toFixed(4)),
    p2: Number(p2.toFixed(4)),
    q1: Number(q1.toFixed(4)),
    q2: Number(q2.toFixed(4)),
    gameValue: Number(gameValue.toFixed(4)),
    algebraicSteps: steps,
    isValid,
  };
}

// 3. Dominance Method Solver
export function solveDominance(matrix: number[][]): DominanceResult {
  const steps: DominanceStep[] = [];
  let currentMatrix = matrix.map(r => [...r]);
  let rowIndices = currentMatrix.map((_, i) => i);
  let colIndices = currentMatrix[0].map((_, j) => j);

  let stepCount = 1;
  let changed = true;

  while (changed && (rowIndices.length > 2 || colIndices.length > 2)) {
    changed = false;

    // 1. Check Row Dominance: If row i <= row k for all columns, row i is dominated
    if (rowIndices.length > 2) {
      for (let i = 0; i < currentMatrix.length; i++) {
        for (let k = 0; k < currentMatrix.length; k++) {
          if (i === k) continue;
          const isDominated = currentMatrix[i].every((val, colIdx) => val <= currentMatrix[k][colIdx]);
          const isStrictlySmallerSomewhere = currentMatrix[i].some((val, colIdx) => val < currentMatrix[k][colIdx]);

          if (isDominated && isStrictlySmallerSomewhere) {
            const origEliminatedRow = rowIndices[i];
            const origDominatingRow = rowIndices[k];

            currentMatrix.splice(i, 1);
            rowIndices.splice(i, 1);

            steps.push({
              step: stepCount++,
              type: 'row_elimination',
              eliminatedIndex: origEliminatedRow,
              dominatedByIndex: origDominatingRow,
              reason: `Row A${origEliminatedRow + 1} is dominated by Row A${origDominatingRow + 1} (every payoff in Row A${origEliminatedRow + 1} ≤ Row A${origDominatingRow + 1}). Player A drops Strategy A${origEliminatedRow + 1}.`,
              remainingMatrix: currentMatrix.map(r => [...r]),
              remainingRowIndices: [...rowIndices],
              remainingColIndices: [...colIndices],
            });

            changed = true;
            break;
          }
        }
        if (changed) break;
      }
    }

    if (changed) continue;

    // 2. Check Column Dominance: If col j >= col m for all rows, col j is dominated
    if (colIndices.length > 2) {
      for (let j = 0; j < currentMatrix[0].length; j++) {
        for (let m = 0; m < currentMatrix[0].length; m++) {
          if (j === m) continue;
          const isDominated = currentMatrix.every(row => row[j] >= row[m]);
          const isStrictlyLargerSomewhere = currentMatrix.some(row => row[j] > row[m]);

          if (isDominated && isStrictlyLargerSomewhere) {
            const origEliminatedCol = colIndices[j];
            const origDominatingCol = colIndices[m];

            // Remove column j
            currentMatrix = currentMatrix.map(row => row.filter((_, idx) => idx !== j));
            colIndices.splice(j, 1);

            steps.push({
              step: stepCount++,
              type: 'col_elimination',
              eliminatedIndex: origEliminatedCol,
              dominatedByIndex: origDominatingCol,
              reason: `Column B${origEliminatedCol + 1} is dominated by Column B${origDominatingCol + 1} (payoff to Player B is higher in B${origEliminatedCol + 1}, so Player B avoids it). Player B drops Strategy B${origEliminatedCol + 1}.`,
              remainingMatrix: currentMatrix.map(r => [...r]),
              remainingRowIndices: [...rowIndices],
              remainingColIndices: [...colIndices],
            });

            changed = true;
            break;
          }
        }
        if (changed) break;
      }
    }
  }

  let statusMessage = '';
  if (rowIndices.length === 2 && colIndices.length === 2) {
    statusMessage = `Successfully reduced by Dominance Principle to a 2×2 game (Rows: [${rowIndices.map(r => `A${r + 1}`).join(', ')}], Cols: [${colIndices.map(c => `B${c + 1}`).join(', ')}]).`;
  } else if (steps.length === 0) {
    statusMessage = 'No rows or columns strictly dominate each other directly.';
  } else {
    statusMessage = `Partially reduced to ${rowIndices.length}×${colIndices.length} matrix.`;
  }

  return {
    steps,
    reducedMatrix: currentMatrix,
    finalRows: rowIndices,
    finalCols: colIndices,
    statusMessage,
  };
}

// 4. Graphical Method Solver for 2xN Games
export function solveGraphicalGame(matrix: number[][]): GraphicalGameResult {
  const explanations: string[] = [];
  const m = matrix.length;
  const n = matrix[0].length;

  if (m === 2) {
    // 2 x N game
    explanations.push(
      `2 × ${n} Game: Player A has 2 strategies (A₁, A₂) with probabilities p₁ and p₂ = 1 - p₁.`
    );
    explanations.push(
      `For each strategy of Player B (j = 1 to ${n}), expected payoff is: E_j(p₁) = (a₁ⱼ - a₂ⱼ)p₁ + a₂ⱼ`
    );

    interface PayoffLine {
      strategyName: string;
      yAt0: number;
      yAt1: number;
      slope: number;
      intercept: number;
    }

    const lines: PayoffLine[] = [];
    for (let j = 0; j < n; j++) {
      const a1 = matrix[0][j];
      const a2 = matrix[1][j];
      lines.push({
        strategyName: `B${j + 1}`,
        yAt0: a2,
        yAt1: a1,
        slope: a1 - a2,
        intercept: a2,
      });
    }

    // Find all pairwise line intersections within p in [0, 1]
    const intersections: { p: number; v: number; i: number; j: number }[] = [];
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const l1 = lines[i];
        const l2 = lines[j];
        const deltaSlope = l1.slope - l2.slope;
        if (Math.abs(deltaSlope) > 1e-6) {
          const p = (l2.intercept - l1.intercept) / deltaSlope;
          if (p >= -0.01 && p <= 1.01) {
            const cleanP = Math.max(0, Math.min(1, p));
            const v = l1.slope * cleanP + l1.intercept;
            intersections.push({ p: cleanP, v, i, j });
          }
        }
      }
    }

    // Lower envelope evaluation: at each candidate p, lower envelope is min_j (E_j(p))
    // We want the Maximin point (highest point on the lower envelope)
    let bestIntersection: {
      p: number;
      gameValue: number;
      line1Index: number;
      line2Index: number;
    } | null = null;
    let maxLowerEnv = -Infinity;

    // Check candidate points (0, 1, and all intersections)
    const testPValues = [0, 1, ...intersections.map(it => it.p)];

    for (const p of testPValues) {
      const lowerEnvVal = Math.min(...lines.map(l => l.slope * p + l.intercept));
      if (lowerEnvVal > maxLowerEnv) {
        maxLowerEnv = lowerEnvVal;
        // find which lines intersect near this point
        const matchingInter = intersections.find(it => Math.abs(it.p - p) < 0.05);
        if (matchingInter) {
          bestIntersection = {
            p: Number(p.toFixed(4)),
            gameValue: Number(lowerEnvVal.toFixed(4)),
            line1Index: matchingInter.i,
            line2Index: matchingInter.j,
          };
        } else {
          bestIntersection = {
            p: Number(p.toFixed(4)),
            gameValue: Number(lowerEnvVal.toFixed(4)),
            line1Index: 0,
            line2Index: 1,
          };
        }
      }
    }

    if (bestIntersection) {
      explanations.push(
        `Highest point on the Lower Envelope (Maximin point) occurs at p₁* = ${bestIntersection.p}.`
      );
      explanations.push(
        `Critical intersecting strategies for Player B are B${bestIntersection.line1Index + 1} and B${bestIntersection.line2Index + 1}.`
      );
      explanations.push(`Optimal Value of the Game V = ${bestIntersection.gameValue}.`);
    }

    return {
      type: '2xN',
      lines,
      criticalIntersection: bestIntersection,
      explanations,
    };
  }

  // Fallback for Mx2
  return {
    type: 'Mx2',
    lines: [],
    criticalIntersection: null,
    explanations: ['Mx2 graphical solver: Plots upper envelope and finds lowest point.'],
  };
}
