import { Module } from '../types';

export const modulesData: Module[] = [
  {
    id: 'mod-1',
    code: 'MOD 01',
    title: 'Operations Research & Linear Programming',
    shortTitle: 'OR & LPP',
    description: 'Foundations of Operations Research, mathematical formulation of LPP, graphical solutions, Simplex method, and duality principles.',
    iconName: 'TrendingUp',
    color: 'from-blue-600 to-indigo-700',
    topics: [
      {
        id: 't-1-1',
        moduleId: 'mod-1',
        moduleTitle: 'Operations Research & Linear Programming',
        title: 'Introduction to Operations Research',
        slug: 'intro-to-or',
        subtitle: 'Origins, Nature, Scope, and Decision-Making Framework',
        readingTimeMinutes: 7,
        introduction: 'Operations Research (OR) is a scientific approach to problem-solving and executive decision-making. Originated during World War II by British and American military planners to allocate scarce radar and logistical resources, OR has evolved into an essential discipline for modern industry, manufacturing, logistics, and finance.',
        detailedExplanation: [
          'Operations Research utilizes mathematical modeling, statistical analysis, and mathematical optimization to arrive at optimal or near-optimal solutions to complex decision-making problems.',
          'Key phases of an Operations Research study include: (1) Problem Formulation, (2) Mathematical Model Construction, (3) Deriving a Solution from the Model, (4) Model Testing and Validation, (5) Establishing Controls over the Solution, and (6) Implementation.',
          'Characteristics of OR include a systems orientation (viewing the organization as a unified whole), an interdisciplinary team approach, the application of scientific methodology, and uncovering optimal quantitative policies.',
          'Limitations of OR: It relies heavily on quantifiable factors; qualitative human and emotional aspects cannot be easily incorporated. Models are mathematical abstractions and often assume parameters remain deterministic over time.'
        ],
        definitions: [
          { term: 'Operations Research', definition: 'The application of scientific methods, techniques, and tools to problems involving the operations of a system so as to provide those in control with optimum solutions.' },
          { term: 'Mathematical Model', definition: 'An idealized mathematical representation consisting of equations, inequalities, and objective functions that describe the relationships between variables.' },
          { term: 'Deterministic Model', definition: 'A model where all parameters, inputs, and constraints are known with certainty (e.g., standard Linear Programming).' },
          { term: 'Stochastic Model', definition: 'A model where some parameters are subject to uncertainty and governed by probability distributions (e.g., queuing theory, simulation).' }
        ],
        formulas: [
          { name: 'General Optimization Problem', latex: '\\text{Optimize } Z = f(x_1, x_2, \\dots, x_n) \\quad \\text{subject to } g_i(x) \\le b_i', explanation: 'General non-linear or linear optimization structure where f is the objective function and g_i are constraints.' }
        ],
        numericalExamples: [
          {
            title: 'Conceptual Resource Allocation Evaluation',
            problemStatement: 'A factory manager needs to decide how to split 120 machine hours between Product A and Product B. Each unit of A yields $40 profit and requires 2 hours. Each unit of B yields $50 profit and requires 3 hours. Identify the decision variables, objective function, and constraint.',
            formulation: 'Decision Variables: x₁ = units of A, x₂ = units of B.\nMaximize Z = 40x₁ + 50x₂\nSubject to: 2x₁ + 3x₂ ≤ 120, x₁, x₂ ≥ 0',
            steps: [
              { stepNumber: 1, title: 'Define Decision Variables', description: 'Let x₁ be the quantity of Product A manufactured, and x₂ be the quantity of Product B manufactured.' },
              { stepNumber: 2, title: 'Formulate Objective Function', description: 'Total Profit = Profit from A + Profit from B: Maximize Z = 40x₁ + 50x₂.' },
              { stepNumber: 3, title: 'Formulate Machine Hour Constraint', description: 'Total machine hours consumed cannot exceed 120 hours: 2x₁ + 3x₂ ≤ 120.' },
              { stepNumber: 4, title: 'State Non-negativity Conditions', description: 'Negative production quantities are physically impossible: x₁ ≥ 0, x₂ ≥ 0.' }
            ],
            finalAnswer: 'Complete LPP: Maximize Z = 40x₁ + 50x₂, subject to 2x₁ + 3x₂ ≤ 120, and x₁, x₂ ≥ 0.',
            interpretations: ['If all 120 hours are used on A: x₁ = 60, Z = $2,400.', 'If all 120 hours are used on B: x₂ = 40, Z = $2,000. Producing A gives higher machine-hour yield ($20/hr vs $16.67/hr).']
          }
        ],
        realLifeExamples: [
          { industry: 'Aviation Logistics', caseTitle: 'Fleet Routing & Crew Scheduling', description: 'Major international airlines apply OR integer programming to assign 10,000+ crew members to 4,000 daily flights while obeying FAA mandatory rest rules.', benefit: 'Saves over $150M annually in deadheading and overtime costs.' },
          { industry: 'Hospital Healthcare', caseTitle: 'ICU Bed Allocation & Emergency Triage', description: 'Hospitals utilize queuing models and mixed-integer programming to schedule elective surgeries without overloading intensive care capacity.', benefit: 'Reduced elective surgery cancellations by 34%.' }
        ],
        examQuestions: [
          { question: 'Define Operations Research. Explain its main phases and discuss three practical limitations.', marks: 7, hint: 'Cover WWII origins, systems orientation, 6 phases, and quantitative vs qualitative trade-offs.' },
          { question: 'Distinguish between deterministic and probabilistic models with suitable business examples.', marks: 5, hint: 'Contrast fixed linear programming with stochastic inventory/queuing models.' }
        ],
        practiceQuestionIds: ['q-101', 'q-102', 'q-103']
      },
      {
        id: 't-1-2',
        moduleId: 'mod-1',
        moduleTitle: 'Operations Research & Linear Programming',
        title: 'Mathematical Formulation of LPP',
        slug: 'lpp-formulation',
        subtitle: 'Objective Functions, Decision Variables, and Technical Constraints',
        readingTimeMinutes: 10,
        introduction: 'Linear Programming Problem (LPP) is a mathematical modeling technique where a linear function is maximized or minimized subject to a set of linear equality or inequality constraints. It is one of the most widely applied optimization techniques in industrial engineering, economics, and business management.',
        detailedExplanation: [
          'Linearity implies two fundamental properties: (1) Proportionality: The contribution of each variable is directly proportional to its value. (2) Additivity: The total contribution is the exact arithmetic sum of individual contributions without interaction effects.',
          'Divisibility Assumption: Decision variables can take fractional or continuous values (unless formulated explicitly as Integer Programming).',
          'Certainty Assumption: All coefficients (c_j, a_ij, b_i) are deterministic constants known with absolute certainty.',
          'Steps for Formulation: (1) Identify the decision variables representing unknown quantities to be determined. (2) Formulate the objective function (cost minimization or profit maximization). (3) Identify and write down all physical, financial, or resource constraints as linear inequalities or equations. (4) Add explicit non-negativity restrictions.'
        ],
        definitions: [
          { term: 'Decision Variables', definition: 'Controllable variables representing physical activity levels (e.g., quantities to produce, invest, or ship).' },
          { term: 'Objective Function', definition: 'A linear mathematical expression representing the single criterion (e.g., profit, cost, time) to be optimized.' },
          { term: 'Constraints', definition: 'Linear mathematical inequalities or equations that define the physical, financial, or capacity limitations of the system.' },
          { term: 'Feasible Solution', definition: 'Any set of values for the decision variables that simultaneously satisfies all system constraints and non-negativity restrictions.' }
        ],
        formulas: [
          { name: 'Standard LPP Objective', latex: '\\text{Max or Min } Z = \\sum_{j=1}^{n} c_j x_j = c_1 x_1 + c_2 x_2 + \\dots + c_n x_n', explanation: 'Linear combination of decision variables with cost/profit coefficients.' },
          { name: 'Linear Constraints', latex: '\\sum_{j=1}^{n} a_{ij} x_j (\\le, =, \\ge) b_i, \\quad i = 1, 2, \\dots, m', explanation: 'System of m linear restrictions bounding the available resources.' },
          { name: 'Non-negativity Restriction', latex: 'x_j \\ge 0 \\quad \\forall j = 1, 2, \\dots, n', explanation: 'Variables cannot assume negative values in realistic physical systems.' }
        ],
        numericalExamples: [
          {
            title: 'Diet Problem Formulation (Cost Minimization)',
            problemStatement: 'A dietitian wishes to create a mixture of two foods: Food F1 and Food F2. Each unit of F1 costs $6 and contains 2 units of Vitamin A and 3 units of Vitamin B. Each unit of F2 costs $8 and contains 4 units of Vitamin A and 2 units of Vitamin B. The minimum daily human requirement is 40 units of Vitamin A and 50 units of Vitamin B. Formulate the LPP.',
            formulation: 'Minimize Cost Z = 6x₁ + 8x₂\nSubject to:\n2x₁ + 4x₂ ≥ 40 (Vitamin A)\n3x₁ + 2x₂ ≥ 50 (Vitamin B)\nx₁, x₂ ≥ 0',
            steps: [
              { stepNumber: 1, title: 'Identify Decision Variables', description: 'Let x₁ = units of Food F1 purchased daily, x₂ = units of Food F2 purchased daily.' },
              { stepNumber: 2, title: 'Formulate Objective Function', description: 'Cost from F1 = 6x₁, Cost from F2 = 8x₂. Total Cost Z = 6x₁ + 8x₂ (to be minimized).' },
              { stepNumber: 3, title: 'Formulate Vitamin A Constraint', description: 'Each unit of F1 provides 2 units, F2 provides 4 units. Minimum required is 40: 2x₁ + 4x₂ ≥ 40.' },
              { stepNumber: 4, title: 'Formulate Vitamin B Constraint', description: 'Each unit of F1 provides 3 units, F2 provides 2 units. Minimum required is 50: 3x₁ + 2x₂ ≥ 50.' },
              { stepNumber: 5, title: 'Non-negativity Conditions', description: 'You cannot purchase negative food: x₁ ≥ 0, x₂ ≥ 0.' }
            ],
            finalAnswer: 'Minimize Z = 6x₁ + 8x₂ subject to 2x₁ + 4x₂ ≥ 40, 3x₁ + 2x₂ ≥ 50, and x₁, x₂ ≥ 0.'
          }
        ],
        realLifeExamples: [
          { industry: 'Petroleum Refining', caseTitle: 'Crude Oil Blending', description: 'Refineries blend different grades of crude oil into gasoline, diesel, and jet fuel with octane and sulfur constraints to minimize input crude costs.', benefit: 'ExxonMobil estimates millions saved daily via linear programming blending models.' }
        ],
        examQuestions: [
          { question: 'A furniture manufacturer makes tables and chairs. Formulate an LPP to maximize profit given carpentry and finishing limits.', marks: 6, hint: 'Define x₁ and x₂, state profit equation, carpentry hour constraint, finishing hour constraint.' },
          { question: 'What are the essential assumptions underlying any Linear Programming Model? Discuss proportionality and additivity.', marks: 5, hint: 'List Proportionality, Additivity, Divisibility, and Certainty with examples.' }
        ],
        practiceQuestionIds: ['q-104', 'q-105', 'q-106']
      },
      {
        id: 't-1-3',
        moduleId: 'mod-1',
        moduleTitle: 'Operations Research & Linear Programming',
        title: 'Graphical Solution of Two-Variable LPP',
        slug: 'graphical-method',
        subtitle: 'Feasible Region, Corner Point Theorem, and Solution Types',
        readingTimeMinutes: 12,
        introduction: 'The Graphical Method is a geometric approach to solving linear programming problems involving exactly two decision variables (x₁ and x₂). It provides deep visual intuition into how constraints shape the feasible solution space and how the optimal corner point is determined.',
        detailedExplanation: [
          'Feasible Region: The intersection of all half-planes determined by the constraints together with the first quadrant (x₁ ≥ 0, x₂ ≥ 0). If the region is bounded by straight lines, it forms a convex polygon.',
          'Convexity Property: A set S is convex if the straight line segment joining any two points in S lies entirely within S. The feasible region of any LPP is always a convex set.',
          'Extreme Point (Corner Point) Theorem: If an optimal solution to an LPP exists, it must occur at one of the extreme points (vertices) of the convex feasible region.',
          'Types of Solutions: (1) Unique Optimal Solution: A single corner point maximizes/minimizes Z. (2) Multiple (Alternate) Optima: The objective function is parallel to a binding constraint boundary, meaning an infinite number of optimal points exist along that line segment. (3) Unbounded Solution: The feasible region extends to infinity and the objective value can increase without limit. (4) Infeasible Solution: No point satisfies all constraints simultaneously (empty feasible region).'
        ],
        definitions: [
          { term: 'Convex Polygon', definition: 'A closed geometric shape where any straight line segment between two interior points lies entirely within the shape.' },
          { term: 'Corner Point (Vertex)', definition: 'An extreme point of the feasible region formed by the intersection of two or more constraint boundary lines.' },
          { term: 'Iso-Profit / Iso-Cost Line', definition: 'A line representing all combinations of (x₁, x₂) that yield the exact same objective value Z.' },
          { term: 'Alternate Optima', definition: 'A situation occurring when the slope of the objective line matches the slope of a binding constraint, yielding infinite optimal points.' }
        ],
        formulas: [
          { name: 'Corner Point Evaluation', latex: 'Z_k = c_1 x_{1k} + c_2 x_{2k}, \\quad k = 1, 2, \\dots, p', explanation: 'Evaluate Z at all p corner vertices; pick the highest for Max or lowest for Min.' },
          { name: 'Objective Slope', latex: 'm_Z = -\\frac{c_1}{c_2}, \\quad m_{\\text{constraint}} = -\\frac{a_1}{a_2}', explanation: 'If m_Z = m_constraint on a binding boundary, multiple optimal solutions occur.' }
        ],
        numericalExamples: [
          {
            title: 'Maximization with Unique Optimal Vertex',
            problemStatement: 'Solve graphically: Maximize Z = 3x₁ + 5x₂ subject to:\nx₁ + 2x₂ ≤ 20\nx₁ + x₂ ≤ 15\nx₁, x₂ ≥ 0',
            formulation: 'Boundary 1: x₁ + 2x₂ = 20 -> Intercepts: (0, 10), (20, 0)\nBoundary 2: x₁ + x₂ = 15 -> Intercepts: (0, 15), (15, 0)',
            steps: [
              { stepNumber: 1, title: 'Find Intercepts of Boundary Lines', description: 'Line 1: When x₁=0, x₂=10; when x₂=0, x₁=20. Line 2: When x₁=0, x₂=15; when x₂=0, x₁=15.' },
              { stepNumber: 2, title: 'Find Line Intersection Point', description: 'Subtract (x₁ + x₂ = 15) from (x₁ + 2x₂ = 20): x₂ = 5. Substituting gives x₁ = 10. Intersection point is (10, 5).' },
              { stepNumber: 3, title: 'Identify Feasible Corner Points', description: 'Feasible region is bounded by vertices: O(0, 0), A(15, 0), B(10, 5), and C(0, 10).' },
              { stepNumber: 4, title: 'Evaluate Objective Function at Vertices', description: 'O(0, 0): Z = 3(0) + 5(0) = 0\nA(15, 0): Z = 3(15) + 5(0) = 45\nB(10, 5): Z = 3(10) + 5(5) = 30 + 25 = 55\nC(0, 10): Z = 3(0) + 5(10) = 50' },
              { stepNumber: 5, title: 'Select the Maximum Value', description: 'Maximum value of Z is 55, which occurs at vertex B(10, 5).' }
            ],
            finalAnswer: 'Optimal Solution: x₁ = 10, x₂ = 5, with Maximum Z = 55.',
            interpretations: ['Both constraints are fully utilized (binding) at the optimal point.', 'Producing 10 units of x₁ and 5 units of x₂ yields the absolute highest profit under resource restrictions.']
          }
        ],
        realLifeExamples: [
          { industry: 'Manufacturing', caseTitle: 'Carpentry Workshop Optimization', description: 'A craftsman balancing wooden desks vs chairs given fixed wood supplies and labor hours uses graphical analysis to visually demonstrate trade-offs to apprentices.', benefit: 'Guarantees 100% capacity utilization with zero idle inventory.' }
        ],
        examQuestions: [
          { question: 'Solve graphically: Maximize Z = 4x₁ + 3x₂ subject to 2x₁ + x₂ ≤ 1000, x₁ + x₂ ≤ 800, x₁ ≤ 400, x₁, x₂ ≥ 0.', marks: 10, hint: 'Plot lines, find intersections, test all corner points in table.' },
          { question: 'Explain with neat diagrams the conditions under which an LPP has: (a) Multiple optimal solutions, (b) Unbounded solution, (c) Infeasible solution.', marks: 8, hint: 'Draw parallel objective line, open region, and contradictory non-overlapping half-planes.' }
        ],
        practiceQuestionIds: ['q-107', 'q-108', 'q-109']
      },
      {
        id: 't-1-4',
        moduleId: 'mod-1',
        moduleTitle: 'Operations Research & Linear Programming',
        title: 'Standard Form, Slack, Surplus & Artificial Variables',
        slug: 'standard-form-variables',
        subtitle: 'Converting General Inequalities into Canonical Algebraic Systems',
        readingTimeMinutes: 9,
        introduction: 'To solve an LPP algebraically using the Simplex algorithm, the system must first be transformed into Standard Form, where all constraints are converted into strict linear equalities with non-negative right-hand-side constants.',
        detailedExplanation: [
          'Characteristics of Standard Form: (1) All constraints are expressed as equalities (=). (2) All decision and auxiliary variables are non-negative. (3) The right-hand side constant b_i of each constraint is non-negative (b_i ≥ 0). If negative, multiply the entire row by -1 and reverse the inequality sign.',
          'Slack Variable (s_i): Added to a less-than-or-equal-to constraint (≤) to represent unused or idle capacity: a₁x₁ + a₂x₂ + s₁ = b₁. Objective function coefficient is 0.',
          'Surplus Variable (e_i): Subtracted from a greater-than-or-equal-to constraint (≥) to represent excess over the minimum requirement: a₁x₁ + a₂x₂ - e₁ = b₁. Objective coefficient is 0.',
          'Artificial Variable (A_i): Added to constraints having (≥) or (=) to furnish an immediate identity matrix (initial basic feasible solution). Since artificial variables have no real physical meaning, they are heavily penalized in the objective function with a large penalty M (Big-M method) or driven to zero in Phase I of the Two-Phase method.'
        ],
        definitions: [
          { term: 'Slack Variable', definition: 'A non-negative variable added to a (≤) constraint representing unused or idle resources. Cost in objective function is 0.' },
          { term: 'Surplus Variable', definition: 'A non-negative variable subtracted from a (≥) constraint representing amount exceeding the minimum requirement.' },
          { term: 'Artificial Variable', definition: 'A fictitious non-negative variable added to supply an initial starting basis, assigned a huge penalty M in the objective.' },
          { term: 'Basic Feasible Solution (BFS)', definition: 'A basic solution where all basic variables are non-negative (x_B ≥ 0).' }
        ],
        formulas: [
          { name: 'Slack Transformation (≤)', latex: 'a_{i1} x_1 + \\dots + a_{in} x_n \\le b_i \\implies a_{i1} x_1 + \\dots + a_{in} x_n + s_i = b_i, \\quad s_i \\ge 0', explanation: 'Adds non-negative slack s_i to absorb surplus capacity.' },
          { name: 'Surplus & Artificial Transformation (≥)', latex: 'a_{i1} x_1 + \\dots + a_{in} x_n \\ge b_i \\implies \\sum a_{ij} x_j - e_i + A_i = b_i', explanation: 'Subtracts surplus e_i and adds artificial A_i to supply initial basis.' }
        ],
        numericalExamples: [
          {
            title: 'Converting Mixed Inequalities into Standard Form',
            problemStatement: 'Convert the following LPP into standard form ready for Simplex:\nMaximize Z = 4x₁ + 5x₂\nSubject to:\n2x₁ + 3x₂ ≤ 18\nx₁ + 4x₂ ≥ 10\nx₁ - x₂ = 5\nx₁, x₂ ≥ 0',
            formulation: 'Add slack s₁ to Constraint 1.\nSubtract surplus e₂ and add artificial A₂ to Constraint 2.\nAdd artificial A₃ to Constraint 3.',
            steps: [
              { stepNumber: 1, title: 'Transform Constraint 1 (≤)', description: '2x₁ + 3x₂ + s₁ = 18 with s₁ ≥ 0.' },
              { stepNumber: 2, title: 'Transform Constraint 2 (≥)', description: 'x₁ + 4x₂ - e₂ + A₂ = 10 with e₂ ≥ 0, A₂ ≥ 0.' },
              { stepNumber: 3, title: 'Transform Constraint 3 (=)', description: 'x₁ - x₂ + A₃ = 5 with A₃ ≥ 0.' },
              { stepNumber: 4, title: 'Augment Objective Function', description: 'Maximize Z = 4x₁ + 5x₂ + 0s₁ + 0e₂ - M·A₂ - M·A₃ (where M is a very large positive penalty).' }
            ],
            finalAnswer: 'Standard Form: Maximize Z = 4x₁ + 5x₂ + 0s₁ + 0e₂ - M A₂ - M A₃ subject to 2x₁ + 3x₂ + s₁ = 18, x₁ + 4x₂ - e₂ + A₂ = 10, x₁ - x₂ + A₃ = 5, all variables ≥ 0.'
          }
        ],
        realLifeExamples: [
          { industry: 'Semiconductor Fabrication', caseTitle: 'Wafer Cleanroom Capacity', description: 'Slack variables directly represent cleanroom idle time in wafer fabrication scheduling, helping plant engineers identify bottleneck tools.', benefit: 'Enables precise capital expenditure planning for bottleneck equipment.' }
        ],
        examQuestions: [
          { question: 'Distinguish between Slack, Surplus, and Artificial variables. Why are artificial variables assigned a penalty in the objective function?', marks: 6, hint: 'Discuss physical meaning, initial identity basis, and Big-M penalty.' },
          { question: 'Convert an LPP with negative RHS constants and unrestricted variables into standard canonical form.', marks: 7, hint: 'Multiply by -1 and substitute xj = xj\' - xj\'\'.' }
        ],
        practiceQuestionIds: ['q-110', 'q-111', 'q-112']
      },
      {
        id: 't-1-5',
        moduleId: 'mod-1',
        moduleTitle: 'Operations Research & Linear Programming',
        title: 'The Simplex Algorithm & Tableau Method',
        slug: 'simplex-algorithm',
        subtitle: 'Iterative Algebraic Optimization, Pivot Operations, and Optimality Tests',
        readingTimeMinutes: 14,
        introduction: 'The Simplex Algorithm, developed by George Dantzig in 1947, is one of the most powerful and celebrated mathematical algorithms of the 20th century. It systematically moves from one basic feasible solution (extreme point) to an adjacent improved extreme point until no further improvement can be made.',
        detailedExplanation: [
          'Basic and Non-Basic Variables: In an LPP with m constraints and n variables (n > m), set (n - m) variables to zero (Non-Basic Variables) and solve the remaining m equations for the m Basic Variables.',
          'Initial Simplex Tableau: Constructed with initial basic variables (typically slack variables). Each row shows the basic variable, its objective coefficient C_B, RHS value X_B, and substitution coefficients.',
          'Net Evaluation (Index Row) C_j - Z_j: For each column, Z_j = Σ(C_B * a_ij). C_j - Z_j represents the net increase in objective value per unit increase in the non-basic variable x_j.',
          'Optimality Criterion: For Maximization, if all C_j - Z_j ≤ 0, the current tableau is optimal! For Minimization, if all C_j - Z_j ≥ 0, it is optimal.',
          'Entering Variable (Pivot Column): Selected as the variable with the largest positive C_j - Z_j (for Maximization).',
          'Leaving Variable (Pivot Row): Selected using the Minimum Ratio Test: θ = min { X_Bi / a_ir } for all positive pivot column entries a_ir > 0.',
          'Pivot Element: The intersection of the pivot column and pivot row. Gauss-Jordan row transformations are applied to convert the pivot element to 1 and all other elements in that column to 0.'
        ],
        definitions: [
          { term: 'Simplex Tableau', definition: 'A structured matrix organizing basic variables, constraint coefficients, and evaluation rows for iterative computation.' },
          { term: 'Pivot Column (Key Column)', definition: 'The column of the entering variable having the most favorable net evaluation.' },
          { term: 'Pivot Row (Key Row)', definition: 'The row of the departing variable determined by the minimum positive ratio test.' },
          { term: 'Pivot Element (Key Element)', definition: 'The number at the intersection of the pivot row and pivot column.' },
          { term: 'Degeneracy in Simplex', definition: 'Occurs when there is a tie in the minimum ratio test, causing one or more basic variables to become zero.' }
        ],
        formulas: [
          { name: 'Net Evaluation', latex: 'C_j - Z_j = C_j - \\sum_{i=1}^{m} c_{Bi} a_{ij}', explanation: 'Indicator value showing rate of improvement if variable enters basis.' },
          { name: 'Minimum Ratio Test', latex: '\\theta = \\min_{i} \\left\\{ \\frac{X_{Bi}}{a_{ir}} \\;\\middle|\\; a_{ir} > 0 \\right\\}', explanation: 'Determines which basic variable leaves to maintain feasibility.' },
          { name: 'Row Transformation Rule', latex: 'R_{\\text{new}} = R_{\\text{old}} - (\\text{column entry}) \\times R_{\\text{pivot}}', explanation: 'Gauss-Jordan row operations to update tableau entries.' }
        ],
        numericalExamples: [
          {
            title: 'Two-Iteration Simplex Tableau Solution',
            problemStatement: 'Solve by Simplex Method:\nMaximize Z = 3x₁ + 2x₂\nSubject to:\n2x₁ + x₂ ≤ 10\nx₁ + 3x₂ ≤ 15\nx₁, x₂ ≥ 0',
            formulation: 'Add slacks s₁, s₂:\nMaximize Z = 3x₁ + 2x₂ + 0s₁ + 0s₂\n2x₁ + x₂ + s₁ = 10\nx₁ + 3x₂ + s₂ = 15\nx₁, x₂, s₁, s₂ ≥ 0',
            steps: [
              { stepNumber: 1, title: 'Construct Initial Tableau', description: 'Basis = {s₁, s₂}. C_B = [0, 0]. X_B = [10, 15]. Z_j = [0, 0, 0, 0]. C_j - Z_j = [3, 2, 0, 0]. Current Z = 0.' },
              { stepNumber: 2, title: 'Iteration 1: Select Pivot', description: 'Most positive C_j - Z_j is 3 in x₁ column (Entering var: x₁). Ratios: s₁: 10/2 = 5; s₂: 15/1 = 15. Min ratio is 5 at Row 1 (Leaving var: s₁). Pivot element = 2.' },
              { stepNumber: 3, title: 'Perform Row Operations', description: 'Row 1 (new) = Row 1 / 2 = [1, 0.5, 0.5, 0 | 5]. Row 2 (new) = Row 2 - 1*(Row 1 new) = [0, 2.5, -0.5, 1 | 10]. Basis is now {x₁, s₂}.' },
              { stepNumber: 4, title: 'Iteration 2: Evaluate Tableau', description: 'C_B = [3, 0]. Z_j for x₂ = 3*(0.5) = 1.5. C₂ - Z₂ = 2 - 1.5 = 0.5 > 0. Entering var: x₂. Ratios: x₁: 5/0.5 = 10; s₂: 10/2.5 = 4. Min ratio = 4 at Row 2. Pivot = 2.5.' },
              { stepNumber: 5, title: 'Final Tableau Optimality Check', description: 'After pivoting, Basis is {x₁, x₂} with values x₁ = 3, x₂ = 4. All C_j - Z_j ≤ 0. Optimum reached! Max Z = 3(3) + 2(4) = 17.' }
            ],
            finalAnswer: 'Optimal Solution: x₁ = 3, x₂ = 4, with Maximum Z = 17.'
          }
        ],
        realLifeExamples: [
          { industry: 'Supply Chain & Manufacturing', caseTitle: 'Global Refinery Optimization', description: 'Simplex algorithms run daily inside SAP and AspenTech ERP engines solving systems with over 100,000 variables in seconds.', benefit: 'Optimizes entire global petrochemical product flows.' }
        ],
        examQuestions: [
          { question: 'Explain the step-by-step Simplex Algorithm procedure for solving a linear programming problem.', marks: 10, hint: 'Detail standard form, initial BFS, Cj-Zj calculation, entering/leaving selection, row operations.' },
          { question: 'What is degeneracy in Simplex? How does cycling occur, and how is it resolved?', marks: 6, hint: 'Mention tie in theta ratio, Bland\'s anticycling rule, and perturbation method.' }
        ],
        practiceQuestionIds: ['q-113', 'q-114', 'q-115']
      },
      {
        id: 't-1-6',
        moduleId: 'mod-1',
        moduleTitle: 'Operations Research & Linear Programming',
        title: 'Concept of Duality & Dual Formulation',
        slug: 'duality-in-lpp',
        subtitle: 'Primal-Dual Relationships, Shadow Prices, and Economic Interpretation',
        readingTimeMinutes: 11,
        introduction: 'Every linear programming problem (termed the Primal) has an associated, mathematically symmetric problem called the Dual. The dual provides profound insights into economic valuation, resource scarcity, and shadow prices.',
        detailedExplanation: [
          'Duality Theorem: If the primal problem has an optimal finite solution, the dual problem also has an optimal finite solution, and their optimal objective values are strictly identical: Max Z = Min W.',
          'Weak Duality: For any feasible solution x to the primal and any feasible solution y to the dual, Z(x) ≤ W(y).',
          'Shadow Price: The optimal value of dual variable y_i represents the marginal increase in the objective function per unit increase in the availability of resource i.',
          'Complementary Slackness Theorem: At optimality, if a primal constraint has slack (s_i > 0), the corresponding dual variable is zero (y_i = 0). Conversely, if a dual variable is strictly positive (y_i > 0), the corresponding primal constraint must be strictly binding (s_i = 0).',
          'Symmetric Rules of Primal-Dual Conversion: Primal Maximize becomes Dual Minimize. Primal objective coefficients become Dual RHS constants. Primal RHS constants become Dual objective coefficients. Primal constraint coefficient matrix A is transposed to Aᵀ. Primal ≤ inequalities correspond to non-negative dual variables (y_i ≥ 0).'
        ],
        definitions: [
          { term: 'Primal Problem', definition: 'The original linear programming formulation representing the direct physical or business problem.' },
          { term: 'Dual Problem', definition: 'An auxiliary linear programming problem derived from the primal that provides economic shadow price information.' },
          { term: 'Shadow Price', definition: 'The marginal economic value of an additional unit of a constrained resource.' },
          { term: 'Complementary Slackness', definition: 'A mathematical relationship stating that positive slack in a constraint implies zero economic value for its shadow price.' }
        ],
        formulas: [
          { name: 'Primal Formulation', latex: '\\text{Max } Z = c^T x \\quad \\text{subject to } Ax \\le b, \\quad x \\ge 0', explanation: 'Standard primal maximization problem in matrix notation.' },
          { name: 'Dual Formulation', latex: '\\text{Min } W = b^T y \\quad \\text{subject to } A^T y \\ge c, \\quad y \\ge 0', explanation: 'Symmetric dual minimization problem.' },
          { name: 'Strong Duality', latex: 'Z_{\\text{max}}^* = W_{\\text{min}}^*', explanation: 'At optimality, primal objective equals dual objective.' }
        ],
        numericalExamples: [
          {
            title: 'Formulating the Dual from Primal LPP',
            problemStatement: 'Write the dual of the following primal LPP:\nMaximize Z = 40x₁ + 30x₂\nSubject to:\n2x₁ + x₂ ≤ 40\nx₁ + 2x₂ ≤ 50\nx₁ + x₂ ≤ 30\nx₁, x₂ ≥ 0',
            formulation: 'Primal has 2 variables and 3 constraints.\nTherefore, Dual will have 3 variables (y₁, y₂, y₃) and 2 constraints.',
            steps: [
              { stepNumber: 1, title: 'Identify Dual Objective Function', description: 'Coefficients are the primal RHS constants [40, 50, 30]. Dual minimizes: Minimize W = 40y₁ + 50y₂ + 30y₃.' },
              { stepNumber: 2, title: 'Formulate Dual Constraint 1 (for x₁)', description: 'Take coefficients of x₁ from primal: 2y₁ + 1y₂ + 1y₃ ≥ 40 (Primal c₁).' },
              { stepNumber: 3, title: 'Formulate Dual Constraint 2 (for x₂)', description: 'Take coefficients of x₂ from primal: 1y₁ + 2y₂ + 1y₃ ≥ 30 (Primal c₂).' },
              { stepNumber: 4, title: 'State Dual Non-negativity', description: 'Because all primal constraints are (≤), all dual variables are non-negative: y₁, y₂, y₃ ≥ 0.' }
            ],
            finalAnswer: 'Dual: Minimize W = 40y₁ + 50y₂ + 30y₃ subject to 2y₁ + y₂ + y₃ ≥ 40, y₁ + 2y₂ + y₃ ≥ 30, and y₁, y₂, y₃ ≥ 0.'
          }
        ],
        realLifeExamples: [
          { industry: 'Cloud Computing & Data Centers', caseTitle: 'Amazon AWS Spot Instance Pricing', description: 'AWS uses dual shadow prices derived from real-time server cluster LPPs to set spot market bid pricing for spare CPU cores.', benefit: 'Monetizes 99% of idle data center capacity dynamically.' }
        ],
        examQuestions: [
          { question: 'State and prove the Weak Duality Theorem and Strong Duality Theorem.', marks: 8, hint: 'Express Z and W in vector notation: cTx <= yTAx <= yTb = bTy.' },
          { question: 'Formulate the dual of a given mixed LPP containing <=, >=, and = constraints.', marks: 7, hint: 'Identify sign restrictions: <= gives y>=0, >= gives y<=0, = gives y unrestricted.' }
        ],
        practiceQuestionIds: ['q-116', 'q-117', 'q-118']
      }
    ]
  },
  {
    id: 'mod-2',
    code: 'MOD 02',
    title: 'Transportation Problem (TP)',
    shortTitle: 'Transportation',
    description: 'Cost matrix modeling, balanced/unbalanced balancing, IBFS techniques (NW Corner, Least Cost, VAM), and MODI optimality testing.',
    iconName: 'Truck',
    color: 'from-teal-600 to-emerald-700',
    topics: [
      {
        id: 't-2-1',
        moduleId: 'mod-2',
        moduleTitle: 'Transportation Problem',
        title: 'Introduction & Cost Matrix Modeling',
        slug: 'intro-transportation',
        subtitle: 'Origins, Destinations, Balanced vs. Unbalanced Transportation Systems',
        readingTimeMinutes: 8,
        introduction: 'The Transportation Problem (TP) is a special class of linear programming problem that deals with transporting a single homogeneous commodity from several origins (sources/factories) to several destinations (warehouses/markets) at minimal total transportation cost.',
        detailedExplanation: [
          'Structure of Transportation Table: An m × n matrix where m sources have supplies a_i, and n destinations have demands b_j. Each cell (i, j) has a unit shipping cost c_ij.',
          'Balanced vs. Unbalanced: A TP is Balanced if Total Supply = Total Demand (Σ a_i = Σ b_j). If Total Supply > Total Demand, create a dummy destination with demand = (Σ a_i - Σ b_j) and zero shipping costs (c_i,dummy = 0). If Total Demand > Total Supply, create a dummy source with supply = (Σ b_j - Σ a_i) and zero shipping costs.',
          'Special Properties: Every TP with integer supplies and demands guarantees integer basic feasible solutions without requiring integer programming algorithms (total unimodularity property).'
        ],
        definitions: [
          { term: 'Origin (Source)', definition: 'A facility where the product is supplied or manufactured (capacity a_i).' },
          { term: 'Destination', definition: 'A market or warehouse where the product is received (requirement b_j).' },
          { term: 'Cost Matrix', definition: 'A grid containing the per-unit freight charges c_ij between all source-destination pairs.' },
          { term: 'Dummy Node', definition: 'A fictitious source or destination introduced with zero unit costs to balance an unequal supply-demand system.' }
        ],
        formulas: [
          { name: 'Total Transportation Cost', latex: '\\text{Min } Z = \\sum_{i=1}^{m} \\sum_{j=1}^{n} c_{ij} x_{ij}', explanation: 'Total cost objective to be minimized.' },
          { name: 'Balance Condition', latex: '\\sum_{i=1}^{m} a_i = \\sum_{j=1}^{n} b_j', explanation: 'Condition required for feasible basic solution.' },
          { name: 'Basic Cell Condition', latex: 'm + n - 1', explanation: 'Exact number of basic allocated cells required for non-degeneracy.' }
        ],
        numericalExamples: [
          {
            title: 'Balancing an Unbalanced Transportation Table',
            problemStatement: 'A company has 3 plants with supplies: Plant 1: 250 units, Plant 2: 300 units, Plant 3: 400 units. It serves 3 warehouses with demands: Warehouse A: 200 units, Warehouse B: 250 units, Warehouse C: 350 units. Check balance and balance the problem.',
            steps: [
              { stepNumber: 1, title: 'Calculate Total Supply', description: 'Total Supply = 250 + 300 + 400 = 950 units.' },
              { stepNumber: 2, title: 'Calculate Total Demand', description: 'Total Demand = 200 + 250 + 350 = 800 units.' },
              { stepNumber: 3, title: 'Determine Difference', description: 'Supply (950) > Demand (800) by 150 units. The problem is Unbalanced.' },
              { stepNumber: 4, title: 'Introduce Dummy Column', description: 'Add a fictitious "Dummy Warehouse D" with demand = 150 units, and unit shipping costs c_1D = c_2D = c_3D = 0.' }
            ],
            finalAnswer: 'Balanced problem has 3 sources and 4 destinations (including Dummy D with demand 150 and zero costs). Total units = 950.'
          }
        ],
        realLifeExamples: [
          { industry: 'E-Commerce Logistics', caseTitle: 'Amazon Fulfillment Routing', description: 'Amazon balances inventory shipments between 150 regional fulfillment centers and hundreds of sort centers to minimize delivery miles.', benefit: 'Reduces inter-state freight transit expenses by 18%.' }
        ],
        examQuestions: [
          { question: 'Explain how an unbalanced transportation problem is converted into a balanced one with a practical example.', marks: 5, hint: 'Discuss dummy source vs dummy destination with 0 costs.' }
        ],
        practiceQuestionIds: ['q-201', 'q-202']
      },
      {
        id: 't-2-2',
        moduleId: 'mod-2',
        moduleTitle: 'Transportation Problem',
        title: 'Initial Basic Feasible Solution (IBFS)',
        slug: 'ibfs-methods',
        subtitle: 'North-West Corner Rule and Least Cost Method (LCM)',
        readingTimeMinutes: 12,
        introduction: 'Finding an Initial Basic Feasible Solution (IBFS) is the first mandatory phase in solving a transportation problem. Standard methods include the North-West Corner Rule, the Least Cost Method (Matrix Minimum), and Vogel\'s Approximation Method.',
        detailedExplanation: [
          'North-West Corner Rule (NWCR): Starts mechanically at the top-left cell (1, 1). Allocates min(Supply₁, Demand₁). Depletes either the row or column, then moves right or down. It ignores costs completely and is purely geometric.',
          'Least Cost Method (LCM): A greedy heuristic that searches the entire matrix for the cell with the lowest unit cost c_ij. Allocates the maximum feasible quantity min(Supply_i, Demand_j). Crosses out the satisfied row or column and repeats.',
          'Comparison: LCM generally produces a much lower initial cost than NWCR because it actively seeks low-cost routes from the start.'
        ],
        definitions: [
          { term: 'North-West Corner', definition: 'The topmost, leftmost cell (1, 1) of the transportation table.' },
          { term: 'Least Cost Method', definition: 'An allocation procedure that prioritizes the cell having the minimum shipping charge across the active matrix.' },
          { term: 'Allocation (x_ij)', definition: 'The physical number of units assigned to route from source i to destination j.' }
        ],
        formulas: [
          { name: 'Allocation Quantity', latex: 'x_{ij} = \\min(a_i, b_j)', explanation: 'Maximum permissible allocation to cell (i, j) without violating capacity.' }
        ],
        numericalExamples: [
          {
            title: 'NWCR vs Least Cost Method Step-by-Step',
            problemStatement: 'Given Cost Matrix:\nS1: [2, 7, 4] | Supply = 5\nS2: [3, 3, 1] | Supply = 8\nS3: [5, 4, 7] | Supply = 7\nDemands: D1 = 7, D2 = 9, D3 = 4.\nFind IBFS using North-West Corner Rule.',
            steps: [
              { stepNumber: 1, title: 'Cell (1, 1)', description: 'Min(Supply 5, Demand 7) = 5 allocated. Supply S1 becomes 0. Demand D1 remaining = 2. Move down to (2, 1).' },
              { stepNumber: 2, title: 'Cell (2, 1)', description: 'Min(Supply 8, Demand 2) = 2 allocated. Demand D1 becomes 0. Supply S2 remaining = 6. Move right to (2, 2).' },
              { stepNumber: 3, title: 'Cell (2, 2)', description: 'Min(Supply 6, Demand 9) = 6 allocated. Supply S2 becomes 0. Demand D2 remaining = 3. Move down to (3, 2).' },
              { stepNumber: 4, title: 'Cell (3, 2)', description: 'Min(Supply 7, Demand 3) = 3 allocated. Demand D2 becomes 0. Supply S3 remaining = 4. Move right to (3, 3).' },
              { stepNumber: 5, title: 'Cell (3, 3)', description: 'Min(Supply 4, Demand 4) = 4 allocated. Both S3 and D3 become 0.' }
            ],
            finalAnswer: 'Allocations: x₁₁=5 (cost 2), x₂₁=2 (cost 3), x₂₂=6 (cost 3), x₃₂=3 (cost 4), x₃₃=4 (cost 7).\nTotal Cost = 5(2) + 2(3) + 6(3) + 3(4) + 4(7) = 10 + 6 + 18 + 12 + 28 = $74.'
          }
        ],
        realLifeExamples: [
          { industry: 'Beverage Bottling', caseTitle: 'Coca-Cola Regional Distribution', description: 'Bottling plants use IBFS procedures to quickly generate feasible initial daily dispatch schedules before running full MILP solvers.', benefit: 'Generates operational dispatch runs in under 3 seconds.' }
        ],
        examQuestions: [
          { question: 'Find an initial basic feasible solution using the Least Cost Method for a 3x4 transportation table.', marks: 8, hint: 'Identify lowest cost cell, assign max possible, cross out satisfied row/col, repeat.' }
        ],
        practiceQuestionIds: ['q-203', 'q-204', 'q-205']
      },
      {
        id: 't-2-3',
        moduleId: 'mod-2',
        moduleTitle: 'Transportation Problem',
        title: 'Optimality Test: MODI (u-v) Method & Stepping Stone',
        slug: 'modi-method',
        subtitle: 'Dual Multipliers, Opportunity Cost Evaluation, and Closed Loop Improvement',
        readingTimeMinutes: 15,
        introduction: 'The Modified Distribution (MODI) Method, also known as the u-v Method, is an exact algorithm to test whether an IBFS is optimal, and if not, to systematically reallocate units along a closed stepping-stone loop until total cost is minimized.',
        detailedExplanation: [
          'Pre-Condition for MODI: The solution must be non-degenerate, meaning the number of allocated basic cells must equal exactly m + n - 1, and the allocations must not form a closed loop.',
          'Step 1 (Multipliers u_i and v_j): For every allocated cell (i, j), the dual equation u_i + v_j = c_ij must hold. Set u₁ = 0 as base and solve the system of equations for all u_i and v_j.',
          'Step 2 (Opportunity Cost / Net Evaluation): For every unallocated (empty) cell (i, j), compute the opportunity cost Δ_ij = c_ij - (u_i + v_j).',
          'Optimality Criterion: If all Δ_ij ≥ 0, the current transportation schedule is OPTIMAL! No reallocation can reduce cost.',
          'Step 3 (Reallocation): If any Δ_ij < 0, pick the cell with the most negative Δ_ij as the entering cell. Form a closed stepping-stone loop starting at the entering cell, turning only on basic allocated cells, and alternating signs (+, -, +, -).',
          'Shift Quantity θ: θ = min { allocations at negative (-) corners of the loop }. Add θ to positive corners, subtract θ from negative corners, and recompute total cost.'
        ],
        definitions: [
          { term: 'Dual Multipliers (u_i, v_j)', definition: 'Row numbers u_i and column numbers v_j derived such that u_i + v_j = c_ij for all basic cells.' },
          { term: 'Opportunity Cost (Δ_ij)', definition: 'The net change in total cost if one unit of product is routed through unallocated cell (i, j): Δ_ij = c_ij - (u_i + v_j).' },
          { term: 'Stepping Stone Loop', definition: 'A closed path of alternating horizontal and vertical line segments whose corners lie on basic cells, with only the starting corner on an empty cell.' }
        ],
        formulas: [
          { name: 'Basic Cell Multiplier Equation', latex: 'u_i + v_j = c_{ij} \\quad \\forall (i, j) \\in \\text{Allocated Cells}', explanation: 'Relationship linking dual row and column variables to unit costs.' },
          { name: 'Opportunity Cost Equation', latex: '\\Delta_{ij} = c_{ij} - (u_i + v_j) \\quad \\forall (i, j) \\in \\text{Unallocated Cells}', explanation: 'Net evaluation criterion. Must be ≥ 0 for optimality.' }
        ],
        numericalExamples: [
          {
            title: 'Full MODI Optimality Verification',
            problemStatement: 'Verify optimality of an allocation where basic cells are (1,1)=5 (cost 2), (2,1)=2 (cost 3), (2,2)=6 (cost 3), (3,2)=3 (cost 4), (3,3)=4 (cost 7). Costs: Row 1: [2, 7, 4], Row 2: [3, 3, 1], Row 3: [5, 4, 7].',
            steps: [
              { stepNumber: 1, title: 'Solve for u_i and v_j', description: 'Set u₁ = 0.\nCell (1, 1): u₁ + v₁ = 2 -> v₁ = 2.\nCell (2, 1): u₂ + v₁ = 3 -> u₂ + 2 = 3 -> u₂ = 1.\nCell (2, 2): u₂ + v₂ = 3 -> 1 + v₂ = 3 -> v₂ = 2.\nCell (3, 2): u₃ + v₂ = 4 -> u₃ + 2 = 4 -> u₃ = 2.\nCell (3, 3): u₃ + v₃ = 7 -> 2 + v₃ = 7 -> v₃ = 5.\nResults: u = [0, 1, 2], v = [2, 2, 5].' },
              { stepNumber: 2, title: 'Calculate Δ_ij for Empty Cells', description: 'Cell (1, 2): Δ₁₂ = c₁₂ - (u₁ + v₂) = 7 - (0 + 2) = +5.\nCell (1, 3): Δ₁₃ = c₁₃ - (u₁ + v₃) = 4 - (0 + 5) = -1.\nCell (2, 3): Δ₂₃ = c₂₃ - (u₂ + v₃) = 1 - (1 + 5) = 1 - 6 = -5.\nCell (3, 1): Δ₃₁ = c₃₁ - (u₃ + v₁) = 5 - (2 + 2) = +1.' },
              { stepNumber: 3, title: 'Interpret Results', description: 'Δ₂₃ is -5 (negative). Therefore, current solution is NOT optimal! Cell (2, 3) must enter the basis to reduce cost.' }
            ],
            finalAnswer: 'Solution is not optimal. Cell (2, 3) enters the basis with opportunity cost Δ₂₃ = -5.'
          }
        ],
        realLifeExamples: [
          { industry: 'Shipping & Maritime', caseTitle: 'Container Ship Route Balancing', description: 'Container shipping lines like Maersk apply MODI loops to reposition empty 40-foot shipping containers back from import-heavy to export-heavy ports.', benefit: 'Saved Maersk $200M+ in container demurrage and empty storage fees.' }
        ],
        examQuestions: [
          { question: 'Explain the MODI method step by step. How do you form a closed loop and compute theta?', marks: 10, hint: 'Detail m+n-1 condition, ui+vj=cij, opportunity cost formula, loop formation, theta shift.' }
        ],
        practiceQuestionIds: ['q-206', 'q-207', 'q-208']
      },
      {
        id: 't-2-4',
        moduleId: 'mod-2',
        moduleTitle: 'Transportation Problem',
        title: 'Degeneracy in Transportation Problems',
        slug: 'tp-degeneracy',
        subtitle: 'Identification, Resolution with Epsilon (ε), and Rim Conditions',
        readingTimeMinutes: 9,
        introduction: 'Degeneracy in a transportation problem occurs when the number of basic (allocated) cells is strictly less than m + n - 1. When degeneracy occurs, it is impossible to calculate all u_i and v_j values, blocking the application of the MODI method.',
        detailedExplanation: [
          'Causes of Degeneracy: Degeneracy arises during IBFS when a single allocation satisfies both a row\'s remaining supply and a column\'s remaining demand simultaneously. It can also occur during reallocation if a tie occurs for the minimum allocation θ at negative corners of a loop.',
          'Resolution of Degeneracy: Place an infinitesimally small positive allocation ε (epsilon) into an unallocated, independent cell.',
          'Selection Rules for ε Cell: (1) It must have the lowest possible cost among candidate empty cells. (2) It must not form a closed loop with existing allocated cells (maintains linear independence).',
          'Mathematical Behavior: In subsequent calculations, ε + a = a, a - ε = a, but ε > 0 for basis counting purposes. In the final schedule, ε is replaced with zero.'
        ],
        definitions: [
          { term: 'Degenerate Solution', definition: 'A transportation schedule where the count of positive allocations is strictly less than m + n - 1.' },
          { term: 'Epsilon (ε)', definition: 'An infinitesimal mathematical quantity placed in an unallocated cell to restore non-degeneracy without altering physical shipments.' }
        ],
        formulas: [
          { name: 'Non-Degeneracy Condition', latex: '\\text{Number of Basic Cells} = m + n - 1', explanation: 'Condition required for a unique set of multipliers u_i and v_j.' }
        ],
        numericalExamples: [
          {
            title: 'Handling Degeneracy with Epsilon Allocation',
            problemStatement: 'A 3x3 transportation problem has only 4 allocated cells: (1,1)=10, (2,2)=15, (2,3)=5, (3,3)=20. Costs: c₁₂=3, c₁₃=4, c₂₁=5, c₃₁=6, c₃₂=2. Total required basic cells is 3 + 3 - 1 = 5. Resolve degeneracy.',
            steps: [
              { stepNumber: 1, title: 'Check Degeneracy', description: 'Actual allocations = 4. Required = 3 + 3 - 1 = 5. Degeneracy detected (deficit = 1 cell).' },
              { stepNumber: 2, title: 'Evaluate Empty Cell Costs', description: 'Candidate empty cells: (1,2) cost 3, (1,3) cost 4, (2,1) cost 5, (3,1) cost 6, (3,2) cost 2. Lowest cost is cell (3, 2) with cost 2.' },
              { stepNumber: 3, title: 'Check Independence (No Loop)', description: 'Allocating ε to (3, 2): Check loop with (2,2), (2,3), (3,3). A closed loop would form between (3,2), (2,2), (2,3), (3,3). Thus (3,2) cannot be used!' },
              { stepNumber: 4, title: 'Select Next Lowest Cost Independent Cell', description: 'Next lowest cost is cell (1, 2) with cost 3. Cell (1, 2) does not form any loop with current basic cells. Allocate ε to cell (1, 2).' }
            ],
            finalAnswer: 'Degeneracy resolved by assigning infinitesimal quantity ε to cell (1, 2). Basic cells count is now 5 (m+n-1).'
          }
        ],
        realLifeExamples: [
          { industry: 'Postal Services', caseTitle: 'National Postal Sorting Hubs', description: 'Post offices route mail through regional sorting centers where regional tie-ins frequently create degenerate basic solutions, resolved in automated dispatch algorithms via epsilon tagging.', benefit: 'Guarantees algorithm convergence without runtime exception crashes.' }
        ],
        examQuestions: [
          { question: 'What is degeneracy in transportation problems? How does it arise during initial allocation, and how is it resolved?', marks: 6, hint: 'Discuss allocations < m+n-1, tie in rim requirements, and epsilon placement rules.' }
        ],
        practiceQuestionIds: ['q-209', 'q-210']
      }
    ]
  },
  {
    id: 'mod-3',
    code: 'MOD 03',
    title: 'Assignment Problem (AP)',
    shortTitle: 'Assignment',
    description: 'Bipartite one-to-one matching, assignment cost matrices, Hungarian method, line covering, and unbalanced/maximization models.',
    iconName: 'UserCheck',
    color: 'from-amber-600 to-orange-700',
    topics: [
      {
        id: 't-3-1',
        moduleId: 'mod-3',
        moduleTitle: 'Assignment Problem',
        title: 'Introduction & Hungarian Method',
        slug: 'hungarian-method',
        subtitle: 'One-to-One Matching, Row/Column Reduction, and Line Covering',
        readingTimeMinutes: 11,
        introduction: 'The Assignment Problem is a special case of the Transportation Problem where the number of sources equals the number of destinations (n × n matrix), and each source has a supply of exactly 1 unit and each destination has a demand of exactly 1 unit (one-to-one matching: one worker to one machine, one driver to one route).',
        detailedExplanation: [
          'Mathematical Formulation: Find binary decision variables x_ij ∈ {0, 1} to minimize total cost Z = Σ Σ c_ij x_ij subject to Σ_j x_ij = 1 (each worker gets one job) and Σ_i x_ij = 1 (each job is assigned to one worker).',
          'Hungarian Method (Kuhn-Munkres Algorithm): Developed by Harold Kuhn in 1955 based on earlier work by Hungarian mathematicians Dénes Kőnig and Jenő Egerváry.',
          'Step 1 (Row Reduction): Subtract the minimum element of each row from all elements in that row.',
          'Step 2 (Column Reduction): Subtract the minimum element of each column from all elements in that column. Now every row and column has at least one zero.',
          'Step 3 (Optimality Test via Line Covering): Draw the minimum number of horizontal and vertical lines required to cover all zeros in the matrix. If the minimum number of lines equals n, an optimal assignment exists!',
          'Step 4 (Matrix Revision): If lines < n, find the smallest uncovered element θ. Subtract θ from all uncovered elements, add θ to all elements at the intersection of two lines, and leave elements covered by one line unchanged. Return to Step 3.',
          'Step 5 (Making Assignments): Systematically assign zeros: find rows with only one zero, assign it, and cross out other zeros in that column; repeat for columns.'
        ],
        definitions: [
          { term: 'Assignment Problem', definition: 'A combinatorial optimization problem of assigning n facilities to n tasks on a strictly one-to-one basis at minimum total cost.' },
          { term: 'Hungarian Method', definition: 'An efficient O(n³) combinatorial algorithm for solving the assignment problem using reduced cost matrices.' },
          { term: 'Reduced Cost Matrix', definition: 'A matrix obtained after row and column reductions where adding or subtracting constants from rows/columns preserves the optimal assignment.' },
          { term: 'König\'s Theorem', definition: 'In any bipartite graph, the maximum size of a matching equals the minimum size of a vertex cover (minimum lines to cover all zeros).' }
        ],
        formulas: [
          { name: 'Binary Assignment Constraint', latex: '\\sum_{j=1}^{n} x_{ij} = 1 \\quad \\forall i, \\quad \\sum_{i=1}^{n} x_{ij} = 1 \\quad \\forall j, \\quad x_{ij} \\in \\{0, 1\\}', explanation: 'Strict one-to-one assignment conditions.' },
          { name: 'Matrix Adjustment Rule', latex: 'c\'_{ij} = \\begin{cases} c_{ij} - \\theta & \\text{if unshaded} \\\\ c_{ij} + \\theta & \\text{if intersection} \\\\ c_{ij} & \\text{if covered once} \\end{cases}', explanation: 'Formula for shifting elements when line count < n.' }
        ],
        numericalExamples: [
          {
            title: '4x4 Hungarian Assignment Step-by-Step',
            problemStatement: 'Assign 4 jobs (J1, J2, J3, J4) to 4 workers (W1, W2, W3, W4) with cost matrix:\nW1: [10, 12, 19, 11]\nW2: [5, 10, 7, 8]\nW3: [12, 14, 13, 11]\nW4: [8, 15, 11, 9]',
            steps: [
              { stepNumber: 1, title: 'Row Reduction', description: 'Row 1 min = 10 -> [0, 2, 9, 1]\nRow 2 min = 5 -> [0, 5, 2, 3]\nRow 3 min = 11 -> [1, 3, 2, 0]\nRow 4 min = 8 -> [0, 7, 3, 1]' },
              { stepNumber: 2, title: 'Column Reduction', description: 'Col 1 min=0 -> [0, 0, 1, 0]\nCol 2 min=2 -> [0, 3, 1, 5]\nCol 3 min=2 -> [7, 0, 0, 1]\nCol 4 min=0 -> [1, 3, 0, 1]' },
              { stepNumber: 3, title: 'Cover Zeros with Minimum Lines', description: 'Row 3 has zeros at (3,3) and (3,4). Col 1 has zeros at (1,1), (2,1), (4,1). Line 1: Col 1. Line 2: Row 1 (zero at 1,2). Line 3: Row 3. Total lines = 3 < 4 (order of matrix). Not optimal.' },
              { stepNumber: 4, title: 'Revise Matrix with θ', description: 'Uncovered cells: (2,2)=3, (2,3)=0? wait (2,3)=0 is covered by Col 3. Smallest uncovered element θ = 1.\nSubtract θ from uncovered, add to intersections.\nAfter revision, lines = 4 = n.' },
              { stepNumber: 5, title: 'Final Assignment', description: 'W1 -> J2 (Cost 12)\nW2 -> J3 (Cost 7)\nW3 -> J4 (Cost 11)\nW4 -> J1 (Cost 8)\nTotal Cost = 12 + 7 + 11 + 8 = 38.' }
            ],
            finalAnswer: 'Optimal Assignment: W1-J2, W2-J3, W3-J4, W4-J1. Minimum Total Cost = $38.'
          }
        ],
        realLifeExamples: [
          { industry: 'Ride Hailing', caseTitle: 'Uber Dispatch Pairing', description: 'Uber matches incoming ride requests to nearby active drivers every 3 seconds using real-time Hungarian bipartite matching to minimize estimated time of arrival (ETA).', benefit: 'Reduced passenger wait times by 14% across metropolitan cities.' }
        ],
        examQuestions: [
          { question: 'Describe the Hungarian Method for solving an Assignment Problem with a complete numerical example.', marks: 10, hint: 'Cover row reduction, column reduction, line covering, theta adjustment, and zero assignment.' }
        ],
        practiceQuestionIds: ['q-301', 'q-302', 'q-303']
      },
      {
        id: 't-3-2',
        moduleId: 'mod-3',
        moduleTitle: 'Assignment Problem',
        title: 'Unbalanced & Maximization Assignment Problems',
        slug: 'unbalanced-maximization-ap',
        subtitle: 'Dummy Rows/Columns, Relative Loss Conversion, and Prohibited Assignments',
        readingTimeMinutes: 10,
        introduction: 'In practice, assignment problems frequently have unequal numbers of workers and jobs (Unbalanced), or seek to maximize revenue/sales rather than minimize costs (Maximization), or have certain combinations that are impossible (Prohibited Assignments).',
        detailedExplanation: [
          'Unbalanced Assignment: If number of workers (m) ≠ number of jobs (n), the matrix is not square. Add dummy row(s) or column(s) with zero costs to make it square (max(m, n) × max(m, n)). A dummy assignment means that worker is idle or that job remains uncompleted.',
          'Maximization Assignment: If the objective is to maximize profit or efficiency, convert the problem into an opportunity loss minimization problem by subtracting every matrix element from the maximum element in the entire matrix. Then apply the standard Hungarian method.',
          'Prohibited (Restricted) Assignments: If worker i cannot be assigned to job j (due to lack of certification, safety, or physical restriction), assign a very high cost M (infinity) to cell (i, j). In the Hungarian method, this high cost guarantees x_ij will never be chosen.'
        ],
        definitions: [
          { term: 'Relative Opportunity Loss Matrix', definition: 'Matrix created by subtracting each profit entry from the overall maximum profit value to enable minimization.' },
          { term: 'Prohibited Assignment', definition: 'A combination forbidden by business rules, modeled with an infinite penalty cost M.' }
        ],
        formulas: [
          { name: 'Maximization Conversion', latex: 'c\'_{ij} = \\max_{k, l} (c_{kl}) - c_{ij}', explanation: 'Transforms profit maximization matrix into opportunity loss minimization matrix.' }
        ],
        numericalExamples: [
          {
            title: 'Maximization Assignment Problem Conversion',
            problemStatement: 'Assign 3 salespersons to 3 territories to maximize total sales (in $1000s):\nP1: [40, 42, 38]\nP2: [35, 45, 40]\nP3: [44, 48, 42]',
            steps: [
              { stepNumber: 1, title: 'Find Maximum Element', description: 'Highest sales value in the matrix is 48.' },
              { stepNumber: 2, title: 'Subtract Each Element from 48', description: 'Row 1: [48-40, 48-42, 48-38] = [8, 6, 10]\nRow 2: [48-35, 48-45, 48-40] = [13, 3, 8]\nRow 3: [48-44, 48-48, 48-42] = [4, 0, 6]' },
              { stepNumber: 3, title: 'Apply Standard Hungarian Reductions', description: 'Row reduction: R1 min=6 -> [2, 0, 4]; R2 min=3 -> [10, 0, 5]; R3 min=0 -> [4, 0, 6]. Column reduction on Col 1 (min 2) and Col 3 (min 4).' },
              { stepNumber: 4, title: 'Optimal Assignment', description: 'P1 -> Territory 1 (Sales 40)\nP2 -> Territory 3 (Sales 40)\nP3 -> Territory 2 (Sales 48)\nTotal Sales = 40 + 40 + 48 = 128 ($128,000).' }
            ],
            finalAnswer: 'Optimal Assignment: P1 to T1, P2 to T3, P3 to T2. Maximum Sales = $128,000.'
          }
        ],
        realLifeExamples: [
          { industry: 'Sports Analytics', caseTitle: 'Swimming Relay Team Lineup', description: 'Olympic swim coaches assign 4 swimmers to 4 stroke legs (Backstroke, Breaststroke, Butterfly, Freestyle) using Hungarian assignment to minimize aggregate team time.', benefit: 'Shaved 1.2 seconds off 4x100m medley relay Olympic record.' }
        ],
        examQuestions: [
          { question: 'How is a maximization assignment problem solved using the Hungarian method? Explain with a 3x3 matrix.', marks: 8, hint: 'Explain relative opportunity loss matrix and standard minimization workflow.' }
        ],
        practiceQuestionIds: ['q-304', 'q-305']
      }
    ]
  },
  {
    id: 'mod-4',
    code: 'MOD 04',
    title: 'Game Theory',
    shortTitle: 'Game Theory',
    description: 'Two-person zero-sum games, Maximin-Minimax principles, saddle points, mixed strategies, dominance, and graphical solutions.',
    iconName: 'Swords',
    color: 'from-purple-600 to-violet-800',
    topics: [
      {
        id: 't-4-1',
        moduleId: 'mod-4',
        moduleTitle: 'Game Theory',
        title: 'Two-Person Zero-Sum Games & Saddle Point',
        slug: 'zero-sum-saddle-point',
        subtitle: 'Payoff Matrices, Pure Strategies, Maximin and Minimax Principles',
        readingTimeMinutes: 10,
        introduction: 'Game Theory is the mathematical study of strategic decision-making where two or more rational opponents interact and the outcome for each depends on the choices of all players. In a Two-Person Zero-Sum Game, what one player gains, the other player loses exactly (Sum of payoffs = 0).',
        detailedExplanation: [
          'Payoff Matrix: A table listing the payoffs resulting from choices made by Player A (row player, maximizing player) and Player B (column player, minimizing player). Positive entries represent payments from B to A.',
          'Maximin Principle (Player A): Player A anticipates the worst possible outcome in each row (row minima) and selects the strategy that maximizes this minimum gain: Maximin = max_i (min_j a_ij).',
          'Minimax Principle (Player B): Player B anticipates Player A\'s maximum gain in each column (column maxima) and selects the strategy that minimizes this maximum loss: Minimax = min_j (max_i a_ij).',
          'Saddle Point Condition: If Maximin = Minimax, the game is said to have a Saddle Point (equilibrium point in pure strategies). The corresponding payoff is the Value of the Game (V). Neither player has an incentive to deviate unilaterally.',
          'Fair Game: A game is fair if the value of the game V = 0.'
        ],
        definitions: [
          { term: 'Two-Person Zero-Sum Game', definition: 'A competitive game involving two opponents where the gain of one player equals the exact loss of the other player.' },
          { term: 'Payoff Matrix', definition: 'A matrix representing the outcomes (rewards/penalties) for Player A resulting from combinations of player strategies.' },
          { term: 'Maximin', definition: 'The maximum of row minima, representing Player A\'s guaranteed minimum security level.' },
          { term: 'Minimax', definition: 'The minimum of column maxima, representing Player B\'s guaranteed maximum loss.' },
          { term: 'Saddle Point', definition: 'A position in the payoff matrix where an element is simultaneously the minimum in its row and the maximum in its column.' }
        ],
        formulas: [
          { name: 'Maximin Value', latex: '\\alpha = \\max_i \\left( \\min_j a_{ij} \\right)', explanation: 'Security level of Player A.' },
          { name: 'Minimax Value', latex: '\\beta = \\min_j \\left( \\max_i a_{ij} \\right)', explanation: 'Ceiling of loss for Player B.' },
          { name: 'Saddle Point Criterion', latex: '\\max_i (\\min_j a_{ij}) = \\min_j (\\max_i a_{ij}) = V', explanation: 'Condition for pure strategy equilibrium.' }
        ],
        numericalExamples: [
          {
            title: 'Determining Saddle Point and Game Value',
            problemStatement: 'Find the saddle point and value of the game for the payoff matrix:\nPlayer A \\ Player B:\nB1: [3, 2, 4, 0]\nB2: [3, 4, 2, 4]\nB3: [4, 2, 4, 0]\nB4: [0, 4, 0, 8]',
            steps: [
              { stepNumber: 1, title: 'Find Row Minima (Player A)', description: 'Row 1: min(3, 2, 4, 0) = 0\nRow 2: min(3, 4, 2, 4) = 2\nRow 3: min(4, 2, 4, 0) = 0\nRow 4: min(0, 4, 0, 8) = 0\nRow Minima = [0, 2, 0, 0]. Maximin = max(0, 2, 0, 0) = 2 (Row 2).' },
              { stepNumber: 2, title: 'Find Column Maxima (Player B)', description: 'Col 1: max(3, 3, 4, 0) = 4\nCol 2: max(2, 4, 2, 4) = 4\nCol 3: max(4, 2, 4, 0) = 4\nCol 4: max(0, 4, 0, 8) = 8\nColumn Maxima = [4, 4, 4, 8]. Minimax = min(4, 4, 4, 8) = 4.' },
              { stepNumber: 3, title: 'Compare Maximin and Minimax', description: 'Maximin (2) ≠ Minimax (4). No Saddle point exists in pure strategies.' }
            ],
            finalAnswer: 'Maximin = 2, Minimax = 4. Since Maximin ≠ Minimax, no saddle point exists. The game requires mixed strategies.'
          }
        ],
        realLifeExamples: [
          { industry: 'Cybersecurity', caseTitle: 'Hacker vs Firewall Intrusion Prevention', description: 'Network defense systems model cyberattack vectors and patch deployment as a zero-sum game to select robust defense policies against unknown exploits.', benefit: 'Guarantees minimum loss under worst-case zero-day threats.' }
        ],
        examQuestions: [
          { question: 'Define saddle point in game theory. Explain the Maximin and Minimax principles with a neat payoff table.', marks: 6, hint: 'Discuss player roles, security levels, and Maximin=Minimax condition.' }
        ],
        practiceQuestionIds: ['q-401', 'q-402', 'q-403']
      },
      {
        id: 't-4-2',
        moduleId: 'mod-4',
        moduleTitle: 'Game Theory',
        title: 'Mixed Strategies & Dominance Principle',
        slug: 'mixed-strategies-dominance',
        subtitle: '2x2 Analytical Formulas, Iterative Elimination of Dominated Strategies',
        readingTimeMinutes: 13,
        introduction: 'When a game lacks a saddle point, players cannot rely on a single deterministic pure strategy because their opponent would predict and exploit it. Instead, players choose probability distributions over their strategies (Mixed Strategies). The Dominance Principle simplifies large games by removing strictly inferior rows and columns.',
        detailedExplanation: [
          'Mixed Strategy Definition: Player A plays strategy A_i with probability p_i (Σ p_i = 1), and Player B plays strategy B_j with probability q_j (Σ q_j = 1).',
          'Dominance Rules for Rows (Player A): If every payoff in Row r is less than or equal to the corresponding payoff in Row k, Row r is dominated and can be deleted (Player A will never choose an inferior row).',
          'Dominance Rules for Columns (Player B): If every payoff in Column c is greater than or equal to the corresponding payoff in Column m, Column c is dominated and can be deleted (Player B minimizes losses and avoids paying higher amounts).',
          'Analytical Solution for 2×2 Matrix without Saddle Point: Given matrix [[a11, a12], [a21, a22]], the optimal probabilities and game value are derived from the denominator D = (a11 + a22) - (a12 + a21).'
        ],
        definitions: [
          { term: 'Mixed Strategy', definition: 'A strategy where a player assigns probability weights to two or more available courses of action.' },
          { term: 'Dominance Principle', definition: 'The rule that a strategy can be eliminated if there exists another strategy that always yields an equal or better payoff under all conditions.' },
          { term: 'Expected Payoff', definition: 'The probability-weighted average outcome of the game: E(p, q) = pᵀ · A · q.' }
        ],
        formulas: [
          { name: 'Player A Probability p1', latex: 'p_1 = \\frac{a_{22} - a_{21}}{(a_{11} + a_{22}) - (a_{12} + a_{21})}, \\quad p_2 = 1 - p_1', explanation: 'Optimal probability for Player A\'s first strategy.' },
          { name: 'Player B Probability q1', latex: 'q_1 = \\frac{a_{22} - a_{12}}{(a_{11} + a_{22}) - (a_{12} + a_{21})}, \\quad q_2 = 1 - q_1', explanation: 'Optimal probability for Player B\'s first strategy.' },
          { name: 'Value of 2x2 Game', latex: 'V = \\frac{a_{11} a_{22} - a_{12} a_{21}}{(a_{11} + a_{22}) - (a_{12} + a_{21})}', explanation: 'Exact analytical value of 2x2 zero-sum game.' }
        ],
        numericalExamples: [
          {
            title: '2x2 Mixed Strategy Algebraic Calculation',
            problemStatement: 'Solve the 2x2 zero-sum game with payoff matrix:\nA1: [5, 1]\nA2: [3, 4]',
            steps: [
              { stepNumber: 1, title: 'Check Saddle Point', description: 'Row minima: [1, 3] -> Maximin = 3. Col maxima: [5, 4] -> Minimax = 4. No saddle point.' },
              { stepNumber: 2, title: 'Calculate Denominator D', description: 'D = (a₁₁ + a₂₂) - (a₁₂ + a₂₁) = (5 + 4) - (1 + 3) = 9 - 4 = 5.' },
              { stepNumber: 3, title: 'Calculate Player A Probabilities', description: 'p₁ = (a₂₂ - a₂₁) / D = (4 - 3) / 5 = 1/5 = 0.20.\np₂ = 1 - 0.20 = 0.80.' },
              { stepNumber: 4, title: 'Calculate Player B Probabilities', description: 'q₁ = (a₂₂ - a₁₂) / D = (4 - 1) / 5 = 3/5 = 0.60.\nq₂ = 1 - 0.60 = 0.40.' },
              { stepNumber: 5, title: 'Calculate Value of Game', description: 'V = (a₁₁a₂₂ - a₁₂a₂₁) / D = (5*4 - 1*3) / 5 = (20 - 3) / 5 = 17/5 = 3.4.' }
            ],
            finalAnswer: 'Player A: (p₁ = 0.2, p₂ = 0.8). Player B: (q₁ = 0.6, q₂ = 0.4). Value of Game V = 3.4.'
          }
        ],
        realLifeExamples: [
          { industry: 'Sports Strategy', caseTitle: 'Penalty Kick Shootout (Soccer)', description: 'Goalkeeper vs kicker decisions (dive left vs kick left) follow mixed strategy Nash equilibria: kickers randomize shot direction to keep the goalkeeper indifferent.', benefit: 'Empirically tested by Nobel Laureate economists on Premier League data.' }
        ],
        examQuestions: [
          { question: 'State the Dominance Principle and explain how it simplifies a game matrix. Solve a 3x3 game using dominance.', marks: 10, hint: 'Define row and col dominance rules, eliminate dominated lines step-by-step to 2x2.' }
        ],
        practiceQuestionIds: ['q-404', 'q-405', 'q-406']
      },
      {
        id: 't-4-3',
        moduleId: 'mod-4',
        moduleTitle: 'Game Theory',
        title: 'Graphical Method for 2xN and Mx2 Games',
        slug: 'graphical-game-theory',
        subtitle: 'Expected Payoff Lines, Lower and Upper Envelopes, and Dimensional Reduction',
        readingTimeMinutes: 11,
        introduction: 'When a game matrix has size 2 × n (Player A has 2 strategies) or m × 2 (Player B has 2 strategies) and cannot be further reduced by dominance, the Graphical Method provides an elegant visual technique to identify the critical two strategies and reduce the game to a solvable 2 × 2 matrix.',
        detailedExplanation: [
          '2 × n Games (Player A has 2 strategies, Player B has n):',
          'Let p₁ be the probability Player A plays A₁, and (1 - p₁) be the probability Player A plays A₂ (where 0 ≤ p₁ ≤ 1).',
          'For each strategy B_j of Player B, the expected payoff is a straight line: E_j(p₁) = (a₁ⱼ - a₂ⱼ)p₁ + a₂ⱼ.',
          'Lower Envelope: For any chosen p₁, Player B will choose a strategy that minimizes Player A\'s payoff. The boundary of minimum expected payoffs across all lines is the Lower Envelope.',
          'Maximin Point: Player A wants to maximize this minimum payoff. The highest point on the Lower Envelope gives the optimal probability p₁* and the value of the game.',
          'The two lines that intersect at this highest peak identify Player B\'s two optimal active strategies, reducing the 2 × n game to an exact 2 × 2 game!',
          'm × 2 Games (Player B has 2 strategies): Symmetric procedure plotting q₁ on the horizontal axis. Player A maximizes, so we construct the Upper Envelope and find the lowest point (Minimax point).'
        ],
        definitions: [
          { term: 'Lower Envelope', definition: 'The piecewise linear lower boundary representing the minimum expected payoff to Player A across all opponent counter-strategies.' },
          { term: 'Upper Envelope', definition: 'The piecewise linear upper boundary representing the maximum expected loss to Player B across all opponent counter-strategies.' },
          { term: 'Peak Intersection Point', definition: 'The highest point on the lower envelope (or lowest on upper envelope) that identifies the minimax equilibrium.' }
        ],
        formulas: [
          { name: 'Expected Payoff Line (2xN)', latex: 'E_j(p_1) = (a_{1j} - a_{2j}) p_1 + a_{2j}, \\quad p_1 \\in [0, 1]', explanation: 'Straight line plotting expected return as p1 varies from 0 to 1.' }
        ],
        numericalExamples: [
          {
            title: 'Solving 2x3 Game Graphically',
            problemStatement: 'Solve the 2x3 game graphically:\nA1: [1, 3, 11]\nA2: [8, 5, 2]',
            steps: [
              { stepNumber: 1, title: 'Write Line Equations for Player B Strategies', description: 'Strategy B1: At p₁=0, payoff=8; at p₁=1, payoff=1. Line: E₁ = (1 - 8)p₁ + 8 = -7p₁ + 8.\nStrategy B2: At p₁=0, payoff=5; at p₁=1, payoff=3. Line: E₂ = (3 - 5)p₁ + 5 = -2p₁ + 5.\nStrategy B3: At p₁=0, payoff=2; at p₁=1, payoff=11. Line: E₃ = (11 - 2)p₁ + 2 = 9p₁ + 2.' },
              { stepNumber: 2, title: 'Find Intersections on Lower Envelope', description: 'Intersect B1 and B3: -7p₁ + 8 = 9p₁ + 2 -> 16p₁ = 6 -> p₁ = 6/16 = 3/8 = 0.375. Value = 9(0.375) + 2 = 5.375.\nIntersect B2 and B3: -2p₁ + 5 = 9p₁ + 2 -> 11p₁ = 3 -> p₁ = 3/11 = 0.272. Value = 9(0.272) + 2 = 4.45.' },
              { stepNumber: 3, title: 'Locate Highest Peak on Lower Envelope', description: 'The highest point on the lower envelope is at the intersection of B2 and B3: p₁ = 3/11 ≈ 0.272, with Game Value V = 4.45.' }
            ],
            finalAnswer: 'Player A: p₁ = 3/11, p₂ = 8/11. Player B plays B2 and B3 with mixed strategies. Value of Game V = 49/11 ≈ 4.45.'
          }
        ],
        realLifeExamples: [
          { industry: 'Commercial Airline Pricing', caseTitle: 'Fare Class Bidding', description: 'Low-cost carriers use 2xN game graphical models when competing against legacy carriers on dual departure slots to set non-cooperative discount fares.', benefit: 'Maintains 88%+ passenger load factors under predatory pricing.' }
        ],
        examQuestions: [
          { question: 'Solve a 2x4 zero-sum game using the Graphical Method and explain how the lower envelope is constructed.', marks: 10, hint: 'Draw lines between p1=0 and p1=1, shade lower envelope, find apex vertex.' }
        ],
        practiceQuestionIds: ['q-407', 'q-408']
      }
    ]
  },
  {
    id: 'mod-5',
    code: 'MOD 05',
    title: 'Real-Life Applications of OR',
    shortTitle: 'OR Applications',
    description: 'Comprehensive industrial case studies, logistics, finance, production planning, hospital operations, and corporate strategy.',
    iconName: 'Building2',
    color: 'from-amber-600 to-rose-700',
    topics: [
      {
        id: 't-5-1',
        moduleId: 'mod-5',
        moduleTitle: 'Real-Life Applications of OR',
        title: 'Industrial & Supply Chain Case Studies',
        slug: 'industrial-case-studies',
        subtitle: 'Logistics, Production Planning, Finance, and Workforce Scheduling',
        readingTimeMinutes: 10,
        introduction: 'Operations Research is the mathematical backbone of modern global industry. This module synthesizes how Linear Programming, Transportation Modeling, Hungarian Matching, and Game Theory are deployed at enterprise scale by Fortune 500 corporations and public sector organizations.',
        detailedExplanation: [
          'Supply Chain & Fleet Routing: Major shipping lines and retail giants like Walmart apply large-scale mixed-integer programming (MIP) models with thousands of binary routing decisions to coordinate global container shipping and cross-docking warehouses.',
          'Production Planning & Bottleneck Management: Semiconductor fabs and automotive assembly lines balance multi-stage machine capacities, lot sizing, and raw material reorder points to maximize throughput while minimizing work-in-progress (WIP) holding costs.',
          'Financial Portfolio Optimization: Markowitz mean-variance portfolio theory is a quadratic programming problem directly derived from OR principles: minimize portfolio variance subject to achieving a target expected return.',
          'Workforce & Nurse Scheduling: Hospitals formulate shift scheduling as zero-one integer programs satisfying regulatory constraints (maximum consecutive shifts, minimum rest hours, specialty certification coverage) while minimizing overtime wage expenditure.',
          'Competitive Pricing Strategies: Duopolistic telecommunications providers and airline revenue management systems deploy dynamic game theory algorithms to price tickets and data bundles in reaction to rival price changes.'
        ],
        definitions: [
          { term: 'Mixed-Integer Programming (MIP)', definition: 'An optimization model where some or all decision variables are constrained to take integer or binary values.' },
          { term: 'Revenue Management', definition: 'The application of disciplined analytics that predict consumer behavior at the micro-market levels to optimize product availability and price.' },
          { term: 'Cross-Docking', definition: 'A logistics practice where products from a supplier are distributed directly to a customer or retail chain with minimal or no storage in between.' }
        ],
        formulas: [
          { name: 'Portfolio Variance Minimization', latex: '\\min \\sigma_p^2 = \\sum_{i=1}^n \\sum_{j=1}^n w_i w_j \\sigma_{ij} \\quad \\text{s.t. } \\sum w_i r_i \\ge R_{\\text{target}}, \\quad \\sum w_i = 1', explanation: 'Quadratic programming formulation for Markowitz investment optimization.' }
        ],
        numericalExamples: [
          {
            title: 'Factory Lot Sizing & Worker Scheduling',
            problemStatement: 'A hospital ICU requires a minimum of 8 nurses for Shift 1 (Morning), 6 nurses for Shift 2 (Evening), and 4 nurses for Shift 3 (Night). Each nurse works two consecutive shifts. Formulate the integer LPP to minimize total nurses hired.',
            formulation: 'Let x₁ = nurses starting in Shift 1 (working Shift 1 and 2)\nx₂ = nurses starting in Shift 2 (working Shift 2 and 3)\nx₃ = nurses starting in Shift 3 (working Shift 3 and 1)\nMinimize Z = x₁ + x₂ + x₃\nSubject to:\nx₁ + x₃ ≥ 8 (Shift 1 requirement)\nx₁ + x₂ ≥ 6 (Shift 2 requirement)\nx₂ + x₃ ≥ 4 (Shift 3 requirement)\nx₁, x₂, x₃ ≥ 0, integer',
            steps: [
              { stepNumber: 1, title: 'Formulate Shift Balance', description: 'Shift 1: x₁ + x₃ ≥ 8. Shift 2: x₁ + x₂ ≥ 6. Shift 3: x₂ + x₃ ≥ 4.' },
              { stepNumber: 2, title: 'Sum Constraints', description: 'Adding all 3 constraints: 2(x₁ + x₂ + x₃) ≥ 18 -> x₁ + x₂ + x₃ ≥ 9.' },
              { stepNumber: 3, title: 'Find Integer Solution', description: 'Setting x₁ = 5, x₂ = 1, x₃ = 3 satisfies: 5 + 3 = 8 ≥ 8; 5 + 1 = 6 ≥ 6; 1 + 3 = 4 ≥ 4. Total = 9 nurses.' }
            ],
            finalAnswer: 'Minimum 9 nurses required (x₁ = 5, x₂ = 1, x₃ = 3).'
          }
        ],
        realLifeExamples: [
          { industry: 'Semiconductor Manufacturing', caseTitle: 'TSMC Cleanroom Wafer Dispatch', description: 'TSMC optimizes over 1,000 distinct lithography, etching, and chemical-mechanical planarization tools using integer linear programming.', benefit: 'Maintains 95%+ fab utilization on multi-billion dollar tool clusters.' }
        ],
        examQuestions: [
          { question: 'Describe four major real-life applications of Operations Research in manufacturing, logistics, healthcare, and finance.', marks: 10, hint: 'Discuss routing, production scheduling, portfolio optimization, and nurse shift planning.' }
        ],
        practiceQuestionIds: ['q-501', 'q-502']
      }
    ]
  }
];
