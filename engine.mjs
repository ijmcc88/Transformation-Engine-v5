export const VERSION = '3.1.0';

export const MEAL_KEYS = ['breakfast', 'lunch', 'snack', 'dinner'];
export const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' };
export const SHIFTS = ['', 'Day', 'Mid', 'Paeds Mid', 'Late', 'On-call', 'SPA', 'CADRE', 'AL', 'Off'];
export const EQUIPMENT = ['', 'Full gym', 'Home dumbbells + bench', 'Hotel gym', 'Cardio/swim only', 'No gym'];
export const CONSTRAINTS = ['', 'Must train early', 'No training', 'Cardio/swim only', 'Travel/social', 'Home/hotel only'];
export const IMPACTS = ['Helpful', 'Neutral', 'Minor issue', 'Moderate issue', 'Major issue'];
export const WORKOUT_STATUSES = ['unconfirmed', 'completed', 'missed', 'moved'];
export const MEAL_STATUSES = ['unconfirmed', 'done_on_plan', 'off_plan', 'skipped'];
export const ALCOHOL_STATUSES = ['', 'None', 'Within plan', 'Above plan', 'Significantly above plan'];
export const LIFTS = ['Upper Push', 'Lower + Core', 'Upper Pull', 'Super Arms'];
const ARM_HEAVY = new Set(['Upper Push', 'Upper Pull', 'Super Arms']);

