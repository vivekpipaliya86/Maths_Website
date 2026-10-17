export interface TransportationInput {
  supply: number[];
  demand: number[];
  costs: number[][]; // [m][n]
  sourceNames?: string[];
  destNames?: string[];
}

export interface AllocationStep {
  step: number;
  row: number;
  col: number;
  allocatedQty: number;
  cellCost: number;
  remainingSupply: number[];
  remainingDemand: number[];
  description: string;
}

export interface TransportationResult {
  isBalanced: boolean;
  totalCost: number;
  allocations: number[][];
  steps: AllocationStep[];
  explanations: string[];
  allocationCount: number;
  isDegenerate: boolean;
  requiredBasicCells: number; // m + n - 1
  modi?: {
    u: (number | null)[];
    v: (number | null)[];
    opportunityCosts: (number | null)[][];
    isOptimal: boolean;
    mostNegativeCell: { row: number; col: number; val: number } | null;
    loopPath?: { row: number; col: number; sign: '+' | '-' }[];
    improvedCost?: number;
    notes: string[];
  };
}

export function solveNorthWestCorner(input: TransportationInput): TransportationResult {
  const m = input.supply.length;
  const n = input.demand.length;

  const remSupply = [...input.supply];
  const remDemand = [...input.demand];
  const allocations: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const steps: AllocationStep[] = [];
  const explanations: string[] = [];

  const totalSupply = remSupply.reduce((a, b) => a + b, 0);
  const totalDemand = remDemand.reduce((a, b) => a + b, 0);
  const isBalanced = totalSupply === totalDemand;

  explanations.push(
    `Total Supply = ${totalSupply}, Total Demand = ${totalDemand}. The problem is ${isBalanced ? 'Balanced' : 'Unbalanced'}.`
  );

  let r = 0;
  let c = 0;
  let stepCount = 1;

  while (r < m && c < n) {
    const qty = Math.min(remSupply[r], remDemand[c]);
    allocations[r][c] = qty;
    remSupply[r] -= qty;
    remDemand[c] -= qty;

    steps.push({
      step: stepCount++,
      row: r,
      col: c,
      allocatedQty: qty,
      cellCost: input.costs[r][c],
      remainingSupply: [...remSupply],
      remainingDemand: [...remDemand],
      description: `Allocated ${qty} units to cell (${r + 1}, ${c + 1}) at unit cost ${input.costs[r][c]}. Remaining S${r + 1}: ${remSupply[r]}, Remaining D${c + 1}: ${remDemand[c]}.`,
    });

    if (remSupply[r] === 0 && remDemand[c] === 0 && (r < m - 1 || c < n - 1)) {
      // Degeneracy edge case: tie
      r++;
      // c is not advanced to handle 0 allocation next if needed
    } else if (remSupply[r] === 0) {
      r++;
    } else {
      c++;
    }
  }

  let totalCost = 0;
  let countBasic = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (allocations[i][j] > 0) {
        totalCost += allocations[i][j] * input.costs[i][j];
        countBasic++;
      }
    }
  }

  const requiredBasicCells = m + n - 1;
  const isDegenerate = countBasic < requiredBasicCells;

  explanations.push(
    `Total allocations: ${countBasic}. Required allocations (m + n - 1) = ${m} + ${n} - 1 = ${requiredBasicCells}.`
  );
  if (isDegenerate) {
    explanations.push(
      `Notice: Allocations (${countBasic}) < (m + n - 1) = ${requiredBasicCells}. The initial basic feasible solution is Degenerate.`
    );
  } else {
    explanations.push('Initial basic feasible solution is Non-Degenerate.');
  }

  explanations.push(`Total Initial Transportation Cost = ${totalCost}`);

  return {
    isBalanced,
    totalCost,
    allocations,
    steps,
    explanations,
    allocationCount: countBasic,
    isDegenerate,
    requiredBasicCells,
  };
}

