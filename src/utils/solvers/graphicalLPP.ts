export interface LPPConstraint {
  id: string;
  a1: number;
  a2: number;
  operator: '<=' | '>=' | '=';
  b: number;
}

export interface GraphicalLPPInput {
  objectiveType: 'max' | 'min';
  c1: number;
  c2: number;
  constraints: LPPConstraint[];
}

export interface CornerPoint {
  x: number;
  y: number;
  z: number;
  isOptimal: boolean;
  activeConstraints: string[];
}

export interface GraphicalLPPSolution {
  status: 'optimal' | 'infeasible' | 'unbounded' | 'multiple_optimal';
  cornerPoints: CornerPoint[];
  optimalPoints: CornerPoint[];
  optimalValue: number | null;
  feasiblePolygon: { x: number; y: number }[];
  steps: string[];
  maxRangeX: number;
  maxRangeY: number;
}

const EPSILON = 1e-6;

export function solveGraphicalLPP(input: GraphicalLPPInput): GraphicalLPPSolution {
  const steps: string[] = [];
  const { objectiveType, c1, c2, constraints } = input;

  steps.push(
    `Formulation: ${objectiveType === 'max' ? 'Maximize' : 'Minimize'} Z = ${c1}x₁ + ${c2}x₂`,
    `Subject to non-negativity: x₁ ≥ 0, x₂ ≥ 0 and ${constraints.length} constraints.`
  );

  // Combine user constraints with non-negativity
  const allLines: { a1: number; a2: number; b: number; name: string; op: string }[] = [
    { a1: 1, a2: 0, b: 0, name: 'x₁ ≥ 0', op: '>=' },
    { a1: 0, a2: 1, b: 0, name: 'x₂ ≥ 0', op: '>=' },
    ...constraints.map((c, i) => ({
      a1: c.a1,
      a2: c.a2,
      b: c.b,
      name: `Constraint ${i + 1}: ${c.a1}x₁ + ${c.a2}x₂ ${c.operator} ${c.b}`,
      op: c.operator,
    })),
  ];

  // Find all pairwise line intersections
  const rawIntersections: { x: number; y: number; lines: string[] }[] = [];

  for (let i = 0; i < allLines.length; i++) {
    for (let j = i + 1; j < allLines.length; j++) {
      const l1 = allLines[i];
      const l2 = allLines[j];
      const det = l1.a1 * l2.a2 - l1.a2 * l2.a1;

      if (Math.abs(det) > EPSILON) {
        const x = (l1.b * l2.a2 - l1.a2 * l2.b) / det;
        const y = (l1.a1 * l2.b - l1.b * l2.a1) / det;

        // Clean up near zero
        const cleanX = Math.abs(x) < EPSILON ? 0 : x;
        const cleanY = Math.abs(y) < EPSILON ? 0 : y;

        // Check duplicate
        const exists = rawIntersections.some(
          p => Math.abs(p.x - cleanX) < 1e-4 && Math.abs(p.y - cleanY) < 1e-4
        );
        if (!exists) {
          rawIntersections.push({ x: cleanX, y: cleanY, lines: [l1.name, l2.name] });
        }
      }
    }
  }

  // Filter feasible points
  const isFeasible = (x: number, y: number): boolean => {
    if (x < -EPSILON || y < -EPSILON) return false;
    for (const c of constraints) {
      const val = c.a1 * x + c.a2 * y;
      if (c.operator === '<=' && val > c.b + EPSILON) return false;
      if (c.operator === '>=' && val < c.b - EPSILON) return false;
      if (c.operator === '=' && Math.abs(val - c.b) > EPSILON) return false;
    }
    return true;
  };

  const feasiblePoints = rawIntersections
    .filter(p => isFeasible(p.x, p.y))
    .map(p => ({
      x: Number(p.x.toFixed(4)),
      y: Number(p.y.toFixed(4)),
      lines: p.lines,
    }));

  // Always consider origin if feasible
  if (isFeasible(0, 0)) {
    if (!feasiblePoints.some(p => Math.abs(p.x) < EPSILON && Math.abs(p.y) < EPSILON)) {
      feasiblePoints.push({ x: 0, y: 0, lines: ['Origin (0,0)'] });
    }
  }

  if (feasiblePoints.length === 0) {
    steps.push('No feasible region exists. All constraints cannot be simultaneously satisfied.');
    return {
      status: 'infeasible',
      cornerPoints: [],
      optimalPoints: [],
      optimalValue: null,
      feasiblePolygon: [],
      steps,
      maxRangeX: 10,
      maxRangeY: 10,
    };
  }

  // Compute Z values for all feasible points
  const evaluatedPoints: CornerPoint[] = feasiblePoints.map(p => ({
    x: p.x,
    y: p.y,
    z: Number((c1 * p.x + c2 * p.y).toFixed(4)),
    isOptimal: false,
    activeConstraints: p.lines,
  }));

  // Determine optimum
  let bestZ = evaluatedPoints[0].z;
  for (const pt of evaluatedPoints) {
    if (objectiveType === 'max') {
      if (pt.z > bestZ) bestZ = pt.z;
    } else {
      if (pt.z < bestZ) bestZ = pt.z;
    }
  }

  // Check for unboundedness in maximization
  // If all constraint coefficients are <= 0 or there's an open unbounded direction where Z grows indefinitely
  let isUnbounded = false;
  if (objectiveType === 'max' && (c1 > 0 || c2 > 0)) {
    // If only >= constraints exist or ray to (X+1000, Y+1000) remains feasible
    const testFarPoint = { x: 10000, y: 10000 };
    if (isFeasible(testFarPoint.x, testFarPoint.y)) {
      isUnbounded = true;
    }
  }

  if (isUnbounded) {
    steps.push('The feasible region is unbounded in the direction of the objective function. Objective value Z can increase infinitely without bound.');
    return {
      status: 'unbounded',
      cornerPoints: evaluatedPoints,
      optimalPoints: [],
      optimalValue: null,
      feasiblePolygon: evaluatedPoints,
      steps,
      maxRangeX: 20,
      maxRangeY: 20,
    };
  }

  const optimalPoints = evaluatedPoints.filter(p => Math.abs(p.z - bestZ) < 1e-4);
  optimalPoints.forEach(p => (p.isOptimal = true));

  const status: GraphicalLPPSolution['status'] =
    optimalPoints.length > 1 ? 'multiple_optimal' : 'optimal';

  // Compute convex hull / sorted vertices of feasible polygon for visual shading
  const center = {
    x: feasiblePoints.reduce((s, p) => s + p.x, 0) / feasiblePoints.length,
    y: feasiblePoints.reduce((s, p) => s + p.y, 0) / feasiblePoints.length,
  };

  const sortedPolygon = [...feasiblePoints].sort((a, b) => {
    const angleA = Math.atan2(a.y - center.y, a.x - center.x);
    const angleB = Math.atan2(b.y - center.y, b.x - center.x);
    return angleA - angleB;
  });

  const maxValX = Math.max(...feasiblePoints.map(p => p.x), 5);
  const maxValY = Math.max(...feasiblePoints.map(p => p.y), 5);

  steps.push(`Found ${feasiblePoints.length} feasible corner point(s).`);
  evaluatedPoints.forEach((p, idx) => {
    steps.push(`Point ${idx + 1} (${p.x}, ${p.y}): Z = ${c1}(${p.x}) + ${c2}(${p.y}) = ${p.z}`);
  });

  if (status === 'multiple_optimal') {
    steps.push(`Multiple Optimal Solutions detected! Both ${optimalPoints.map(p => `(${p.x}, ${p.y})`).join(' and ')} give the same optimal value Z = ${bestZ}. Any point on the line segment connecting them is also optimal.`);
  } else {
    steps.push(`Optimal solution found at (${optimalPoints[0].x}, ${optimalPoints[0].y}) with optimal value Z = ${bestZ}.`);
  }

  return {
    status,
    cornerPoints: evaluatedPoints,
    optimalPoints,
    optimalValue: bestZ,
    feasiblePolygon: sortedPolygon,
    steps,
    maxRangeX: Math.ceil(maxValX * 1.3),
    maxRangeY: Math.ceil(maxValY * 1.3),
  };
}