function pad2(n) { return String(n).padStart(2, '0'); }
function toIsoDate(date) { return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`; }
function addDays(date, days) { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy; }

export const PROGRAMME_MODES = {
  standard: { label: 'Standard Physique + Fitness', workoutTemplate: 'standardAestheticCut', dietTemplate: 'strictLidlCut' },
  recovery: { label: 'Recovery / Low Energy', workoutTemplate: 'recoveryBaseline', dietTemplate: 'recoveryCut' },
  beast: { label: 'Beast Mode / Progression', workoutTemplate: 'beastProgression', dietTemplate: 'performanceCut' },
  hardShred: { label: 'Hard Shred', workoutTemplate: 'standardAestheticCut', dietTemplate: 'hardShred' },
  flexible: { label: 'Annual Leave / Social Week', workoutTemplate: 'flexibleTravel', dietTemplate: 'flexibleProteinProtection' },
};
export const WORKOUT_TEMPLATES = {
  standardAestheticCut: 'Standard Aesthetic Cut',
  recoveryBaseline: 'Recovery Baseline',
  beastProgression: 'Beast Mode Progression',
  flexibleTravel: 'Flexible Travel / Social',
};
export const DIET_TEMPLATES = {
  strictLidlCut: 'Standard Physique + Fitness Diet',
  recoveryCut: 'Recovery / Low Energy Diet',
  performanceCut: 'Beast Mode / Progression Diet',
  hardShred: 'Hard Shred Diet',
  flexibleProteinProtection: 'Annual Leave / Social Week Diet',
};

const ingredientDb = {
  yoghurt: { label: 'Milbona High Protein Greek Style Yoghurt', kcalPer: 0.65, proteinPer: 0.11, unit: 'g', packSize: 450, guidance: 'Default 65 kcal / 11g protein per 100g. Use natural/high-protein pot; label overrides app values.' },
  whey: { label: 'Standard unflavoured whey protein isolate', kcalEach: 110, proteinEach: 25, unit: '30g scoop', guidance: 'Assumes 30g scoop = 110 kcal / 25g protein. Label-check your actual isolate.' },
  chicken: { label: 'Birchwood chicken breast', kcalPer: 1.06, proteinPer: 0.24, unit: 'g raw', packRound: 100, guidance: 'Raw weight. Buy plain breast/minifillets, not breaded or marinated.' },
  turkey: { label: 'Lean turkey mince 7%', kcalPer: 1.20, proteinPer: 0.206, unit: 'g raw', packRound: 500, guidance: 'Raw weight. Use 7% turkey mince or update label values.' },
  beef5: { label: 'Lean beef mince 5%', kcalPer: 1.24, proteinPer: 0.21, unit: 'g raw', packRound: 500, guidance: 'Raw weight. Use 5% lean beef mince; adjust if using higher-fat mince.' },
  salmon: { label: 'Salmon fillet', kcalPer: 2.06, proteinPer: 0.20, unit: 'g raw', packRound: 120, guidance: 'Raw weight. Plain fillet; avoid marinades unless counted.' },
  codPack: { label: 'Lighthouse Bay cod fillets', kcalEach: 210, proteinEach: 48, unit: '250g pack', guidance: 'One 250g / 2 fillet pack assumption. Label overrides.' },
  riceCooked: { label: 'Cooked basmati rice', kcalPer: 1.30, proteinPer: 0.027, unit: 'g cooked', guidance: 'Plan quantity is cooked weight. Shopping estimate uses 100g dry rice ≈ 260-300g cooked.' },
  potatoes: { label: 'Potatoes', kcalPer: 0.77, proteinPer: 0.02, unit: 'g raw', packRound: 500, guidance: 'Raw weight before cooking.' },
  oats: { label: 'Crownfield porridge oats', kcalPer: 3.70, proteinPer: 0.13, unit: 'g dry', packRound: 500, guidance: 'Dry weight; measure portions.' },
  flaxseed: { label: 'Alesto milled flaxseed', kcalPer: 5.30, proteinPer: 0.18, unit: 'g', packRound: 200, guidance: 'Small measured portions only; calorie dense.' },
  oliveOil: { label: 'Olive oil', kcalPer: 9.0, proteinPer: 0, unit: 'g', guidance: 'Weighed in grams or measured in ml. No free-pouring.' },
  proteinBar: { label: 'Lidl High Protein Bar', kcalEach: 188, proteinEach: 22.5, unit: 'bar', guidance: 'Protein bar assumption 188 kcal / 22.5g protein. Flavours vary; label-check.' },
  pudding: { label: 'Milbona High Protein Pudding', kcalEach: 150, proteinEach: 20, unit: 'pot', guidance: 'Assumes 1 pot = 150 kcal / 20g protein. Flavours/products vary; label-check.' },
  proteinDrink: { label: 'Milbona High Protein Drink', kcalEach: 200, proteinEach: 35, unit: 'drink', guidance: 'Assumes 1 drink = 200 kcal / 35g protein. Useful contingency option.' },
  feta: { label: 'Feta', kcalPer: 2.65, proteinPer: 0.14, unit: 'g', guidance: 'Measure portions; calorie dense.' },
  berries: { label: 'Berries / blueberries', kcalPer: 0.52, proteinPer: 0.01, unit: 'g', packRound: 300, guidance: 'Frozen berries/blueberries; avoid sweetened mixes.' },
  banana: { label: 'Bananas', kcalEach: 105, proteinEach: 1.3, unit: 'banana', guidance: 'Medium banana assumption.' },
  apple: { label: 'Apples', kcalEach: 80, proteinEach: 0.5, unit: 'apple', guidance: 'Medium apple assumption.' },
  greenVeg: { label: 'Low-carb green veg', kcalPer: 0.33, proteinPer: 0.025, unit: 'g', packRound: 500, guidance: 'Use broccoli, green beans, spinach, courgette, mushrooms, cabbage or cauliflower. Avoid pea/sweetcorn-heavy mixes unless counted.' },
  salad: { label: 'Salad vegetables', kcalPer: 0.20, proteinPer: 0.01, unit: 'g', packRound: 300, guidance: 'Lettuce/cucumber/tomato/pepper style salad. Avoid oily dressed pots.' },
  passata: { label: 'Passata', kcalPer: 0.32, proteinPer: 0.014, unit: 'g', packRound: 500, guidance: 'Plain passata; check added sugar/oil.' },
  wrap: { label: 'Tortilla wrap', kcalEach: 190, proteinEach: 5, unit: 'wrap', guidance: 'Standard medium wrap assumption; label-check pack.' },
  eggs: { label: 'Eggs', kcalEach: 72, proteinEach: 6.3, unit: 'egg', guidance: 'Medium/large egg assumption.' },
  eggWhites: { label: 'Egg whites', kcalEach: 17, proteinEach: 3.6, unit: 'egg white', guidance: 'Use carton or separated whites.' },
  spinachMushrooms: { label: 'Spinach and mushrooms', kcalPer: 0.25, proteinPer: 0.025, unit: 'g', packRound: 300, guidance: 'Low-cal veg base for eggs/post-call meals.' },
  readyMeal: { label: 'Lidl high-protein chicken-based ready meal', kcalEach: 500, proteinEach: 40, unit: 'meal', guidance: 'Contingency item. Choose chicken/protein-led option; label overrides.' },
  readyChicken: { label: 'Ready cooked chicken pack', kcalPer: 1.25, proteinPer: 0.25, unit: 'g pack weight', packRound: 240, guidance: 'Plain ready-cooked chicken. Avoid breaded/sauced options unless counted.' },
  fruit: { label: 'Fruit', kcalEach: 90, proteinEach: 0.5, unit: 'piece', guidance: 'Apple/banana style fruit. Count if choosing larger fruit.' },
  beans: { label: 'Kidney/black beans', kcalPer: 1.05, proteinPer: 0.07, unit: 'g drained', packRound: 240, guidance: 'Drained weight. Use kidney/black beans; rinse and count if using larger portions.' },
  peppersOnion: { label: 'Peppers/onion/courgette/tomato veg mix', kcalPer: 0.32, proteinPer: 0.012, unit: 'g raw', packRound: 500, guidance: 'Batchable traybake/chilli veg. Use fresh/frozen plain veg, not oily prepared mixes.' },
  mangoChutney: { label: 'Mango chutney', kcalPer: 2.50, proteinPer: 0, unit: 'g', guidance: 'Optional flavour extra; keep to 10-15g and count it.' },
  tortilla: { label: 'Spanish tortilla', kcalPer: 1.6, proteinPer: 0.07, unit: 'g', guidance: 'Contingency only; do not stack with nuts/chocolate on same day.' },
};

export const MEALS = {
  // Hard Shred / uploaded strict weekday structure
  hsMonBreakfast: { name: 'Hard Shred breakfast: yoghurt, berries, oats, flaxseed', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'berries', qty: 100 }, { id: 'oats', qty: 25 }, { id: 'flaxseed', qty: 10 }] },
  hsTueBreakfast: { name: 'Hard Shred breakfast: yoghurt, berries, oats, flaxseed', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'berries', qty: 100 }, { id: 'oats', qty: 25 }, { id: 'flaxseed', qty: 10 }] },
  hsWedBreakfast: { name: 'Hard Shred higher-carb yoghurt bowl', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'berries', qty: 100 }, { id: 'oats', qty: 35 }, { id: 'flaxseed', qty: 10 }] },
  hsThuBreakfast: { name: 'Hard Shred on-call breakfast', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'berries', qty: 100 }, { id: 'oats', qty: 20 }, { id: 'flaxseed', qty: 10 }] },
  hsFriBreakfast: { name: 'Hard Shred light yoghurt + banana', ingredients: [{ id: 'yoghurt', qty: 300 }, { id: 'banana', qty: 1 }] },
  hsChickenRice100: { name: 'Chicken breast, cooked rice and green veg', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 100 }, { id: 'greenVeg', qty: 300 }] },
  hsChickenRice125Salad: { name: 'Chicken breast, cooked rice and salad', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 125 }, { id: 'salad', qty: 300 }] },
  hsChickenRice240: { name: 'Higher-protein chicken, cooked rice and green veg', ingredients: [{ id: 'chicken', qty: 240 }, { id: 'riceCooked', qty: 100 }, { id: 'greenVeg', qty: 300 }] },
  hsEggChickenPotato: { name: 'Egg, chicken, potato and green veg plate', ingredients: [{ id: 'eggs', qty: 2 }, { id: 'chicken', qty: 150 }, { id: 'potatoes', qty: 150 }, { id: 'greenVeg', qty: 200 }] },
  hsBarApple: { name: 'Lidl protein bar + apple', ingredients: [{ id: 'proteinBar', qty: 1 }, { id: 'apple', qty: 1 }] },
  hsPuddingApple: { name: 'High-protein pudding + apple', ingredients: [{ id: 'pudding', qty: 1 }, { id: 'apple', qty: 1 }] },
  hsThuSnack: { name: 'High-protein pudding + apple (emergency bar rule: swap to protein bar if delayed/on-call)', ingredients: [{ id: 'pudding', qty: 1 }, { id: 'apple', qty: 1 }] },
  hsWheyApple: { name: 'Whey isolate + apple', ingredients: [{ id: 'whey', qty: 1 }, { id: 'apple', qty: 1 }] },
  hsTurkeyDinner: { name: 'Turkey mince, passata, green veg and measured oil', ingredients: [{ id: 'turkey', qty: 250 }, { id: 'passata', qty: 200 }, { id: 'greenVeg', qty: 300 }, { id: 'oliveOil', qty: 10 }] },
  hsTurkeyPotatoDinner: { name: 'Turkey mince, potato, passata, green veg and measured oil', ingredients: [{ id: 'turkey', qty: 250 }, { id: 'passata', qty: 200 }, { id: 'potatoes', qty: 150 }, { id: 'greenVeg', qty: 300 }, { id: 'oliveOil', qty: 10 }] },
  hsSalmonDinner: { name: 'Salmon, potatoes, green veg and measured oil', ingredients: [{ id: 'salmon', qty: 120 }, { id: 'potatoes', qty: 300 }, { id: 'greenVeg', qty: 400 }, { id: 'oliveOil', qty: 5 }] },
  hsCodPotato100: { name: 'Cod pack, potatoes, green veg and measured oil', ingredients: [{ id: 'codPack', qty: 1 }, { id: 'potatoes', qty: 100 }, { id: 'greenVeg', qty: 400 }, { id: 'oliveOil', qty: 20 }] },
  hsCodPotato150: { name: 'Cod pack, higher potato, green veg and measured oil', ingredients: [{ id: 'codPack', qty: 1 }, { id: 'potatoes', qty: 150 }, { id: 'greenVeg', qty: 400 }, { id: 'oliveOil', qty: 20 }] },

  standardUpperBreakfast: { name: 'Standard upper: yoghurt, whey, berries, oats, flaxseed', ingredients: [{ id: 'yoghurt', qty: 300 }, { id: 'whey', qty: 1 }, { id: 'berries', qty: 100 }, { id: 'oats', qty: 30 }, { id: 'flaxseed', qty: 10 }] },
  standardUpperLunch: { name: 'Standard upper: chicken, higher rice and green veg', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 300 }, { id: 'greenVeg', qty: 200 }, { id: 'oliveOil', qty: 10 }] },
  standardUpperSnack: { name: 'Standard upper: protein bar + banana', ingredients: [{ id: 'proteinBar', qty: 1 }, { id: 'banana', qty: 1 }] },
  standardUpperDinner: { name: 'Standard upper: salmon, potato, green veg, feta and oil', ingredients: [{ id: 'salmon', qty: 180 }, { id: 'potatoes', qty: 300 }, { id: 'greenVeg', qty: 200 }, { id: 'feta', qty: 30 }, { id: 'oliveOil', qty: 5 }] },
  standardLowerBreakfast: { name: 'Standard lower: oats, whey, banana and berries', ingredients: [{ id: 'oats', qty: 60 }, { id: 'whey', qty: 1 }, { id: 'banana', qty: 1 }, { id: 'berries', qty: 100 }] },
  standardLowerLunch: { name: 'Standard lower: chicken, high rice and green veg', ingredients: [{ id: 'chicken', qty: 240 }, { id: 'riceCooked', qty: 350 }, { id: 'greenVeg', qty: 200 }, { id: 'oliveOil', qty: 10 }] },
  standardLowerSnack: { name: 'Standard lower: high-protein yoghurt', ingredients: [{ id: 'yoghurt', qty: 300 }] },
  standardLowerDinner: { name: 'Standard lower: turkey mince, potato, passata and veg', ingredients: [{ id: 'turkey', qty: 250 }, { id: 'potatoes', qty: 350 }, { id: 'passata', qty: 200 }, { id: 'greenVeg', qty: 250 }] },
  standardArmsBreakfast: { name: 'Standard arms: yoghurt, berries and flaxseed', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'berries', qty: 100 }, { id: 'flaxseed', qty: 10 }] },
  standardArmsLunch: { name: 'Standard arms: turkey mince, cooked rice and green veg', ingredients: [{ id: 'turkey', qty: 250 }, { id: 'riceCooked', qty: 300 }, { id: 'greenVeg', qty: 200 }] },
  standardArmsSnack: { name: 'Standard arms: protein drink + apple', ingredients: [{ id: 'proteinDrink', qty: 1 }, { id: 'apple', qty: 1 }] },
  standardArmsDinner: { name: 'Standard arms: chicken, potatoes, salad/veg, oil and feta', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'potatoes', qty: 300 }, { id: 'greenVeg', qty: 300 }, { id: 'oliveOil', qty: 10 }, { id: 'feta', qty: 30 }] },
  standardRestBreakfast: { name: 'Standard rest/swim: yoghurt, whey, berries and flaxseed', ingredients: [{ id: 'yoghurt', qty: 300 }, { id: 'whey', qty: 1 }, { id: 'berries', qty: 100 }, { id: 'flaxseed', qty: 10 }] },
  standardRestLunch: { name: 'Standard rest/swim: chicken, moderate rice and green veg', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 175 }, { id: 'greenVeg', qty: 300 }] },
  standardRestSnack: { name: 'Standard rest/swim: pudding + apple', ingredients: [{ id: 'pudding', qty: 1 }, { id: 'apple', qty: 1 }] },
  standardRestDinner: { name: 'Standard rest/swim: salmon, potato, green veg and oil', ingredients: [{ id: 'salmon', qty: 150 }, { id: 'potatoes', qty: 250 }, { id: 'greenVeg', qty: 300 }, { id: 'oliveOil', qty: 10 }] },

  recoveryBreakfast: { name: 'Recovery: yoghurt + berries', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'berries', qty: 100 }] },
  recoveryReadyMeal: { name: 'Recovery: Lidl high-protein ready meal', ingredients: [{ id: 'readyMeal', qty: 1 }] },
  recoveryDrinkBanana: { name: 'Recovery: protein drink + banana', ingredients: [{ id: 'proteinDrink', qty: 1 }, { id: 'banana', qty: 1 }] },
  recoveryChickenRice: { name: 'Recovery: chicken, moderate rice, salad/veg and oil', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 200 }, { id: 'greenVeg', qty: 300 }, { id: 'oliveOil', qty: 10 }] },
  recoveryEggs: { name: 'Recovery/post-call: eggs, egg whites, spinach and mushrooms', ingredients: [{ id: 'eggs', qty: 3 }, { id: 'eggWhites', qty: 2 }, { id: 'spinachMushrooms', qty: 200 }] },
  recoveryCodDinner: { name: 'Recovery/post-call: cod pack, potatoes, green veg and oil', ingredients: [{ id: 'codPack', qty: 1 }, { id: 'potatoes', qty: 250 }, { id: 'greenVeg', qty: 400 }, { id: 'oliveOil', qty: 10 }] },
  contingencyDrink: { name: 'Lidl contingency: protein drink', ingredients: [{ id: 'proteinDrink', qty: 1 }] },
  contingencyChickenFruit: { name: 'Lidl contingency: ready chicken + fruit', ingredients: [{ id: 'readyChicken', qty: 240 }, { id: 'fruit', qty: 1 }] },
  contingencySnack: { name: 'Lidl contingency: pudding or bar', ingredients: [{ id: 'pudding', qty: 1 }] },

  beastUpperBreakfast: { name: 'Beast upper: yoghurt, whey, oats, banana and berries', ingredients: [{ id: 'yoghurt', qty: 300 }, { id: 'whey', qty: 1 }, { id: 'oats', qty: 50 }, { id: 'banana', qty: 1 }, { id: 'berries', qty: 100 }] },
  beastUpperLunch: { name: 'Beast upper: chicken, high rice, veg and oil', ingredients: [{ id: 'chicken', qty: 200 }, { id: 'riceCooked', qty: 350 }, { id: 'greenVeg', qty: 150 }, { id: 'oliveOil', qty: 5 }] },
  beastUpperSnack: { name: 'Beast upper: protein bar + chicken wrap', ingredients: [{ id: 'proteinBar', qty: 1 }, { id: 'readyChicken', qty: 120 }, { id: 'wrap', qty: 1 }, { id: 'feta', qty: 30 }, { id: 'salad', qty: 100 }] },
  beastUpperDinner: { name: 'Beast upper: salmon, potatoes, veg and oil', ingredients: [{ id: 'salmon', qty: 150 }, { id: 'potatoes', qty: 350 }, { id: 'greenVeg', qty: 200 }, { id: 'oliveOil', qty: 5 }] },
  beastLowerBreakfast: { name: 'Beast lower: oats, whey, banana and berries', ingredients: [{ id: 'oats', qty: 80 }, { id: 'whey', qty: 1 }, { id: 'banana', qty: 1 }, { id: 'berries', qty: 100 }] },
  beastLowerLunch: { name: 'Beast lower: chicken, very high rice, veg and oil', ingredients: [{ id: 'chicken', qty: 240 }, { id: 'riceCooked', qty: 400 }, { id: 'greenVeg', qty: 200 }, { id: 'oliveOil', qty: 10 }] },
  beastLowerSnack: { name: 'Beast lower: protein drink + protein bar', ingredients: [{ id: 'proteinDrink', qty: 1 }, { id: 'proteinBar', qty: 1 }] },
  beastLowerDinner: { name: 'Beast lower: lean beef, potato and salad/veg', ingredients: [{ id: 'beef5', qty: 220 }, { id: 'potatoes', qty: 400 }, { id: 'greenVeg', qty: 300 }] },
  beastArmsBreakfast: { name: 'Beast arms: yoghurt, oats and berries', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'oats', qty: 40 }, { id: 'berries', qty: 100 }] },
  beastArmsLunch: { name: 'Beast arms: turkey, high rice and passata', ingredients: [{ id: 'turkey', qty: 250 }, { id: 'riceCooked', qty: 350 }, { id: 'passata', qty: 200 }] },
  beastArmsSnack: { name: 'Beast arms: protein drink + banana', ingredients: [{ id: 'proteinDrink', qty: 1 }, { id: 'banana', qty: 1 }] },
  beastArmsDinner: { name: 'Beast arms: chicken wrap with salad and feta', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'wrap', qty: 1 }, { id: 'salad', qty: 150 }, { id: 'feta', qty: 30 }] },
  beastRestBreakfast: { name: 'Beast rest/swim: yoghurt, whey, berries and flaxseed', ingredients: [{ id: 'yoghurt', qty: 300 }, { id: 'whey', qty: 1 }, { id: 'berries', qty: 100 }, { id: 'flaxseed', qty: 10 }] },
  beastRestLunch: { name: 'Beast rest/swim: chicken, rice and green veg', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 250 }, { id: 'greenVeg', qty: 300 }] },
  beastRestSnack: { name: 'Beast rest/swim: protein bar + apple', ingredients: [{ id: 'proteinBar', qty: 1 }, { id: 'apple', qty: 1 }] },
  beastRestDinner: { name: 'Beast rest/swim: salmon, potatoes, green veg and oil', ingredients: [{ id: 'salmon', qty: 180 }, { id: 'potatoes', qty: 300 }, { id: 'greenVeg', qty: 300 }, { id: 'oliveOil', qty: 10 }] },

  // Expanded batchable meal library for post-holiday v3.1. These are designed as two-portion recipes by default.
  shawarmaChickenBowl: { name: 'Batch meal: chicken shawarma rice bowl', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 250 }, { id: 'yoghurt', qty: 75 }, { id: 'salad', qty: 200 }, { id: 'oliveOil', qty: 5 }] },
  shawarmaChickenBowlLight: { name: 'Batch meal: lighter chicken shawarma rice bowl', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 200 }, { id: 'yoghurt', qty: 75 }, { id: 'salad', qty: 200 }, { id: 'oliveOil', qty: 3 }] },
  turkeyChilliRiceBowl: { name: 'Batch meal: turkey chilli rice bowl', ingredients: [{ id: 'turkey', qty: 250 }, { id: 'passata', qty: 200 }, { id: 'beans', qty: 75 }, { id: 'peppersOnion', qty: 200 }, { id: 'riceCooked', qty: 250 }] },
  turkeyChilliRiceBowlHighCarb: { name: 'Batch meal: turkey chilli rice bowl - higher carb', ingredients: [{ id: 'turkey', qty: 250 }, { id: 'passata', qty: 200 }, { id: 'beans', qty: 75 }, { id: 'peppersOnion', qty: 200 }, { id: 'riceCooked', qty: 320 }] },
  leanBeefTacoPotatoBowl: { name: 'Batch meal: lean beef taco potato bowl', ingredients: [{ id: 'beef5', qty: 220 }, { id: 'potatoes', qty: 320 }, { id: 'peppersOnion', qty: 200 }, { id: 'passata', qty: 150 }, { id: 'yoghurt', qty: 75 }, { id: 'salad', qty: 150 }] },
  greekChickenFetaTraybake: { name: 'Batch meal: Greek chicken, feta and potato traybake', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'potatoes', qty: 300 }, { id: 'peppersOnion', qty: 250 }, { id: 'feta', qty: 30 }, { id: 'oliveOil', qty: 5 }, { id: 'yoghurt', qty: 75 }] },
  codChorizoStyleTraybake: { name: 'Batch meal: cod chorizo-style potato and greens traybake', ingredients: [{ id: 'codPack', qty: 1 }, { id: 'potatoes', qty: 300 }, { id: 'greenVeg', qty: 250 }, { id: 'peppersOnion', qty: 150 }, { id: 'oliveOil', qty: 5 }] },
  tandooriChickenRiceBowl: { name: 'Batch meal: tandoori chicken rice bowl with yoghurt mint sauce', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 250 }, { id: 'peppersOnion', qty: 200 }, { id: 'yoghurt', qty: 100 }, { id: 'oliveOil', qty: 5 }] },
  tandooriChickenRiceBowlHighCarb: { name: 'Batch meal: tandoori chicken rice bowl - higher carb', ingredients: [{ id: 'chicken', qty: 220 }, { id: 'riceCooked', qty: 330 }, { id: 'peppersOnion', qty: 200 }, { id: 'yoghurt', qty: 100 }, { id: 'oliveOil', qty: 5 }] },

  socialBreakfast: { name: 'Social anchor: protected protein breakfast', ingredients: [{ id: 'yoghurt', qty: 450 }, { id: 'berries', qty: 100 }] },
  socialLunch: { name: 'Social anchor: ready chicken salad + fruit', ingredients: [{ id: 'readyChicken', qty: 240 }, { id: 'salad', qty: 300 }, { id: 'fruit', qty: 1 }] },
  socialSnack: { name: 'Social anchor: protein drink or bar', ingredients: [{ id: 'proteinDrink', qty: 1 }] },
  socialDinner: { name: 'Flexible social meal - not tracked strictly', ingredients: [] },
  travelBreakfast: { name: 'Boat/travel: protein drink + banana', ingredients: [{ id: 'proteinDrink', qty: 1 }, { id: 'banana', qty: 1 }] },
  travelLunch: { name: 'Boat/travel: ready chicken/smoked salmon/ready meal pack', ingredients: [{ id: 'readyChicken', qty: 240 }] },
  travelSnack: { name: 'Boat/travel: protein bar + fruit', ingredients: [{ id: 'proteinBar', qty: 1 }, { id: 'fruit', qty: 1 }] },
  travelDinner: { name: 'Flexible protein-first meal - social/flexible', ingredients: [] },
};

function nutritionForIngredient(line) {
  const item = ingredientDb[line.id];
  if (!item) return { kcal: 0, protein: 0 };
  if (item.kcalEach !== undefined) return { kcal: item.kcalEach * line.qty, protein: item.proteinEach * line.qty };
  return { kcal: item.kcalPer * line.qty, protein: item.proteinPer * line.qty };
}
export function mealNutrition(mealId) {
  const meal = MEALS[mealId];
  if (!meal) return { kcal: 0, protein: 0 };
  return meal.ingredients.reduce((acc, line) => {
    const n = nutritionForIngredient(line);
    acc.kcal += n.kcal;
    acc.protein += n.protein;
    return acc;
  }, { kcal: 0, protein: 0 });
}
export function mealDetails(mealId) {
  const meal = MEALS[mealId];
  if (!meal) return [];
  if (!meal.ingredients.length) return [{ id: 'flexible', label: 'Flexible / social meal', qtyText: 'not tracked', guidance: 'Record as flexible/off-plan with an explanation in the weekly report if used.' }];
  return meal.ingredients.map((line) => {
    const item = ingredientDb[line.id];
    const qty = item.kcalEach !== undefined ? `${line.qty} ${item.unit}${line.qty > 1 ? 's' : ''}` : `${line.qty}${item.unit.startsWith('g') ? 'g' : ' ' + item.unit}`;
    return { ...line, label: item.label, qtyText: qty, guidance: item.guidance };
  });
}
function template(meals, target, templateId, name) { return { ...meals, target, templateId, name }; }
export function dailyTemplate(dietTemplate, dayIndex, session = '', shift = '', settings = {}) {
  const normalizedSession = session === 'Cardio/Swim' ? 'cardio_swim' : session === 'Rest / flexible' ? 'rest' : session.toLowerCase().replaceAll(' ', '_').replaceAll('+', '').replaceAll('/', '_');
  const pressure = shift === 'On-call' || shift === 'Late' || shift === 'Paeds Mid';
  if (dietTemplate === 'hardShred') {
    const hard = [
      template({ breakfast: 'hsMonBreakfast', lunch: 'hsChickenRice100', snack: 'hsBarApple', dinner: 'hsTurkeyDinner' }, { kcal: 1780, protein: 204, carbs: 158, fat: 41 }, 'hard_shred_monday_style', 'Hard Shred Monday / Upper Pull style'),
      template({ breakfast: 'hsTueBreakfast', lunch: 'hsChickenRice125Salad', snack: 'hsPuddingApple', dinner: 'hsSalmonDinner' }, { kcal: 1834, protein: 177, carbs: 158, fat: 41 }, 'hard_shred_tuesday_style_higher_carb', 'Hard Shred Tuesday / Lower-Core or Rest style'),
      template({ breakfast: 'hsWedBreakfast', lunch: 'hsChickenRice240', snack: 'hsBarApple', dinner: 'hsCodPotato100' }, { kcal: 1884, protein: 208, carbs: 158, fat: 41 }, 'hard_shred_wednesday_style', 'Hard Shred Wednesday / Super Arms style'),
      template({ breakfast: 'hsThuBreakfast', lunch: 'hsChickenRice100', snack: 'hsThuSnack', dinner: 'hsTurkeyPotatoDinner' }, { kcal: 1839, protein: 204, carbs: 158, fat: 41 }, 'hard_shred_thursday_style', 'Hard Shred Thursday / On-call-late style'),
      template({ breakfast: 'hsFriBreakfast', lunch: 'hsEggChickenPotato', snack: 'hsChickenRice100', dinner: 'hsCodPotato150' }, { kcal: 1886, protein: 215, carbs: 158, fat: 41 }, 'hard_shred_friday_style', 'Hard Shred Friday / Post-shift high-protein style'),
    ];
    if (shift === 'On-call' || shift === 'Late') return hard[3];
    if (session === 'Lower + Core') return hard[1];
    if (session === 'Super Arms') return hard[2];
    if (session === 'Upper Pull') return hard[0];
    if (session === 'Upper Push') return hard[2];
    if (session === 'Cardio/Swim') return hard[1];
    return hard[dayIndex % hard.length];
  }
  if (dietTemplate === 'recoveryCut') {
    if (pressure || normalizedSession === 'rest') return template({ breakfast: 'recoveryBreakfast', lunch: 'recoveryEggs', snack: 'contingencySnack', dinner: 'recoveryCodDinner' }, { kcal: 2000, protein: 190 }, 'recovery_rest_post_call', 'Recovery Rest / Post-Call');
    return template({ breakfast: 'recoveryBreakfast', lunch: dayIndex % 2 === 0 ? 'recoveryReadyMeal' : 'shawarmaChickenBowlLight', snack: 'recoveryDrinkBanana', dinner: dayIndex % 2 === 0 ? 'recoveryChickenRice' : 'codChorizoStyleTraybake' }, { kcal: 2150, protein: 200 }, 'recovery_lift', 'Recovery Lift Day');
  }
  if (dietTemplate === 'performanceCut') {
    if (session === 'Lower + Core') return template({ breakfast: 'beastLowerBreakfast', lunch: dayIndex % 2 === 0 ? 'turkeyChilliRiceBowlHighCarb' : 'tandooriChickenRiceBowlHighCarb', snack: 'beastLowerSnack', dinner: dayIndex % 2 === 0 ? 'leanBeefTacoPotatoBowl' : 'beastLowerDinner' }, { kcal: 2750, protein: 220 }, 'beast_lower_core', 'Beast Lower + Core');
    if (session === 'Super Arms') return template({ breakfast: 'beastArmsBreakfast', lunch: dayIndex % 2 === 0 ? 'turkeyChilliRiceBowlHighCarb' : 'shawarmaChickenBowl', snack: 'beastArmsSnack', dinner: dayIndex % 2 === 0 ? 'greekChickenFetaTraybake' : 'beastArmsDinner' }, { kcal: 2600, protein: 210 }, 'beast_super_arms', 'Beast Super Arm Day');
    if (session === 'Cardio/Swim' || session === 'Rest / flexible') return template({ breakfast: 'beastRestBreakfast', lunch: dayIndex % 2 === 0 ? 'shawarmaChickenBowl' : 'tandooriChickenRiceBowl', snack: 'beastRestSnack', dinner: dayIndex % 2 === 0 ? 'beastRestDinner' : 'codChorizoStyleTraybake' }, { kcal: 2300, protein: 200 }, 'beast_rest_swim', 'Beast Rest / Swim');
    return template({ breakfast: 'beastUpperBreakfast', lunch: dayIndex % 2 === 0 ? 'shawarmaChickenBowl' : 'tandooriChickenRiceBowlHighCarb', snack: 'beastUpperSnack', dinner: dayIndex % 2 === 0 ? 'beastUpperDinner' : 'greekChickenFetaTraybake' }, { kcal: 2600, protein: 215 }, 'beast_upper', 'Beast Upper Push / Pull');
  }
  if (dietTemplate === 'flexibleProteinProtection') {
    if (session === 'Cardio/Swim' || pressure) return template({ breakfast: 'travelBreakfast', lunch: 'travelLunch', snack: 'travelSnack', dinner: 'travelDinner' }, { kcal: 0, protein: 140 }, 'boat_travel_day', 'Annual Leave / Boat / Travel Day');
    return template({ breakfast: 'socialBreakfast', lunch: 'socialLunch', snack: 'socialSnack', dinner: 'socialDinner' }, { kcal: 0, protein: 160 }, 'social_anchor_day', 'Annual Leave / Social Anchor Day');
  }
  if (session === 'Lower + Core') return template({ breakfast: 'standardLowerBreakfast', lunch: dayIndex % 2 === 0 ? 'turkeyChilliRiceBowlHighCarb' : 'standardLowerLunch', snack: 'standardLowerSnack', dinner: dayIndex % 2 === 0 ? 'leanBeefTacoPotatoBowl' : 'standardLowerDinner' }, { kcal: 2350, protein: 195 }, 'standard_lower_core', 'Standard Lower + Core');
  if (session === 'Super Arms') return template({ breakfast: 'standardArmsBreakfast', lunch: dayIndex % 2 === 0 ? 'shawarmaChickenBowl' : 'standardArmsLunch', snack: 'standardArmsSnack', dinner: dayIndex % 2 === 0 ? 'greekChickenFetaTraybake' : 'standardArmsDinner' }, { kcal: 2250, protein: 195 }, 'standard_super_arms', 'Standard Super Arm Day');
  if (session === 'Cardio/Swim' || session === 'Rest / flexible') return template({ breakfast: 'standardRestBreakfast', lunch: dayIndex % 2 === 0 ? 'codChorizoStyleTraybake' : 'standardRestLunch', snack: 'standardRestSnack', dinner: dayIndex % 2 === 0 ? 'standardRestDinner' : 'codChorizoStyleTraybake' }, { kcal: 2050, protein: 185 }, 'standard_rest_swim', 'Standard Rest / Swim');
  return template({ breakfast: 'standardUpperBreakfast', lunch: dayIndex % 2 === 0 ? 'shawarmaChickenBowl' : 'tandooriChickenRiceBowl', snack: 'standardUpperSnack', dinner: dayIndex % 2 === 0 ? 'standardUpperDinner' : 'greekChickenFetaTraybake' }, { kcal: 2230, protein: 200 }, 'standard_upper', 'Standard Upper Push / Pull');
}
export function dayNutrition(dayMeals) {
  return MEAL_KEYS.reduce((acc, key) => {
    const mealId = dayMeals[key];
    if (mealId) {
      const n = mealNutrition(mealId);
      acc.kcal += n.kcal;
      acc.protein += n.protein;
    }
    return acc;
  }, { kcal: 0, protein: 0 });
}
export function roundNutrition(n) { return { kcal: Math.round(n.kcal), protein: Math.round(n.protein) }; }

export function makeRows(startIso, weeks) {
  const days = Math.max(7, Math.min(28, Number(weeks || 1) * 7));
  const start = new Date(`${startIso || tomorrowIso()}T12:00:00`);
  return Array.from({ length: days }, (_, i) => ({
    date: toIsoDate(addDays(start, i)),
    shift: '',
    equipment: '',
    constraint: '',
    mealsMode: 'full',
    meals: { breakfast: true, lunch: true, snack: true, dinner: true },
  }));
}
export function todayIso() { return toIsoDate(new Date()); }
export function tomorrowIso() { return toIsoDate(addDays(new Date(), 1)); }
export function formatDate(iso) { return iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) : ''; }
export function isPast(iso) { return iso < todayIso(); }
export function isWeekend(iso) { const day = new Date(`${iso}T12:00:00`).getDay(); return day === 0 || day === 6; }

export function canTrain(row) {
  if (!row.date || !row.equipment) return false;
  if (row.constraint === 'No training' || row.equipment === 'No gym') return false;
  if (row.shift === 'AL') return row.constraint !== '' || row.equipment !== '';
  return true;
}
function score(row, session) {
  if (!canTrain(row)) return -999;
  let v = 0;
  if (row.constraint === 'Must train early') v += 8;
  if (['Day', 'Off', 'SPA', 'CADRE'].includes(row.shift)) v += 5;
  if (['Mid', 'Paeds Mid', 'Late'].includes(row.shift)) v += 4;
  if (row.shift === 'On-call') v += session === 'Lower + Core' ? 1 : 3;
  if (isWeekend(row.date)) v += 3;
  if (row.equipment === 'Full gym') v += 4;
  if (row.equipment === 'Home dumbbells + bench') v += session === 'Lower + Core' ? 0 : 2;
  if (row.equipment === 'Hotel gym') v += 1;
  if (row.equipment === 'Cardio/swim only') v += session === 'Cardio/Swim' ? 10 : -30;
  if (row.constraint === 'Cardio/swim only') v += session === 'Cardio/Swim' ? 10 : -30;
  if (row.constraint === 'Travel/social') v -= 7;
  return v;
}
export function generateTrainingPlan(rows, options = {}) {
  const {
    mode = 'standard',
    allowHybrid = false,
    useCarryOver = false,
    previousContext = [],
    recoveryState = 'normal',
  } = options;
  const planned = rows.map((row) => ({ ...row, session: 'Rest / flexible', warning: '' }));
  const weeks = {};
  planned.forEach((row, index) => {
    const d = new Date(`${row.date}T12:00:00`);
    const monday = addDays(d, -((d.getDay() + 6) % 7));
    const key = toIsoDate(monday);
    weeks[key] = weeks[key] || [];
    weeks[key].push({ row, index });
  });
  const carry = Array.isArray(previousContext) ? previousContext : [];
  Object.entries(weeks).forEach(([weekKey, week]) => {
    const used = new Set();
    const placed = [];
    LIFTS.forEach((session) => {
      let best = null;
      let bestScore = -999;
      week.forEach((candidate) => {
        const { row, index } = candidate;
        if (used.has(index) || !canTrain(row)) return;
        if (row.equipment === 'Cardio/swim only' || row.constraint === 'Cardio/swim only') return;
        let s = score(row, session);
        placed.forEach((p) => {
          if (Math.abs(daysBetween(p.date, row.date)) === 1 && ARM_HEAVY.has(p.session) && ARM_HEAVY.has(session)) s -= 5;
          if (Math.abs(daysBetween(p.date, row.date)) === 1 && p.session === session) s -= 8;
        });
        if (useCarryOver) {
          carry.forEach((p) => {
            const gap = Math.abs(daysBetween(p.date, row.date));
            if (gap <= 2 && p.session === session) s -= 10;
            if (gap <= 1 && ARM_HEAVY.has(p.session) && ARM_HEAVY.has(session)) s -= 8;
            if (gap <= 2 && p.session === 'Lower + Core' && session === 'Lower + Core') s -= 10;
          });
        }
        if (session === 'Lower + Core' && row.shift === 'On-call') s -= 4;
        if (recoveryState === 'flat' || recoveryState === 'postCall') s -= 2;
        if (s > bestScore) { bestScore = s; best = candidate; }
      });
      if (best && bestScore > -50) {
        planned[best.index].session = session;
        used.add(best.index);
        placed.push({ session, date: best.row.date });
      }
    });
    let cardioBest = null;
    let cardioScore = -999;
    week.forEach((candidate) => {
      const { row, index } = candidate;
      if (used.has(index) || !canTrain(row) || row.equipment === 'No gym') return;
      const s = score(row, 'Cardio/Swim');
      if (s > cardioScore) { cardioScore = s; cardioBest = candidate; }
    });
    if (cardioBest && cardioScore > -50) {
      planned[cardioBest.index].session = 'Cardio/Swim';
      used.add(cardioBest.index);
      placed.push({ session: 'Cardio/Swim', date: cardioBest.row.date });
    }

    const coreLiftCount = week.filter(({ index }) => LIFTS.includes(planned[index].session)).length;
    const cardioCount = week.filter(({ index }) => planned[index].session === 'Cardio/Swim').length;
    const recoveryAllowsHybrid = !['flat', 'postCall'].includes(recoveryState);
    const hybridAllowed = allowHybrid && mode === 'beast' && recoveryAllowsHybrid && coreLiftCount >= 4 && cardioCount >= 1;
    if (hybridAllowed) {
      let hybridBest = null;
      let hybridScore = -999;
      week.forEach((candidate) => {
        const { row, index } = candidate;
        if (used.has(index) || !canTrain(row)) return;
        if (row.equipment === 'No gym' || row.equipment === 'Cardio/swim only' || row.constraint === 'Cardio/swim only') return;
        let s = score(row, 'Hybrid Upper Pump') - 1;
        placed.forEach((p) => {
          const gap = Math.abs(daysBetween(p.date, row.date));
          if (gap <= 1 && ARM_HEAVY.has(p.session)) s -= 12;
          if (gap <= 1 && p.session === 'Cardio/Swim') s += 1;
          if (gap <= 1 && p.session === 'Lower + Core') s += 2;
        });
        if (row.shift === 'On-call') s -= 8;
        if (row.constraint === 'Travel/social') s -= 6;
        if (s > hybridScore) { hybridScore = s; hybridBest = candidate; }
      });
      if (hybridBest && hybridScore > -25) {
        planned[hybridBest.index].session = 'Hybrid Upper Pump';
        used.add(hybridBest.index);
        placed.push({ session: 'Hybrid Upper Pump', date: hybridBest.row.date });
      }
    }

    const liftCount = week.filter(({ index }) => LIFTS.includes(planned[index].session)).length;
    const finalCardioCount = week.filter(({ index }) => planned[index].session === 'Cardio/Swim').length;
    const hybridCount = week.filter(({ index }) => planned[index].session === 'Hybrid Upper Pump').length;
    week.forEach(({ row, index }) => {
      const warnings = [];
      if (row.shift === 'AL') warnings.push('AL: confirm gym/travel/social constraints before relying on this schedule.');
      if (row.shift === 'On-call' && planned[index].session !== 'Rest / flexible') warnings.push('On-call: train before shift; reduce slightly only if genuinely flat.');
      if (row.constraint === 'Travel/social') warnings.push('Travel/social constraint: avoid guilt catch-up or maximal sessions.');
      if (planned[index].session === 'Lower + Core' && row.shift === 'On-call') warnings.push('Lower day on on-call is not ideal; acceptable only if scheduling is tight.');
      if (planned[index].session === 'Hybrid Upper Pump') warnings.push('Optional 5th lift: pump/weak-point only, not a required session.');
      if (index === week[0].index) {
        if (liftCount < 4) warnings.push(`Week starting ${formatDate(weekKey)} fits only ${liftCount}/4 main lifts.`);
        if (finalCardioCount < 1) warnings.push('No cardio/swim fitted this week.');
        if (allowHybrid && mode === 'beast' && hybridCount < 1) warnings.push('Beast hybrid lift not added: spacing/recovery/available slots did not justify it.');
        if (useCarryOver && carry.length) warnings.push('Previous-week carry-over context used for spacing.');
      }
      planned[index].warning = warnings.join(' ');
    });
  });
  return planned;
}
function daysBetween(a, b) { return Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`)) / 86400000); }