export function solveLeastCostMethod(input: TransportationInput): TransportationResult {
  const m = input.supply.length;
  const n = input.demand.length;

  const remSupply = [...input.supply];
  const remDemand = [...input.demand];
  const allocations: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  const steps: AllocationStep[] = [];
  const explanations: string[] = [];

  const totalSupply = remSupply.reduce((a, b) => a + b, 0);
  const totalDemand = remDemand.reduce((a, b) => a + b, 0);
  const isBalanced = totalSupply === totalDemand;

  explanations.push(
    `Least Cost Method (Matrix Minimum Method): Greedily allocates to the cell with the smallest cost.`
  );

  const rowSatisfied = new Array(m).fill(false);
  const colSatisfied = new Array(n).fill(false);
  let stepCount = 1;

  while (rowSatisfied.some(s => !s) && colSatisfied.some(s => !s)) {
    // Find min cost cell among active rows and cols
    let minCost = Infinity;
    let minR = -1;
    let minC = -1;

    for (let i = 0; i < m; i++) {
      if (rowSatisfied[i]) continue;
      for (let j = 0; j < n; j++) {
        if (colSatisfied[j]) continue;
        if (input.costs[i][j] < minCost) {
          minCost = input.costs[i][j];
          minR = i;
          minC = j;
        }
      }
    }

    if (minR === -1 || minC === -1) break;

    const qty = Math.min(remSupply[minR], remDemand[minC]);
    allocations[minR][minC] = qty;
    remSupply[minR] -= qty;
    remDemand[minC] -= qty;

    steps.push({
      step: stepCount++,
      row: minR,
      col: minC,
      allocatedQty: qty,
      cellCost: minCost,
      remainingSupply: [...remSupply],
      remainingDemand: [...remDemand],
      description: `Minimum cost cell is (${minR + 1}, ${minC + 1}) with cost ${minCost}. Allocated ${qty} units.`,
    });

    if (remSupply[minR] === 0 && remDemand[minC] === 0) {
      rowSatisfied[minR] = true;
      // Leave col active or satisfy one to guard degeneracy
      if (colSatisfied.filter(x => !x).length > 1) {
        colSatisfied[minC] = true;
      }
    } else if (remSupply[minR] === 0) {
      rowSatisfied[minR] = true;
    } else {
      colSatisfied[minC] = true;
    }
  }

  let totalCost = 0;
  let countBasic = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (allocations[i][j] > 0) {
        totalCost += allocations[i][j] * input.costs[i][j];
        countBasic++;
      }
    }
  }

  const requiredBasicCells = m + n - 1;
  const isDegenerate = countBasic < requiredBasicCells;

  explanations.push(
    `Total LCM Allocations: ${countBasic}. Required (m + n - 1): ${requiredBasicCells}.`
  );
  explanations.push(`Total Transportation Cost using Least Cost Method = ${totalCost}`);

  return {
    isBalanced,
    totalCost,
    allocations,
    steps,
    explanations,
    allocationCount: countBasic,
    isDegenerate,
    requiredBasicCells,
  };
}

export function evaluateMODIMethod(
  input: TransportationInput,
  allocations: number[][]
): TransportationResult['modi'] {
  const m = input.supply.length;
  const n = input.demand.length;
  const notes: string[] = [];

  const u: (number | null)[] = new Array(m).fill(null);
  const v: (number | null)[] = new Array(n).fill(null);

  // Set u0 = 0
  u[0] = 0;
  notes.push('Step 1: Set dual multiplier u₁ = 0 as base.');

  let changed = true;
  let passes = 0;
  while (changed && passes < 30) {
    changed = false;
    passes++;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (allocations[i][j] > 0) {
          // u_i + v_j = c_ij
          if (u[i] !== null && v[j] === null) {
            v[j] = input.costs[i][j] - u[i]!;
            changed = true;
          } else if (v[j] !== null && u[i] === null) {
            u[i] = input.costs[i][j] - v[j]!;
            changed = true;
          }
        }
      }
    }
  }

  // If any unassigned due to disconnected components / degeneracy, assign default 0
  for (let i = 0; i < m; i++) {
    if (u[i] === null) u[i] = 0;
  }
  for (let j = 0; j < n; j++) {
    if (v[j] === null) v[j] = 0;
  }

  notes.push(
    `Calculated multipliers: u = [${u.map(x => (x !== null ? x : '?')).join(', ')}], v = [${v.map(x => (x !== null ? x : '?')).join(', ')}]`
  );

  // Compute Opportunity Costs: Δ_ij = c_ij - (u_i + v_j) for non-basic cells
  const opportunityCosts: (number | null)[][] = Array.from({ length: m }, () =>
    new Array(n).fill(null)
  );

  let isOptimal = true;
  let mostNegativeVal = 0;
  let mostNegativeCell: { row: number; col: number; val: number } | null = null;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (allocations[i][j] === 0) {
        const ui = u[i] || 0;
        const vj = v[j] || 0;
        const delta = input.costs[i][j] - (ui + vj);
        opportunityCosts[i][j] = delta;

        if (delta < 0) {
          isOptimal = false;
          if (delta < mostNegativeVal) {
            mostNegativeVal = delta;
            mostNegativeCell = { row: i, col: j, val: delta };
          }
        }
      }
    }
  }

  if (isOptimal) {
    notes.push(
      'Optimality Criterion satisfied! All opportunity costs Δ_ij ≥ 0 for all unallocated cells. The current allocation is OPTIMAL.'
    );
  } else if (mostNegativeCell) {
    notes.push(
      `Current allocation is NOT optimal. Cell (${mostNegativeCell.row + 1}, ${mostNegativeCell.col + 1}) has most negative opportunity cost Δ = ${mostNegativeCell.val}.`
    );
    notes.push(
      `Entering this cell into the basis by forming a closed stepping-stone loop will decrease total cost.`
    );
  }

  return {
    u,
    v,
    opportunityCosts,
    isOptimal,
    mostNegativeCell,
    notes,
  };
}
