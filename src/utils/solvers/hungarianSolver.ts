export interface HungarianInput {
  type: 'min' | 'max';
  matrix: number[][]; // N x M
  rowLabels?: string[]; // e.g. ["Worker 1", "Worker 2"]
  colLabels?: string[]; // e.g. ["Job A", "Job B"]
}

export interface HungarianStep {
  stepNumber: number;
  title: string;
  description: string;
  matrix: number[][];
  lines?: {
    rows: number[];
    cols: number[];
  };
  theta?: number;
}

export interface HungarianResult {
  isBalanced: boolean;
  paddedMatrix: number[][];
  steps: HungarianStep[];
  assignments: { row: number; col: number; originalCost: number }[];
  totalOptimalCost: number;
  explanations: string[];
}

export function solveHungarian(input: HungarianInput): HungarianResult {
  const steps: HungarianStep[] = [];
  const explanations: string[] = [];

  const rawRows = input.matrix.length;
  const rawCols = input.matrix[0]?.length || 0;
  const isBalanced = rawRows === rawCols;
  const n = Math.max(rawRows, rawCols);

  explanations.push(
    `Initial Matrix: ${rawRows} rows × ${rawCols} columns. ${isBalanced ? 'The problem is Balanced.' : `Unbalanced! Padded with dummy ${rawRows < rawCols ? 'rows' : 'columns'} with cost 0 to make it ${n}×${n}.`}`
  );

  // Prepare N x N matrix
  let workingMatrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i < rawRows && j < rawCols) {
        workingMatrix[i][j] = input.matrix[i][j];
      } else {
        workingMatrix[i][j] = 0; // dummy
      }
    }
  }

  const paddedOriginal = workingMatrix.map(row => [...row]);

  // If Maximization, convert to minimization: subtract each element from maximum element
  if (input.type === 'max') {
    let maxVal = -Infinity;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (workingMatrix[i][j] > maxVal) maxVal = workingMatrix[i][j];
      }
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        workingMatrix[i][j] = maxVal - workingMatrix[i][j];
      }
    }
    steps.push({
      stepNumber: steps.length + 1,
      title: 'Maximization Conversion (Relative Opportunity Loss Matrix)',
      description: `Subtracted all elements from maximum value (${maxVal}) to convert maximization into standard minimization.`,
      matrix: workingMatrix.map(r => [...r]),
    });
  }

  // Step 1: Row Reduction
  for (let i = 0; i < n; i++) {
    const rowMin = Math.min(...workingMatrix[i]);
    for (let j = 0; j < n; j++) {
      workingMatrix[i][j] -= rowMin;
    }
  }
  steps.push({
    stepNumber: steps.length + 1,
    title: 'Step 1: Row Reduction',
    description: 'Subtracted minimum element of each row from all elements in that row.',
    matrix: workingMatrix.map(r => [...r]),
  });

  // Step 2: Column Reduction
  for (let j = 0; j < n; j++) {
    let colMin = Infinity;
    for (let i = 0; i < n; i++) {
      if (workingMatrix[i][j] < colMin) colMin = workingMatrix[i][j];
    }
    for (let i = 0; i < n; i++) {
      workingMatrix[i][j] -= colMin;
    }
  }
  steps.push({
    stepNumber: steps.length + 1,
    title: 'Step 2: Column Reduction',
    description: 'Subtracted minimum element of each column from all elements in that column.',
    matrix: workingMatrix.map(r => [...r]),
  });

  // Iterative covering & adjustment loop
  let maxLoop = 10;
  let optimalCoveringFound = false;

  while (!optimalCoveringFound && maxLoop-- > 0) {
    // Determine minimum line covering using matching
    const { coveredRows, coveredCols, assignmentPairs } = findMinimumLineCovering(workingMatrix, n);
    const totalLines = coveredRows.length + coveredCols.length;

    steps.push({
      stepNumber: steps.length + 1,
      title: `Step 3: Line Covering Test (Iteration ${10 - maxLoop})`,
      description: `Drawn ${totalLines} line(s) to cover all zeros (Covered Rows: [${coveredRows.map(r => r + 1).join(', ')}], Covered Columns: [${coveredCols.map(c => c + 1).join(', ')}]). Required: ${n}.`,
      matrix: workingMatrix.map(r => [...r]),
      lines: { rows: coveredRows, cols: coveredCols },
    });

    if (totalLines >= n || assignmentPairs.length === n) {
      optimalCoveringFound = true;
      explanations.push(
        `Optimality reached! Total lines (${totalLines}) equals matrix order (${n}). An optimal assignment exists.`
      );
      break;
    }

    // Step 4: Find smallest unshaded element (theta)
    let theta = Infinity;
    for (let i = 0; i < n; i++) {
      if (coveredRows.includes(i)) continue;
      for (let j = 0; j < n; j++) {
        if (coveredCols.includes(j)) continue;
        if (workingMatrix[i][j] < theta) {
          theta = workingMatrix[i][j];
        }
      }
    }

    if (theta === Infinity || theta === 0) {
      optimalCoveringFound = true;
      break;
    }

    // Adjust matrix:
    // Subtract theta from uncovered elements
    // Add theta to elements at intersection of two lines
    // Covered once: remain unchanged
    for (let i = 0; i < n; i++) {
      const isRowCovered = coveredRows.includes(i);
      for (let j = 0; j < n; j++) {
        const isColCovered = coveredCols.includes(j);
        if (!isRowCovered && !isColCovered) {
          workingMatrix[i][j] -= theta;
        } else if (isRowCovered && isColCovered) {
          workingMatrix[i][j] += theta;
        }
      }
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: 'Step 4: Matrix Revision via Minimum Uncovered Element (θ)',
      description: `Smallest uncovered element is θ = ${theta}. Subtracted θ from all uncovered cells, added θ to intersection cells, single-line covered cells unchanged.`,
      matrix: workingMatrix.map(r => [...r]),
      theta,
    });
  }

  // Final assignment extraction using greedy matching on zero positions
  const finalAssignments = extractOptimalAssignments(workingMatrix, paddedOriginal, n);

  let totalCost = 0;
  finalAssignments.forEach(a => {
    totalCost += a.originalCost;
  });

  explanations.push(
    `Optimal Assignment Complete: Total ${input.type === 'max' ? 'Profit' : 'Cost'} = ${totalCost}.`
  );

  return {
    isBalanced,
    paddedMatrix: paddedOriginal,
    steps,
    assignments: finalAssignments,
    totalOptimalCost: totalCost,
    explanations,
  };
}