export function selectedMealsForRow(row) {
  if (row.mealsMode === 'none') return [];
  if (row.mealsMode === 'select') return MEAL_KEYS.filter((k) => row.meals?.[k]);
  return [...MEAL_KEYS];
}
export function generateDietPlan(rows, trainingPlan, settings) {
  let weekdayIndex = 0;
  return rows.map((row, idx) => {
    const selected = selectedMealsForRow(row);
    const session = trainingPlan[idx]?.session || '';
    const source = dailyTemplate(settings.dietTemplate, weekdayIndex, session, row.shift || '', settings);
    if (!isWeekend(row.date)) weekdayIndex += 1;
    const meals = {};
    selected.forEach((key) => { meals[key] = source[key]; });
    const isPartial = selected.length > 0 && selected.length < MEAL_KEYS.length;
    const noMeals = selected.length === 0;
    const calculated = roundNutrition(dayNutrition(meals));
    const nutrition = (!noMeals && !isPartial && source.target && source.target.kcal > 0) ? { kcal: source.target.kcal, protein: source.target.protein } : calculated;
    return { date: row.date, selectedMeals: selected, meals, nutrition, isPartial, noMeals, templateId: source.templateId || '', templateName: source.name || '' };
  });
}
export function classifyDietDay(day, mealStatus = {}, partialReason = '') {
  if (day.noMeals || day.selectedMeals.length === 0) return partialReason ? 'No generated meals / explained' : 'No generated meals / untracked';
  const statuses = day.selectedMeals.map((key) => mealStatus[`${day.date}:${key}`]?.status || 'unconfirmed');
  const allDone = statuses.length > 0 && statuses.every((s) => s === 'done_on_plan');
  const anyOff = statuses.some((s) => s === 'off_plan');
  const anySkipped = statuses.some((s) => s === 'skipped');
  const anyUnconfirmed = statuses.some((s) => s === 'unconfirmed');
  if (day.isPartial) return partialReason ? 'Partial on-plan / explained' : 'Partial on-plan / explanation required';
  if (allDone && !anyOff && !anySkipped) return 'Fully on-plan';
  if (anyOff) return 'Flexible/off-plan meals present';
  if (anySkipped) return 'Incomplete/skipped meals present';
  if (anyUnconfirmed) return 'Unconfirmed';
  return 'Mixed / review';
}
export function offPlanEquivalentForDay(day, mealStatus = {}) {
  if (day.noMeals || day.selectedMeals.length === 0) return 1;
  if (day.isPartial) return 0.5;
  const statuses = day.selectedMeals.map((key) => mealStatus[`${day.date}:${key}`]?.status || 'unconfirmed');
  const offCount = statuses.filter((s) => s === 'off_plan' || s === 'skipped').length;
  return Math.min(1, offCount / 4);
}
export function offPlanWarnings(dietPlan, mealStatus = {}) {
  const weeks = {};
  dietPlan.forEach((day) => {
    const d = new Date(`${day.date}T12:00:00`);
    const monday = toIsoDate(addDays(d, -((d.getDay() + 6) % 7)));
    weeks[monday] = weeks[monday] || 0;
    weeks[monday] += offPlanEquivalentForDay(day, mealStatus);
  });
  return Object.entries(weeks).filter(([, v]) => v > 2).map(([week, v]) => ({ week, value: Number(v.toFixed(1)), message: `Diet planning warning: ${Number(v.toFixed(1))} off-plan-equivalent days in week starting ${formatDate(week)}; exceeds 2/week ceiling.` }));
}
export function buildShoppingList(dietPlan, mealStatus = {}, selectedDates = null, shoppingChecked = {}) {
  const dateSet = selectedDates ? new Set(selectedDates) : null;
  const totals = {};
  dietPlan.forEach((day) => {
    if (dateSet && !dateSet.has(day.date)) return;
    day.selectedMeals.forEach((key) => {
      const status = mealStatus[`${day.date}:${key}`]?.status || 'unconfirmed';
      if (status === 'done_on_plan' || status === 'off_plan' || status === 'skipped') return;
      const mealId = day.meals[key];
      const meal = MEALS[mealId];
      if (!meal) return;
      meal.ingredients.forEach((line) => {
        totals[line.id] = (totals[line.id] || 0) + line.qty;
      });
    });
  });
  return Object.entries(totals).map(([id, qty]) => {
    const item = ingredientDb[id];
    return { id, label: item.label, amount: shoppingAmount(id, qty, item), guidance: item.guidance, checked: Boolean(shoppingChecked[id]) };
  }).sort((a, b) => a.label.localeCompare(b.label));
}
function shoppingAmount(id, qty, item) {
  if (id === 'riceCooked') {
    const dryLow = Math.ceil((qty / 3) / 10) * 10;
    const dryHigh = Math.ceil((qty / 2.6) / 10) * 10;
    return `Exact use: ${formatAmount(qty, item.unit)} cooked; buy/cook approx ${dryLow}-${dryHigh}g dry rice`;
  }
  if (item.kcalEach !== undefined) return `Exact use: ${qty} ${item.unit}${qty === 1 ? '' : 's'}; buy ${Math.ceil(qty)} ${item.unit}${qty === 1 ? '' : 's'}`;
  const exact = formatAmount(qty, item.unit);
  let buy = exact;
  if (item.packSize) buy = `${Math.ceil(qty / item.packSize)} x ${item.packSize}g pack/tub`;
  else if (item.packRound) buy = formatAmount(Math.ceil(qty / item.packRound) * item.packRound, item.unit);
  return `Exact use: ${exact}; buy approx ${buy}`;
}
function formatAmount(qty, unit) {
  if (unit.startsWith('g')) return qty >= 1000 ? `${(qty / 1000).toFixed(qty % 1000 === 0 ? 0 : 2)}kg ${unit.replace('g ', '')}`.trim() : `${Math.round(qty)}g ${unit.replace('g ', '')}`.trim();
  return `${Math.round(qty)} ${unit}`;
}
export function validateReport({ trainingPlan, dietPlan, workoutStatus, mealStatus, partialReasons, alcoholStatus, subjectiveNote }) {
  const blockers = [];
  const flags = [];
  trainingPlan.forEach((row) => {
    if (row.session === 'Rest / flexible') return;
    const record = workoutStatus[row.date] || { status: 'unconfirmed', note: '' };
    if (row.session === 'Hybrid Upper Pump') {
      if ((record.status === 'missed' || record.status === 'moved') && !record.note) flags.push(`${formatDate(row.date)} optional Hybrid Upper Pump: note useful but not required.`);
      return;
    }
    if (record.status === 'unconfirmed') blockers.push(`${formatDate(row.date)} ${row.session}: workout not confirmed.`);
    if ((record.status === 'missed' || record.status === 'moved') && !record.note) blockers.push(`${formatDate(row.date)} ${row.session}: explanation required.`);
  });
  dietPlan.forEach((day) => {
    if (day.noMeals) {
      if (!partialReasons[day.date]) blockers.push(`${formatDate(day.date)}: no generated meals / untracked day needs explanation.`);
      return;
    }
    if (day.isPartial && !partialReasons[day.date]) blockers.push(`${formatDate(day.date)}: partial on-plan day needs explanation.`);
    day.selectedMeals.forEach((key) => {
      const record = mealStatus[`${day.date}:${key}`] || { status: 'unconfirmed', note: '' };
      if (record.status === 'unconfirmed') blockers.push(`${formatDate(day.date)} ${MEAL_LABELS[key]}: meal not confirmed.`);
      if ((record.status === 'off_plan' || record.status === 'skipped') && !record.note) blockers.push(`${formatDate(day.date)} ${MEAL_LABELS[key]}: explanation required.`);
    });
    if (!day.isPartial && day.selectedMeals.length === 4 && (day.nutrition.kcal < 1500 || day.nutrition.protein < 140)) {
      flags.push(`${formatDate(day.date)}: planned full day is unusually low (${day.nutrition.kcal} kcal / ${day.nutrition.protein}g protein); review template/meal selection.`);
    }
  });
  if (!alcoholStatus) blockers.push('Alcohol status must be logged.');
  if (!subjectiveNote || !subjectiveNote.trim()) blockers.push('Subjective physique/performance note is required.');
  const offWarnings = offPlanWarnings(dietPlan, mealStatus).map((w) => w.message);
  return { blockers, flags: [...flags, ...offWarnings], canGenerate: blockers.length === 0 };
}
export function reportSummary({ trainingPlan, dietPlan, workoutStatus, mealStatus, partialReasons }) {
  const plannedLifts = trainingPlan.filter((r) => LIFTS.includes(r.session)).length;
  const completedLifts = trainingPlan.filter((r) => LIFTS.includes(r.session) && workoutStatus[r.date]?.status === 'completed').length;
  const plannedCardio = trainingPlan.filter((r) => r.session === 'Cardio/Swim').length;
  const completedCardio = trainingPlan.filter((r) => r.session === 'Cardio/Swim' && workoutStatus[r.date]?.status === 'completed').length;
  const plannedHybrid = trainingPlan.filter((r) => r.session === 'Hybrid Upper Pump').length;
  const completedHybrid = trainingPlan.filter((r) => r.session === 'Hybrid Upper Pump' && workoutStatus[r.date]?.status === 'completed').length;
  const classes = dietPlan.map((d) => classifyDietDay(d, mealStatus, partialReasons[d.date] || ''));
  return {
    plannedLifts, completedLifts, plannedCardio, completedCardio, plannedHybrid, completedHybrid,
    fullDietDays: classes.filter((c) => c === 'Fully on-plan').length,
    partialDietDays: classes.filter((c) => c.startsWith('Partial')).length,
    flexibleDietDays: classes.filter((c) => c.includes('off-plan')).length,
    noMealDays: classes.filter((c) => c.startsWith('No generated meals')).length,
    unconfirmedDietDays: classes.filter((c) => c === 'Unconfirmed' || c.includes('required')).length,
  };
}

