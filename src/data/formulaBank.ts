import { FormulaItem } from '../types';

export const formulasData: FormulaItem[] = [
  // Module 1
  {
    id: 'f-101',
    moduleId: 'mod-1',
    moduleName: 'Operations Research & LPP',
    name: 'General Linear Programming Model',
    latex: '\\text{Max or Min } Z = \\sum_{j=1}^n c_j x_j \\quad \\text{subject to} \\quad \\sum_{j=1}^n a_{ij} x_j \\,(\\le, =, \\ge)\\, b_i, \\quad x_j \\ge 0',
    symbols: [
      { symbol: 'Z', meaning: 'Objective function value (total profit or total cost)' },
      { symbol: 'c_j', meaning: 'Unit profit or cost coefficient for decision variable x_j' },
      { symbol: 'x_j', meaning: 'Level of activity j (decision variable)' },
      { symbol: 'a_{ij}', meaning: 'Amount of resource i consumed per unit of activity j' },
      { symbol: 'b_i', meaning: 'Total available supply or requirement of resource i' }
    ],
    example: 'Maximize Z = 40x₁ + 30x₂ subject to 2x₁ + x₂ ≤ 100, x₁ + 2x₂ ≤ 80, x₁, x₂ ≥ 0',
    tags: ['LPP', 'Formulation', 'Objective Function', 'Constraints']
  },
  {
    id: 'f-102',
    moduleId: 'mod-1',
    moduleName: 'Operations Research & LPP',
    name: 'Corner Point Objective Evaluation',
    latex: 'Z(P_k) = c_1 x_{1k} + c_2 x_{2k}, \\quad \\forall P_k = (x_{1k}, x_{2k}) \\in \\mathcal{V}',
    symbols: [
      { symbol: '\\mathcal{V}', meaning: 'Set of all extreme points (vertices) of the convex feasible region' },
      { symbol: 'Z(P_k)', meaning: 'Objective value evaluated at corner vertex P_k' },
      { symbol: 'c_1, c_2', meaning: 'Objective coefficients for variables x₁ and x₂' }
    ],
    example: 'For vertices O(0,0), A(50,0), B(40,20), C(0,40), test Z = 40x₁ + 30x₂ at each point.',
    tags: ['Graphical Method', 'Extreme Point', 'Feasible Region']
  },
  {
    id: 'f-103',
    moduleId: 'mod-1',
    moduleName: 'Operations Research & LPP',
    name: 'Slack & Surplus Variable Transformation',
    latex: '\\sum a_{ij} x_j \\le b_i \\implies \\sum a_{ij} x_j + s_i = b_i; \\quad \\sum a_{kj} x_j \\ge b_k \\implies \\sum a_{kj} x_j - e_k + A_k = b_k',
    symbols: [
      { symbol: 's_i', meaning: 'Slack variable representing unutilized resource i (s_i ≥ 0)' },
      { symbol: 'e_k', meaning: 'Surplus variable representing excess over minimum requirement k (e_k ≥ 0)' },
      { symbol: 'A_k', meaning: 'Artificial variable to supply initial starting basis (penalized with -M)' }
    ],
    example: '2x₁ + 3x₂ ≤ 12 -> 2x₁ + 3x₂ + s₁ = 12; 4x₁ + 2x₂ ≥ 10 -> 4x₁ + 2x₂ - e₂ + A₂ = 10',
    tags: ['Standard Form', 'Slack', 'Surplus', 'Artificial']
  },
  {
    id: 'f-104',
    moduleId: 'mod-1',
    moduleName: 'Operations Research & LPP',
    name: 'Simplex Net Evaluation (Index Row)',
    latex: 'C_j - Z_j = C_j - \\sum_{i=1}^m c_{Bi} a_{ij}',
    symbols: [
      { symbol: 'C_j', meaning: 'Cost or profit coefficient of variable x_j in the objective function' },
      { symbol: 'c_{Bi}', meaning: 'Cost coefficient of current basic variable in row i' },
      { symbol: 'a_{ij}', meaning: 'Constraint coefficient in row i and column j' },
      { symbol: 'Z_j', meaning: 'Total gross rate of loss per unit of x_j entering basis' }
    ],
    example: 'If C₁ = 3, and basic variables have c_B = [0, 0], Z₁ = 0, then C₁ - Z₁ = 3 - 0 = +3 (entering candidate).',
    tags: ['Simplex', 'Net Evaluation', 'Index Row']
  },
  {
    id: 'f-105',
    moduleId: 'mod-1',
    moduleName: 'Operations Research & LPP',
    name: 'Simplex Minimum Ratio Test (Leaving Variable)',
    latex: '\\theta = \\min_{i} \\left\\{ \\frac{X_{Bi}}{a_{ir}} \\;\\middle|\\; a_{ir} > 0 \\right\\}',
    symbols: [
      { symbol: '\\theta', meaning: 'Minimum allowable step size before a basic variable reaches zero' },
      { symbol: 'X_{Bi}', meaning: 'Current value (RHS) of the basic variable in row i' },
      { symbol: 'a_{ir}', meaning: 'Entry in row i of the pivot column r (must be strictly positive)' }
    ],
    example: 'Row 1: X_B = 10, a₁₁ = 2 -> ratio = 10/2 = 5; Row 2: X_B = 18, a₂₁ = 3 -> ratio = 18/3 = 6. Minimum ratio θ = 5 (Row 1 leaves).',
    tags: ['Simplex', 'Pivot Row', 'Ratio Test']
  },
  {
    id: 'f-106',
    moduleId: 'mod-1',
    moduleName: 'Operations Research & LPP',
    name: 'Primal-Dual Transformation Matrix',
    latex: '\\text{Primal: Max } Z = c^T x, \\, Ax \\le b \\iff \\text{Dual: Min } W = b^T y, \\, A^T y \\ge c',
    symbols: [
      { symbol: 'A', meaning: 'Primal constraint matrix (m × n)' },
      { symbol: 'A^T', meaning: 'Transpose of constraint matrix (n × m) used in dual' },
      { symbol: 'c', meaning: 'Primal objective coefficients (become Dual RHS)' },
      { symbol: 'b', meaning: 'Primal RHS constants (become Dual objective coefficients)' },
      { symbol: 'y', meaning: 'Vector of dual variables representing shadow prices' }
    ],
    example: 'Primal: Max Z = 3x₁ + 5x₂, 2x₁ + x₂ ≤ 4, x₁ + 2x₂ ≤ 6. Dual: Min W = 4y₁ + 6y₂, 2y₁ + y₂ ≥ 3, y₁ + 2y₂ ≥ 5.',
    tags: ['Duality', 'Primal', 'Dual', 'Shadow Price']
  },

  // Module 2
  {
    id: 'f-201',
    moduleId: 'mod-2',
    moduleName: 'Transportation Problem',
    name: 'Total Transportation Cost Objective',
    latex: '\\text{Minimize } Z = \\sum_{i=1}^m \\sum_{j=1}^n c_{ij} x_{ij} \\quad \\text{subject to } \\sum_{j=1}^n x_{ij} = a_i, \\, \\sum_{i=1}^m x_{ij} = b_j',
    symbols: [
      { symbol: 'c_{ij}', meaning: 'Unit freight shipping cost from source i to destination j' },
      { symbol: 'x_{ij}', meaning: 'Quantity shipped from source i to destination j' },
      { symbol: 'a_i', meaning: 'Available supply at source i' },
      { symbol: 'b_j', meaning: 'Required demand at destination j' }
    ],
    example: 'Z = 2(5) + 3(2) + 3(6) + 4(3) + 7(4) = 10 + 6 + 18 + 12 + 28 = $74.',
    tags: ['Transportation', 'Cost Matrix', 'Shipment']
  },
  {
    id: 'f-202',
    moduleId: 'mod-2',
    moduleName: 'Transportation Problem',
    name: 'Transportation Non-Degeneracy Condition',
    latex: '\\text{Number of Basic Allocated Cells} = m + n - 1',
    symbols: [
      { symbol: 'm', meaning: 'Number of supply origins / sources' },
      { symbol: 'n', meaning: 'Number of demand destinations' },
      { symbol: 'm + n - 1', meaning: 'Rank of the transportation constraint matrix' }
    ],
    example: 'For 3 factories and 4 warehouses: required basic cells = 3 + 4 - 1 = 6 allocations.',
    tags: ['Transportation', 'Degeneracy', 'Basic Cells']
  },
  {
    id: 'f-203',
    moduleId: 'mod-2',
    moduleName: 'Transportation Problem',
    name: 'MODI Multiplier Equation for Basic Cells',
    latex: 'u_i + v_j = c_{ij} \\quad \\forall (i, j) \\in \\text{Basic Cells}',
    symbols: [
      { symbol: 'u_i', meaning: 'Dual multiplier / shadow potential for row (source) i' },
      { symbol: 'v_j', meaning: 'Dual multiplier / shadow potential for column (destination) j' },
      { symbol: 'c_{ij}', meaning: 'Unit transportation cost for basic cell (i, j)' }
    ],
    example: 'Set u₁ = 0. If basic cell (1, 2) has cost c₁₂ = 4, then 0 + v₂ = 4 -> v₂ = 4.',
    tags: ['MODI', 'u-v Method', 'Dual Multipliers']
  },
  {
    id: 'f-204',
    moduleId: 'mod-2',
    moduleName: 'Transportation Problem',
    name: 'MODI Opportunity Cost (Net Evaluation)',
    latex: '\\Delta_{ij} = c_{ij} - (u_i + v_j) \\quad \\forall (i, j) \\in \\text{Non-Basic Cells}',
    symbols: [
      { symbol: '\\Delta_{ij}', meaning: 'Net change in total system cost per unit sent via empty cell (i, j)' },
      { symbol: 'c_{ij}', meaning: 'Actual shipping cost of empty cell' },
      { symbol: 'u_i + v_j', meaning: 'Implicit dual value of the route' }
    ],
    example: 'If c₂₃ = 5, u₂ = 2, v₃ = 4, then Δ₂₃ = 5 - (2 + 4) = 5 - 6 = -1 (not optimal, saves $1/unit).',
    tags: ['MODI', 'Opportunity Cost', 'Optimality Criterion']
  },

  // Module 3
  {
    id: 'f-301',
    moduleId: 'mod-3',
    moduleName: 'Assignment Problem',
    name: 'Binary Assignment Formulation',
    latex: '\\text{Min } Z = \\sum_{i=1}^n \\sum_{j=1}^n c_{ij} x_{ij} \\quad \\text{s.t.} \\quad \\sum_{j=1}^n x_{ij} = 1, \\, \\sum_{i=1}^n x_{ij} = 1, \\, x_{ij} \\in \\{0, 1\\}',
    symbols: [
      { symbol: 'x_{ij}', meaning: '1 if worker i is assigned to task j; 0 otherwise' },
      { symbol: 'c_{ij}', meaning: 'Cost or completion time for worker i performing task j' },
      { symbol: 'n', meaning: 'Number of workers and tasks (square matrix)' }
    ],
    example: 'Assign 3 nurses to 3 rooms: exactly 3 ones and 6 zeros in the solution matrix.',
    tags: ['Assignment', 'Hungarian', 'Binary']
  },
  {
    id: 'f-302',
    moduleId: 'mod-3',
    moduleName: 'Assignment Problem',
    name: 'Hungarian Matrix Revision (Theta Shift)',
    latex: 'c\'_{ij} = \\begin{cases} c_{ij} - \\theta, & \\text{if cell }(i,j)\\text{ is uncovered} \\\\ c_{ij} + \\theta, & \\text{if cell }(i,j)\\text{ is at intersection of 2 lines} \\\\ c_{ij}, & \\text{if cell }(i,j)\\text{ is covered by 1 line} \\end{cases}',
    symbols: [
      { symbol: '\\theta', meaning: 'Smallest uncovered element across all uncovered matrix cells' },
      { symbol: 'c_{ij}', meaning: 'Current cell value' },
      { symbol: 'c\'_{ij}', meaning: 'Revised cell value after theta operation' }
    ],
    example: 'If smallest uncovered element θ = 2, subtract 2 from all uncovered cells, and add 2 to cells where lines intersect.',
    tags: ['Hungarian', 'Line Covering', 'Matrix Revision']
  },
  {
    id: 'f-303',
    moduleId: 'mod-3',
    moduleName: 'Assignment Problem',
    name: 'Maximization Assignment Transformation',
    latex: 'c^{\\text{loss}}_{ij} = \\max_{k, l} (c_{kl}) - c_{ij}',
    symbols: [
      { symbol: '\\max_{k,l}(c_{kl})', meaning: 'Maximum profit value in the entire input matrix' },
      { symbol: 'c_{ij}', meaning: 'Original profit entry' },
      { symbol: 'c^{\\text{loss}}_{ij}', meaning: 'Relative opportunity loss entry (used for minimization)' }
    ],
    example: 'If highest profit is 48, an entry with profit 40 becomes 48 - 40 = 8 in the loss matrix.',
    tags: ['Assignment', 'Maximization', 'Opportunity Loss']
  },

  // Module 4
  {
    id: 'f-401',
    moduleId: 'mod-4',
    moduleName: 'Game Theory',
    name: 'Maximin & Minimax Principles',
    latex: '\\alpha = \\max_i \\left( \\min_j a_{ij} \\right) \\quad \\text{and} \\quad \\beta = \\min_j \\left( \\max_i a_{ij} \\right)',
    symbols: [
      { symbol: '\\alpha', meaning: 'Maximin value: Player A\'s guaranteed minimum security level' },
      { symbol: '\\beta', meaning: 'Minimax value: Player B\'s guaranteed maximum loss ceiling' },
      { symbol: 'a_{ij}', meaning: 'Payoff from Player B to Player A when strategies (A_i, B_j) are chosen' }
    ],
    example: 'If row minima are [2, 1, 3], Maximin = 3. If column maxima are [4, 3, 5], Minimax = 3. Maximin = Minimax = 3 (Saddle point).',
    tags: ['Game Theory', 'Maximin', 'Minimax', 'Saddle Point']
  },
  {
    id: 'f-402',
    moduleId: 'mod-4',
    moduleName: 'Game Theory',
    name: '2x2 Mixed Strategy Analytical Formula',
    latex: 'p_1 = \\frac{a_{22} - a_{21}}{D}, \\quad q_1 = \\frac{a_{22} - a_{12}}{D}, \\quad V = \\frac{a_{11} a_{22} - a_{12} a_{21}}{D}',
    symbols: [
      { symbol: 'D', meaning: 'Characteristic denominator: (a₁₁ + a₂₂) - (a₁₂ + a₂₁)' },
      { symbol: 'p_1, p_2', meaning: 'Player A\'s probabilities for strategies A₁ and A₂ (p₂ = 1 - p₁)' },
      { symbol: 'q_1, q_2', meaning: 'Player B\'s probabilities for strategies B₁ and B₂ (q₂ = 1 - q₁)' },
      { symbol: 'V', meaning: 'Value of the zero-sum game' }
    ],
    example: 'For [[5, 1], [3, 4]]: D = (5+4) - (1+3) = 5. p₁ = (4-3)/5 = 0.2, q₁ = (4-1)/5 = 0.6, V = (20-3)/5 = 3.4.',
    tags: ['Game Theory', 'Mixed Strategies', 'Value of Game']
  },
  {
    id: 'f-403',
    moduleId: 'mod-4',
    moduleName: 'Game Theory',
    name: '2xN Graphical Expected Payoff Line',
    latex: 'E_j(p_1) = (a_{1j} - a_{2j}) p_1 + a_{2j}, \\quad p_1 \\in [0, 1]',
    symbols: [
      { symbol: 'E_j(p_1)', meaning: 'Expected return line for Player A against Player B\'s strategy j' },
      { symbol: 'a_{1j}', meaning: 'Payoff when Player A plays A₁ (p₁ = 1)' },
      { symbol: 'a_{2j}', meaning: 'Payoff when Player A plays A₂ (p₁ = 0)' }
    ],
    example: 'If column B1 is [1, 8], at p₁=0 payoff is 8; at p₁=1 payoff is 1. Line: E = -7p₁ + 8.',
    tags: ['Game Theory', 'Graphical Method', 'Lower Envelope']
  },

  // Module 5
  {
    id: 'f-501',
    moduleId: 'mod-5',
    moduleName: 'OR Real-Life Applications',
    name: 'Markowitz Portfolio Variance Minimization',
    latex: '\\min_w \\, \\sigma_p^2 = w^T \\Sigma w = \\sum_{i=1}^n \\sum_{j=1}^n w_i w_j \\sigma_{ij} \\quad \\text{s.t.} \\quad \\sum_{i=1}^n w_i \\bar{R}_i = R_{\\text{target}}, \\, \\sum w_i = 1, \\, w_i \\ge 0',
    symbols: [
      { symbol: '\\sigma_p^2', meaning: 'Total portfolio risk (variance)' },
      { symbol: 'w_i', meaning: 'Proportion of capital invested in asset i' },
      { symbol: '\\sigma_{ij}', meaning: 'Covariance between returns of asset i and asset j' },
      { symbol: '\\bar{R}_i', meaning: 'Expected return of asset i' }
    ],
    example: 'Two assets with variance 0.04 and 0.09 and correlation 0.2: find optimal weights for 8% target return.',
    tags: ['Finance', 'Portfolio Optimization', 'Quadratic Programming']
  },
  {
    id: 'f-502',
    moduleId: 'mod-5',
    moduleName: 'OR Real-Life Applications',
    name: 'Economic Order Quantity (EOQ)',
    latex: 'Q^* = \\sqrt{\\frac{2 D S}{H}}',
    symbols: [
      { symbol: 'Q^*', meaning: 'Optimal order quantity minimizing total inventory cost' },
      { symbol: 'D', meaning: 'Annual consumer demand in units' },
      { symbol: 'S', meaning: 'Setup or ordering cost per batch' },
      { symbol: 'H', meaning: 'Annual holding or carrying cost per unit' }
    ],
    example: 'If D = 10,000 units/yr, S = $50/order, H = $2/unit/yr: Q* = sqrt((2*10000*50)/2) = 707 units.',
    tags: ['Inventory', 'EOQ', 'Supply Chain']
  }
];