// Bipartite matching helper to find minimum lines and assignment
function findMinimumLineCovering(matrix: number[][], n: number) {
  // Find maximum matching of zeros
  const rowMatch = new Array(n).fill(-1);
  const colMatch = new Array(n).fill(-1);

  function dfs(r: number, visited: boolean[]): boolean {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c] === 0 && !visited[c]) {
        visited[c] = true;
        if (colMatch[c] === -1 || dfs(colMatch[c], visited)) {
          colMatch[c] = r;
          rowMatch[r] = c;
          return true;
        }
      }
    }
    return false;
  }

  for (let r = 0; r < n; r++) {
    const visited = new Array(n).fill(false);
    dfs(r, visited);
  }

  const assignmentPairs: { row: number; col: number }[] = [];
  for (let r = 0; r < n; r++) {
    if (rowMatch[r] !== -1) {
      assignmentPairs.push({ row: r, col: rowMatch[r] });
    }
  }

  // König's theorem to construct minimum vertex cover (lines)
  const markedRows = new Array(n).fill(false);
  const markedCols = new Array(n).fill(false);

  // Mark all rows having no assignment
  for (let r = 0; r < n; r++) {
    if (rowMatch[r] === -1) {
      markedRows[r] = true;
    }
  }

  let newlyMarked = true;
  while (newlyMarked) {
    newlyMarked = false;
    // Mark all columns having zeros in marked rows
    for (let r = 0; r < n; r++) {
      if (markedRows[r]) {
        for (let c = 0; c < n; c++) {
          if (matrix[r][c] === 0 && !markedCols[c]) {
            markedCols[c] = true;
            newlyMarked = true;
          }
        }
      }
    }
    // Mark rows having assignments in marked columns
    for (let c = 0; c < n; c++) {
      if (markedCols[c]) {
        const assignedRow = colMatch[c];
        if (assignedRow !== -1 && !markedRows[assignedRow]) {
          markedRows[assignedRow] = true;
          newlyMarked = true;
        }
      }
    }
  }

  // Draw lines through UNMARKED rows and MARKED columns
  const coveredRows: number[] = [];
  const coveredCols: number[] = [];
  for (let r = 0; r < n; r++) {
    if (!markedRows[r]) coveredRows.push(r);
  }
  for (let c = 0; c < n; c++) {
    if (markedCols[c]) coveredCols.push(c);
  }

  return { coveredRows, coveredCols, assignmentPairs };
}

function extractOptimalAssignments(
  reducedMatrix: number[][],
  originalMatrix: number[][],
  n: number
) {
  const rowMatch = new Array(n).fill(-1);
  const colMatch = new Array(n).fill(-1);

  function dfs(r: number, visited: boolean[]): boolean {
    for (let c = 0; c < n; c++) {
      if (reducedMatrix[r][c] === 0 && !visited[c]) {
        visited[c] = true;
        if (colMatch[c] === -1 || dfs(colMatch[c], visited)) {
          colMatch[c] = r;
          rowMatch[r] = c;
          return true;
        }
      }
    }
    return false;
  }

  for (let r = 0; r < n; r++) {
    const visited = new Array(n).fill(false);
    dfs(r, visited);
  }

  const result: { row: number; col: number; originalCost: number }[] = [];
  for (let r = 0; r < n; r++) {
    const c = rowMatch[r] !== -1 ? rowMatch[r] : r;
    result.push({
      row: r,
      col: c,
      originalCost: originalMatrix[r][c],
    });
  }

  return result;
}