const work = (name, prescription, notes, extra = {}) => ({ name, prescription, notes, ...extra });
export const CARDIO_SWIM_TEMPLATES = {
  fullBikeIntervalsSwim: {
    label: 'Full bike + intervals + 1km swim',
    items: [
      work('Zone 2 bike', '20 minutes', 'Aerobic base and weight-control support. Keep it genuinely conversational.'),
      work('Zone 3-4 intervals', '15 minutes', 'Bike or Skillmill high/low intervals without burying recovery.'),
      work('Reset swim', '1 km', 'Technique-led low-impact conditioning and mental reset.'),
    ],
  },
  zone2BikeSteadySwim: {
    label: 'Zone 2 bike + steady swim',
    items: [
      work('Zone 2 bike', '25-35 minutes', 'Low-fatigue aerobic work.'),
      work('Steady swim', '1,000-1,500 m', 'Smooth technique and shoulder rhythm. Keep it decompressive.'),
    ],
  },
  structuredSwim: {
    label: 'Structured swim only',
    items: [
      work('Warm-up swim', '200 m easy', 'Settle stroke, breathing and rhythm.'),
      work('Build set', '4 x 50 m build', 'Progress each 50 from easy to moderate/hard; relaxed form.'),
      work('Main set', '6-8 x 100 m steady/moderate', 'Controlled aerobic set with repeatable pace.'),
      work('Speed touch', '4-6 x 25 m hard', 'Crisp but not ragged. Full recovery as needed.'),
      work('Cooldown', '100-200 m easy', 'Finish loose and fresh.'),
    ],
  },
  resetSwim: {
    label: '1km reset swim',
    items: [
      work('Technique reset swim', '1 km continuous or broken', 'Easy/moderate decompression swim. Prioritise rhythm, not effort.'),
    ],
  },
  recoveryZone2: {
    label: 'Recovery Zone 2 only',
    items: [
      work('Zone 2 bike or easy swim', '25-40 minutes', 'Recovery-biased aerobic exposure. No intervals, no ego.'),
    ],
  },
};
export const WORKOUTS = {
  'Upper Push': [
    work('Incline Machine or Smith Press', '5 x 6-8', 'Main upper-chest strength movement.', { home: 'Incline DB Press', hotel: 'Incline DB or Machine Press' }),
    work('Incline DB Press', '4 x 8-10', 'Secondary upper-chest volume.'),
    work('Seated DB Shoulder Press', '3-4 x 8-10', 'Controlled delt press.'),
    work('Cable Lateral Raise', '4 x 12-15', 'Rounded-delt work.', { home: 'DB Lateral Raise', hotel: 'DB/Cable Lateral Raise' }),
    work('High-to-Low Cable Fly / Chest Fly', '3 x 12-15', 'Chest finisher.', { home: 'DB Fly / Press-Around', hotel: 'Cable/Pec Deck/DB Fly' }),
    work('Optional Triceps Pushdown', '2-3 x 10-12', 'Optional arm frequency.', { optional: true, home: 'DB Skullcrusher / Close-Grip DB Press' }),
  ],
  'Lower + Core': [
    work('Back Squat', '5 x 5', 'Primary lower-body strength.', { home: 'Goblet Squat / DB Front Squat', hotel: 'Leg Press or Goblet Squat' }),
    work('Romanian Deadlift', '4 x 6-8', 'Hamstrings/glutes; strict hinge.', { home: 'DB Romanian Deadlift', hotel: 'DB Romanian Deadlift' }),
    work('Bulgarian Split Squat', '3 x 8-10/leg', 'Unilateral leg work.'),
    work('Leg Extension', '3 x 10-12', 'Quad volume.', { home: 'Tempo Goblet Squat', hotel: 'Leg Extension or Leg Press' }),
    work('Hamstring Curl', '3 x 10-12', 'Hamstring isolation.', { home: 'Slider Curl / Hamstring Walkout' }),
    work('Ab Wheel', '4 x 8-10', 'Anti-extension core.'),
    work('Dead Bugs', '3 x 10/side', 'Controlled trunk work.'),
  ],
  'Upper Pull': [
    work('Lat Pulldown', '5 x 8-10', 'Primary vertical pull.', { home: 'DB Pullover / Band Pulldown' }),
    work('Straight-Arm Pulldown', '3 x 12-15', 'Lat isolation.', { home: 'DB Pullover' }),
    work('Seated Row', '3-4 x 8-10', 'Main horizontal pull.', { home: 'Chest-Supported DB Row', hotel: 'Cable/Machine Row' }),
    work('Chest-Supported Row', '3 x 10-12', 'Upper-back thickness.'),
    work('Rear Delt Fly', '3 x 15-20', 'Rear delts and shoulder roundness.'),
    work('Optional Incline DB Curl', '2-3 x 10-12', 'Biceps support.', { optional: true }),
  ],
  'Super Arms': [
    work('Warm-up Row', '10 minutes', 'Top of Zone 2 / low Zone 3.'),
    work('EZ or Machine Preacher Curl', '3 x 8-10', 'Strict biceps loading.', { home: 'Incline DB Curl' }),
    work('Cable Pushdown', '3-4 x 10-12', 'Main triceps pushdown.', { home: 'DB Skullcrusher / Close-Grip DB Press' }),
    work('Incline DB Curl', '3-4 x 10-12, 3s eccentric', 'Long-head biceps bias.'),
    work('Overhead Rope Extension', '3-4 x 12-15', 'Long-head triceps.', { home: 'DB Overhead Extension' }),
    work('Hammer Curl', '3 x 10-12', 'Brachialis/forearm contribution.'),
    work('Bayesian Cable Curl', '3 x 12-15', 'High-tension curl finisher.', { home: 'Incline DB Curl Substitute', hotel: 'Cable Curl or Incline DB Curl' }),
    work("Farmer's Carries", '2-4 carries', 'Default finisher where time allows.', { finisher: true }),
  ],

  'Hybrid Upper Pump': [
    work('Incline Machine Press', '3 x 10-12', 'Pump-focused upper chest. RIR 1-2, no grinders.', { home: 'Incline DB Press', hotel: 'Incline DB or Machine Press' }),
    work('Lat Pulldown', '3 x 10-12', 'Controlled vertical pull. Keep it restorative, not maximal.', { home: 'DB Pullover / Band Pulldown' }),
    work('High-to-Low Cable Fly', '3 x 12-15', 'Upper chest/serratus-friendly pump.', { home: 'DB Fly / Press-Around' }),
    work('Seated Row', '3 x 10-12', 'Balanced upper-back volume.', { home: 'Chest-Supported DB Row' }),
    work('Cable Lateral Raise', '4 x 15-20', 'Delt cap priority.', { home: 'DB Lateral Raise' }),
    work('Rope Pushdown', '3 x 12-15', 'Triceps pump; stop before elbow irritation.', { home: 'DB Skullcrusher / Close-Grip DB Press' }),
    work('Bayesian or Cable Hammer Curl', '3 x 12-15', 'Arm pump without heavy loading.', { home: 'Incline DB Curl / Hammer Curl' }),
    work('Optional Rear Delt Fly', '2 x 15-20', 'Only if time/recovery are good.', { optional: true }),
  ],
  'Cardio/Swim': [
    work('Zone 2 cardio', '20 minutes', 'Bike or equivalent.'),
    work('Skillmill high/low intervals', '15 minutes', 'Zone 3-4 without burying recovery.'),
    work('Swim', '1 km', 'Technique-led low-impact conditioning and mental reset.'),
  ],
};
export function tailorWorkout(session, equipment, template, cardioTemplate = 'fullBikeIntervalsSwim') {
  const base = session === 'Cardio/Swim' ? (CARDIO_SWIM_TEMPLATES[cardioTemplate]?.items || WORKOUTS[session] || []) : (WORKOUTS[session] || []);
  return base.map((item) => {
    let name = item.name;
    let notes = item.notes;
    let prescription = item.prescription;
    if (equipment === 'Home dumbbells + bench' && item.home) name = item.home;
    if (equipment === 'Hotel gym' && item.hotel) name = item.hotel;
    if (template === 'recoveryBaseline') { prescription = item.optional || item.finisher ? 'Omit if flat' : `${prescription}; reduce 1 set or 10-15% load`; notes += ' Recovery mode: no grinding reps.'; }
    if (template === 'beastProgression' && !item.optional) { notes += ' Beast mode: progression intent if recovery is good.'; }
    if (template === 'flexibleTravel') { notes += ' Flexible mode: minimum effective dose is valid.'; }
    return { ...item, name, prescription, notes };
  });
}
