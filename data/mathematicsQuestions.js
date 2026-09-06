const mathematicsQuestions = [
  {
    text: "What is the value of 7 x 8?",
    difficulty: "easy",
    options: [
      { text: "56", isCorrect: true },
      { text: "54", isCorrect: false },
      { text: "64", isCorrect: false },
      { text: "48", isCorrect: false },
    ],
  },
  {
    text: "What is the square root of 144?",
    difficulty: "easy",
    options: [
      { text: "12", isCorrect: true },
      { text: "14", isCorrect: false },
      { text: "11", isCorrect: false },
      { text: "16", isCorrect: false },
    ],
  },
  {
    text: "What is the value of pi (π), rounded to two decimal places?",
    difficulty: "easy",
    options: [
      { text: "3.14", isCorrect: true },
      { text: "3.41", isCorrect: false },
      { text: "3.12", isCorrect: false },
      { text: "2.14", isCorrect: false },
    ],
  },
  {
    text: "What do you call a triangle with all three sides of equal length?",
    difficulty: "easy",
    options: [
      { text: "Equilateral triangle", isCorrect: true },
      { text: "Scalene triangle", isCorrect: false },
      { text: "Isosceles triangle", isCorrect: false },
      { text: "Right triangle", isCorrect: false },
    ],
  },
  {
    text: "What is the derivative of x^2 with respect to x?",
    difficulty: "medium",
    options: [
      { text: "2x", isCorrect: true },
      { text: "x", isCorrect: false },
      { text: "x^2", isCorrect: false },
      { text: "2", isCorrect: false },
    ],
  },
  {
    text: "In a right triangle, which theorem relates the lengths of the sides?",
    difficulty: "medium",
    options: [
      { text: "Pythagorean theorem", isCorrect: true },
      { text: "Fermat's Last Theorem", isCorrect: false },
      { text: "Binomial theorem", isCorrect: false },
      { text: "Euler's theorem", isCorrect: false },
    ],
  },
  {
    text: "What is the sum of the interior angles of a triangle?",
    difficulty: "medium",
    options: [
      { text: "180 degrees", isCorrect: true },
      { text: "90 degrees", isCorrect: false },
      { text: "270 degrees", isCorrect: false },
      { text: "360 degrees", isCorrect: false },
    ],
  },
  {
    text: "What is the result of solving for x in the equation 2x + 5 = 15?",
    difficulty: "medium",
    options: [
      { text: "5", isCorrect: true },
      { text: "10", isCorrect: false },
      { text: "7.5", isCorrect: false },
      { text: "20", isCorrect: false },
    ],
  },
  {
    text: "What is a prime number?",
    difficulty: "medium",
    options: [
      { text: "A number greater than 1 with no divisors other than 1 and itself", isCorrect: true },
      { text: "A number divisible by 2", isCorrect: false },
      { text: "Any odd number", isCorrect: false },
      { text: "A number with exactly three factors", isCorrect: false },
    ],
  },
  {
    text: "What is the integral of 1/x with respect to x?",
    difficulty: "hard",
    options: [
      { text: "ln|x| + C", isCorrect: true },
      { text: "x^2/2 + C", isCorrect: false },
      { text: "1/x^2 + C", isCorrect: false },
      { text: "e^x + C", isCorrect: false },
    ],
  },
];

export default mathematicsQuestions;
