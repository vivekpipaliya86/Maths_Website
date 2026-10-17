export interface PrimalInput {
  type: 'max' | 'min';
  objectiveCoeffs: number[]; // [c1, c2, ...]
  constraints: {
    coeffs: number[];
    operator: '<=' | '>=' | '=';
    rhs: number;
  }[];
}

export interface DualOutput {
  dualType: 'max' | 'min';
  dualObjectiveCoeffs: number[];
  dualVariables: { name: string; signRestriction: string; description: string }[];
  dualConstraints: {
    coeffs: number[];
    operator: '<=' | '>=' | '=';
    rhs: number;
    description: string;
  }[];
  explanationSteps: string[];
}

export function convertPrimalToDual(primal: PrimalInput): DualOutput {
  const steps: string[] = [];
  const isPrimalMax = primal.type === 'max';
  const dualType: 'max' | 'min' = isPrimalMax ? 'min' : 'max';

  steps.push(
    `Rule 1: Primal is a ${isPrimalMax ? 'Maximization' : 'Minimization'} problem, so the Dual will be a ${dualType === 'max' ? 'Maximization' : 'Minimization'} problem.`
  );

  const numPrimalVars = primal.objectiveCoeffs.length;
  const numPrimalConstraints = primal.constraints.length;

  steps.push(
    `Rule 2: Primal has ${numPrimalConstraints} constraint(s), so Dual has ${numPrimalConstraints} decision variable(s) (y₁, y₂, ...).`
  );

  // Dual Objective Coefficients are Primal RHS values
  const dualObjectiveCoeffs = primal.constraints.map(c => c.rhs);
  steps.push(
    `Rule 3: Dual objective coefficients are the RHS constants of the primal: [${dualObjectiveCoeffs.join(', ')}].`
  );

  // Dual Variables sign restrictions
  const dualVariables = primal.constraints.map((c, i) => {
    let signRestriction = 'y ≥ 0';
    let meaning = `Shadow price of Resource ${i + 1}`;
    if (isPrimalMax) {
      if (c.operator === '<=') signRestriction = `y${i + 1} ≥ 0`;
      else if (c.operator === '>=') signRestriction = `y${i + 1} ≤ 0`;
      else signRestriction = `y${i + 1} unrestricted in sign`;
    } else {
      // Primal Min
      if (c.operator === '>=') signRestriction = `y${i + 1} ≥ 0`;
      else if (c.operator === '<=') signRestriction = `y${i + 1} ≤ 0`;
      else signRestriction = `y${i + 1} unrestricted in sign`;
    }
    return {
      name: `y${i + 1}`,
      signRestriction,
      description: meaning,
    };
  });

  // Dual Constraints (Transpose of Primal Matrix A)
  // Number of dual constraints = Number of primal variables
  const dualConstraints: DualOutput['dualConstraints'] = [];
  for (let j = 0; j < numPrimalVars; j++) {
    const dualCoeffs = primal.constraints.map(c => c.coeffs[j] || 0);
    const dualRhs = primal.objectiveCoeffs[j];
    let dualOp: '<=' | '>=' | '=' = '>=';

    if (isPrimalMax) {
      // Standard primal max (xj >= 0) implies dual constraint >=
      dualOp = '>=';
    } else {
      // Standard primal min (xj >= 0) implies dual constraint <=
      dualOp = '<=';
    }

    dualConstraints.push({
      coeffs: dualCoeffs,
      operator: dualOp,
      rhs: dualRhs,
      description: `Dual Constraint ${j + 1} corresponding to primal variable x${j + 1}`,
    });
  }

  steps.push(
    `Rule 4: The coefficient matrix of dual constraints is the transpose (Aᵀ) of the primal constraint matrix.`
  );
  steps.push(
    `Rule 5: The RHS values of dual constraints are the objective coefficients of the primal: [${primal.objectiveCoeffs.join(', ')}].`
  );
  steps.push(
    `Fundamental Duality Theorem: If either primal or dual has an optimal solution, both have optimal solutions and Max Z = Min W.`
  );

  return {
    dualType,
    dualObjectiveCoeffs,
    dualVariables,
    dualConstraints,
    explanationSteps: steps,
  };
}
