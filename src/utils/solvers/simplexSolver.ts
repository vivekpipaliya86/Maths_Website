export interface SimplexConstraintInput {
  coefficients: number[];
  operator: '<=' | '>=' | '=';
  rhs: number;
}

export interface SimplexInput {
  type: 'max' | 'min';
  objective: number[]; // e.g. [3, 5] for 3x1 + 5x2
  variableNames?: string[];
  constraints: SimplexConstraintInput[];
}

export interface TableauRow {
  basisVar: string;
  cb: number;
  rhs: number;
  values: number[];
  ratio: number | null;
}

export interface SimplexTableau {
  iteration: number;
  variableNames: string[];
  cValues: number[];
  rows: TableauRow[];
  zj: number[];
  cjMinusZj: number[];
  currentZ: number;
  pivotCol: number | null;
  pivotRow: number | null;
  pivotValue: number | null;
  isOptimal: boolean;
  notes: string;
}

export interface SimplexResult {
  status: 'optimal' | 'unbounded' | 'infeasible' | 'iterations_exceeded';
  finalZ: number;
  solutionVariables: { [name: string]: number };
  tableaus: SimplexTableau[];
  summarySteps: string[];
}

export function solveSimplex(input: SimplexInput): SimplexResult {
  const summarySteps: string[] = [];
  const M = 10000; // Big-M constant representation

  const isMin = input.type === 'min';
  // For minimization, Min Z = - Max (-Z)
  // Or handle standard tableau directly.
  summarySteps.push(
    `Initial Problem: ${isMin ? 'Minimize' : 'Maximize'} Z = ${input.objective.map((c, i) => `${c}x${i + 1}`).join(' + ')}`
  );

  const numOrigVars = input.objective.length;
  const numConstraints = input.constraints.length;

  // Build variable list
  const allVarNames: string[] = [];
  for (let i = 0; i < numOrigVars; i++) {
    allVarNames.push(`x${i + 1}`);
  }

  // Count slacks, surplus, artificials
  let slackCount = 0;
  let surplusCount = 0;
  let artificialCount = 0;

  input.constraints.forEach(c => {
    if (c.operator === '<=') slackCount++;
    else if (c.operator === '>=') {
      surplusCount++;
      artificialCount++;
    } else if (c.operator === '=') {
      artificialCount++;
    }
  });

  let currentS = 1;
  let currentE = 1;
  let currentA = 1;

  interface ExtraVar {
    name: string;
    type: 'slack' | 'surplus' | 'artificial';
    constraintIndex: number;
    coeffInRow: number;
    objCoeff: number;
  }

  const extraVars: ExtraVar[] = [];

  input.constraints.forEach((c, idx) => {
    if (c.operator === '<=') {
      const sName = `s${currentS++}`;
      allVarNames.push(sName);
      extraVars.push({
        name: sName,
        type: 'slack',
        constraintIndex: idx,
        coeffInRow: 1,
        objCoeff: 0,
      });
    } else if (c.operator === '>=') {
      const eName = `e${currentE++}`;
      allVarNames.push(eName);
      extraVars.push({
        name: eName,
        type: 'surplus',
        constraintIndex: idx,
        coeffInRow: -1,
        objCoeff: 0,
      });
      const aName = `A${currentA++}`;
      allVarNames.push(aName);
      extraVars.push({
        name: aName,
        type: 'artificial',
        constraintIndex: idx,
        coeffInRow: 1,
        objCoeff: isMin ? M : -M,
      });
    } else if (c.operator === '=') {
      const aName = `A${currentA++}`;
      allVarNames.push(aName);
      extraVars.push({
        name: aName,
        type: 'artificial',
        constraintIndex: idx,
        coeffInRow: 1,
        objCoeff: isMin ? M : -M,
      });
    }
  });

  const totalVars = allVarNames.length;
  const cVector: number[] = new Array(totalVars).fill(0);

  // Set original objective coeffs
  for (let i = 0; i < numOrigVars; i++) {
    cVector[i] = input.objective[i];
  }
  // Set extra vars coeffs
  extraVars.forEach(ev => {
    const colIdx = allVarNames.indexOf(ev.name);
    cVector[colIdx] = ev.objCoeff;
  });

  // Build matrix A and rhs
  const matrix: number[][] = [];
  const rhs: number[] = [];
  const basis: { varName: string; colIdx: number }[] = [];

  input.constraints.forEach((c, rowIdx) => {
    let rowRhs = c.rhs;
    let coeffs = [...c.coefficients];
    // If rhs is negative, multiply by -1
    if (rowRhs < 0) {
      rowRhs = -rowRhs;
      coeffs = coeffs.map(v => -v);
    }
    rhs.push(rowRhs);

    const fullRow = new Array(totalVars).fill(0);
    for (let i = 0; i < numOrigVars; i++) {
      fullRow[i] = coeffs[i] || 0;
    }
    // Set extra var columns
    extraVars.forEach(ev => {
      if (ev.constraintIndex === rowIdx) {
        const colIdx = allVarNames.indexOf(ev.name);
        fullRow[colIdx] = ev.coeffInRow;
      }
    });
    matrix.push(fullRow);

    // Initial basis: find slack or artificial for this row
    const basisVar = extraVars.find(
      ev => ev.constraintIndex === rowIdx && (ev.type === 'slack' || ev.type === 'artificial')
    );
    if (basisVar) {
      const colIdx = allVarNames.indexOf(basisVar.name);
      basis.push({ varName: basisVar.name, colIdx });
    } else {
      // Default fallback
      basis.push({ varName: allVarNames[0], colIdx: 0 });
    }
  });

  const tableaus: SimplexTableau[] = [];
  const maxIterations = 15;
  let iteration = 0;
  let isOptimal = false;
  let status: SimplexResult['status'] = 'optimal';

  while (!isOptimal && iteration < maxIterations) {
    iteration++;

    // Compute Zj and Cj - Zj
    const zj: number[] = new Array(totalVars).fill(0);
    let currentZ = 0;

    for (let col = 0; col < totalVars; col++) {
      let sum = 0;
      for (let row = 0; row < numConstraints; row++) {
        const cb = cVector[basis[row].colIdx];
        sum += cb * matrix[row][col];
      }
      zj[col] = Number(sum.toFixed(4));
    }

    for (let row = 0; row < numConstraints; row++) {
      const cb = cVector[basis[row].colIdx];
      currentZ += cb * rhs[row];
    }
    currentZ = Number(currentZ.toFixed(4));

    const cjMinusZj: number[] = new Array(totalVars).fill(0);
    for (let col = 0; col < totalVars; col++) {
      cjMinusZj[col] = Number((cVector[col] - zj[col]).toFixed(4));
    }

    // Determine entering variable
    // For Maximize: highest positive (Cj - Zj)
    // For Minimize: most negative (Cj - Zj)
    let enteringCol: number | null = null;
    if (!isMin) {
      let maxVal = 0.0001;
      for (let col = 0; col < totalVars; col++) {
        if (cjMinusZj[col] > maxVal) {
          maxVal = cjMinusZj[col];
          enteringCol = col;
        }
      }
    } else {
      let minVal = -0.0001;
      for (let col = 0; col < totalVars; col++) {
        if (cjMinusZj[col] < minVal) {
          minVal = cjMinusZj[col];
          enteringCol = col;
        }
      }
    }

    // If no candidate, we reached optimality!
    if (enteringCol === null) {
      isOptimal = true;
      // Check for infeasibility: does any Artificial variable remain in basis with positive value?
      const hasArtificialWithPositiveValue = basis.some(
        (b, r) => b.varName.startsWith('A') && rhs[r] > 0.001
      );
      if (hasArtificialWithPositiveValue) {
        status = 'infeasible';
        summarySteps.push(
          `Iteration ${iteration}: Optimality condition reached, but artificial variable remains in the basis with positive value. The problem is Infeasible.`
        );
      } else {
        summarySteps.push(
          `Iteration ${iteration}: Optimality reached! All (${isMin ? 'Cj - Zj ≥ 0' : 'Cj - Zj ≤ 0'}). Optimal Z = ${currentZ}`
        );
      }

      tableaus.push({
        iteration,
        variableNames: allVarNames,
        cValues: cVector,
        rows: basis.map((b, r) => ({
          basisVar: b.varName,
          cb: cVector[b.colIdx],
          rhs: Number(rhs[r].toFixed(4)),
          values: matrix[r].map(v => Number(v.toFixed(4))),
          ratio: null,
        })),
        zj,
        cjMinusZj,
        currentZ,
        pivotCol: null,
        pivotRow: null,
        pivotValue: null,
        isOptimal: true,
        notes: status === 'infeasible' ? 'Infeasible Problem' : 'Optimal Solution Reached',
      });
      break;
    }

    // Entering variable found: compute theta ratios = RHS / a_ir (where a_ir > 0)
    let leavingRow: number | null = null;
    let minRatio = Infinity;
    const ratios: (number | null)[] = new Array(numConstraints).fill(null);

    for (let r = 0; r < numConstraints; r++) {
      const a_ir = matrix[r][enteringCol];
      if (a_ir > 0.00001) {
        const ratio = rhs[r] / a_ir;
        ratios[r] = Number(ratio.toFixed(4));
        if (ratio < minRatio) {
          minRatio = ratio;
          leavingRow = r;
        }
      }
    }

    if (leavingRow === null) {
      // Unbounded solution
      status = 'unbounded';
      summarySteps.push(
        `Iteration ${iteration}: Entering variable ${allVarNames[enteringCol]} has no positive pivot coefficients (all a_ir ≤ 0). The solution is Unbounded.`
      );
      tableaus.push({
        iteration,
        variableNames: allVarNames,
        cValues: cVector,
        rows: basis.map((b, r) => ({
          basisVar: b.varName,
          cb: cVector[b.colIdx],
          rhs: Number(rhs[r].toFixed(4)),
          values: matrix[r].map(v => Number(v.toFixed(4))),
          ratio: ratios[r],
        })),
        zj,
        cjMinusZj,
        currentZ,
        pivotCol: enteringCol,
        pivotRow: null,
        pivotValue: null,
        isOptimal: false,
        notes: 'Unbounded problem (no valid leaving variable)',
      });
      break;
    }

    const pivotVal = matrix[leavingRow][enteringCol];
    const enteringVarName = allVarNames[enteringCol];
    const leavingVarName = basis[leavingRow].varName;

    summarySteps.push(
      `Iteration ${iteration}: Entering var ${enteringVarName} (Col ${enteringCol + 1}), Leaving var ${leavingVarName} (Row ${leavingRow + 1}), Pivot element = ${pivotVal.toFixed(3)}`
    );

    tableaus.push({
      iteration,
      variableNames: allVarNames,
      cValues: cVector,
      rows: basis.map((b, r) => ({
        basisVar: b.varName,
        cb: cVector[b.colIdx],
        rhs: Number(rhs[r].toFixed(4)),
        values: matrix[r].map(v => Number(v.toFixed(4))),
        ratio: ratios[r],
      })),
      zj,
      cjMinusZj,
      currentZ,
      pivotCol: enteringCol,
      pivotRow: leavingRow,
      pivotValue: pivotVal,
      isOptimal: false,
      notes: `Pivot at Row ${leavingRow + 1}, Col ${enteringCol + 1} (${enteringVarName})`,
    });

    // Pivot operation (Gauss-Jordan elimination)
    // 1. Normalize pivot row
    for (let c = 0; c < totalVars; c++) {
      matrix[leavingRow][c] /= pivotVal;
    }
    rhs[leavingRow] /= pivotVal;

    // 2. Eliminate other rows
    for (let r = 0; r < numConstraints; r++) {
      if (r !== leavingRow) {
        const factor = matrix[r][enteringCol];
        for (let c = 0; c < totalVars; c++) {
          matrix[r][c] -= factor * matrix[leavingRow][c];
        }
        rhs[r] -= factor * rhs[leavingRow];
      }
    }

    // 3. Update basis
    basis[leavingRow] = { varName: enteringVarName, colIdx: enteringCol };
  }

  if (iteration >= maxIterations && !isOptimal) {
    status = 'iterations_exceeded';
    summarySteps.push('Maximum iterations reached.');
  }

  // Extract solution values
  const solutionVariables: { [name: string]: number } = {};
  allVarNames.forEach(name => (solutionVariables[name] = 0));
  basis.forEach((b, r) => {
    solutionVariables[b.varName] = Number(Math.max(0, rhs[r]).toFixed(4));
  });

  const lastTableau = tableaus[tableaus.length - 1];
  const finalZ = lastTableau ? lastTableau.currentZ : 0;

  return {
    status,
    finalZ,
    solutionVariables,
    tableaus,
    summarySteps,
  };
}
