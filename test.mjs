import assert from 'node:assert/strict';
import {
  VERSION, PROGRAMME_MODES, makeRows, generateTrainingPlan, generateDietPlan, buildShoppingList, validateReport,
  mealNutrition, dailyTemplate, roundNutrition, offPlanWarnings, reportSummary, WORKOUTS, DIET_TEMPLATES, MEALS,
  CARDIO_SWIM_TEMPLATES, tailorWorkout
} from './engine.mjs';

assert.equal(VERSION, '3.1.0', 'version should be v3.1');
assert.ok(CARDIO_SWIM_TEMPLATES.structuredSwim.items.length >= 5, 'structured swim template should be present');
assert.ok(CARDIO_SWIM_TEMPLATES.fullBikeIntervalsSwim.items.length >= 3, 'full bike/swim cardio template should be present');
assert.ok(MEALS.shawarmaChickenBowl, 'expanded meal library should include shawarma bowl');
assert.ok(MEALS.turkeyChilliRiceBowl, 'expanded meal library should include turkey chilli bowl');
assert.ok(MEALS.greekChickenFetaTraybake, 'expanded meal library should include Greek traybake');
assert.ok(MEALS.codChorizoStyleTraybake, 'expanded meal library should include cod traybake');

const settings = { startDate: '2026-10-12', weeks: 1, mode: 'standard', workoutTemplate: PROGRAMME_MODES.standard.workoutTemplate, dietTemplate: PROGRAMME_MODES.standard.dietTemplate, cardioTemplate: 'structuredSwim' };
let rows = makeRows(settings.startDate, settings.weeks).map((r) => ({ ...r, shift: 'Off', equipment: 'Full gym' }));
assert.equal(rows.length, 7, '1-week plan should create 7 rows');
let training = generateTrainingPlan(rows, { mode: 'standard', allowHybrid: false });
assert.equal(training.filter((r) => ['Upper Push','Lower + Core','Upper Pull','Super Arms'].includes(r.session)).length, 4, 'full-gym week should schedule 4 main lifts');
assert.equal(training.filter((r) => r.session === 'Cardio/Swim').length, 1, 'full-gym week should schedule cardio/swim');
let cardioItems = tailorWorkout('Cardio/Swim', 'Full gym', 'standardAestheticCut', 'structuredSwim');
assert.ok(cardioItems.some((i) => i.name.includes('Main set')), 'structured swim workout should expose structured swim work');

let beastTraining = generateTrainingPlan(rows, { mode: 'beast', allowHybrid: true, recoveryState: 'normal' });
assert.equal(beastTraining.filter((r) => r.session === 'Hybrid Upper Pump').length, 1, 'Beast mode should add hybrid lift when spacing allows');
let tiredBeast = generateTrainingPlan(rows, { mode: 'beast', allowHybrid: true, recoveryState: 'postCall' });
assert.equal(tiredBeast.filter((r) => r.session === 'Hybrid Upper Pump').length, 0, 'post-call recovery should suppress hybrid lift');

let diet = generateDietPlan(rows, training, settings);
assert.equal(diet.length, 7, 'diet should preserve row count');
assert.ok(diet.some((d) => Object.values(d.meals).includes('shawarmaChickenBowl') || Object.values(d.meals).includes('tandooriChickenRiceBowl')), 'standard diet should use expanded batchable meals');

const hardSettings = { ...settings, mode: 'hardShred', workoutTemplate: PROGRAMME_MODES.hardShred.workoutTemplate, dietTemplate: PROGRAMME_MODES.hardShred.dietTemplate };
let hardDiet = generateDietPlan(rows, training, hardSettings);
assert.ok(hardDiet[0].nutrition.kcal >= 1750, 'full Hard Shred day should not be an accidental 880 kcal day');
assert.ok([1780,1834,1884,1839,1886].includes(hardDiet[0].nutrition.kcal), 'Hard Shred should use exact uploaded weekday macro targets');

const partialRows = rows.map((r, i) => i === 1 ? { ...r, mealsMode: 'select', meals: { breakfast: true, lunch: true, snack: true, dinner: false } } : r);
const partialDiet = generateDietPlan(partialRows, training, settings);
assert.equal(partialDiet[1].isPartial, true, 'selected meals should create a partial day');
assert.ok(partialDiet[1].nutrition.kcal < diet[1].nutrition.kcal, 'partial day should reduce planned kcal');
assert.ok(roundNutrition(mealNutrition('hsThuBreakfast')).protein >= 50, 'Hard Shred yoghurt breakfast should be high protein');

let shopping = buildShoppingList(diet, {}, rows.slice(0,7).map((r) => r.date), {});
assert.ok(shopping.some((item) => item.label.includes('Yoghurt')), 'shopping list should include yoghurt');
assert.ok(shopping.some((item) => item.amount.includes('Exact use:') && item.amount.includes('buy')), 'shopping list should show exact use and rounded buy guidance');
assert.ok(shopping.some((item) => item.label.includes('rice') && item.amount.includes('dry rice')), 'rice shopping should show cooked-to-dry estimate');
const mealStatus = {};
diet[0].selectedMeals.forEach((key) => mealStatus[`${diet[0].date}:${key}`] = { status: 'done_on_plan', note: '' });
shopping = buildShoppingList(diet, mealStatus, [diet[0].date], {});
assert.equal(shopping.length, 0, 'completed/locked meals should be excluded from live shopping');

const workoutStatus = {};
beastTraining.filter((r) => r.session !== 'Rest / flexible' && r.session !== 'Hybrid Upper Pump').forEach((r) => workoutStatus[r.date] = { status: 'completed', note: '' });
const allMealStatus = {};
diet.forEach((day) => day.selectedMeals.forEach((key) => allMealStatus[`${day.date}:${key}`] = { status: 'done_on_plan', note: '' }));
const validWithUnconfirmedHybrid = validateReport({ trainingPlan: beastTraining, dietPlan: diet, workoutStatus, mealStatus: allMealStatus, partialReasons: {}, alcoholStatus: 'Within plan', subjectiveNote: 'Good week' });
assert.equal(validWithUnconfirmedHybrid.canGenerate, true, 'optional hybrid should not block report generation if unconfirmed');
const invalid = validateReport({ trainingPlan: training, dietPlan: partialDiet, workoutStatus, mealStatus: allMealStatus, partialReasons: {}, alcoholStatus: 'Within plan', subjectiveNote: 'Good week' });
assert.equal(invalid.canGenerate, false, 'partial day should require explanation');
const offWarnings = offPlanWarnings(partialDiet.map((d) => ({ ...d, selectedMeals: [] })), {});
assert.ok(offWarnings.length > 0, 'off-plan equivalent should create warning when >2/week');
const summary = reportSummary({ trainingPlan: beastTraining, dietPlan: diet, workoutStatus, mealStatus: allMealStatus, partialReasons: {} });
assert.equal(summary.plannedLifts, 4, 'summary should count core planned lifts');
assert.equal(summary.plannedHybrid, 1, 'summary should count optional hybrid separately');
assert.ok(WORKOUTS['Cardio/Swim'].length >= 3, 'cardio/swim fallback should have parts');
assert.ok(WORKOUTS['Hybrid Upper Pump'].length >= 7, 'hybrid workout should be present');
assert.ok(dailyTemplate('performanceCut', 0, 'Lower + Core').dinner, 'performance diet should generate dinner');
assert.equal(DIET_TEMPLATES.hardShred, 'Hard Shred Diet', 'Hard Shred label should be present');
console.log('Transformation Engine v3.1 self-tests passed.');
