import {
  VERSION, MEAL_KEYS, MEAL_LABELS, SHIFTS, EQUIPMENT, CONSTRAINTS, WORKOUT_STATUSES, MEAL_STATUSES, ALCOHOL_STATUSES,
  PROGRAMME_MODES, WORKOUT_TEMPLATES, DIET_TEMPLATES, MEALS, CARDIO_SWIM_TEMPLATES,
  makeRows, formatDate, isPast, generateTrainingPlan, generateDietPlan, mealDetails,
  classifyDietDay, offPlanWarnings, buildShoppingList, validateReport, reportSummary, tailorWorkout
} from './engine.mjs';

const STORAGE_KEY = 'transformation-engine-v3-1-post-holiday-focus';
const app = document.getElementById('app');

function pad2(n) { return String(n).padStart(2, '0'); }
function isoDate(date) { return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`; }
function nextMondayIso() {
  const d = new Date();
  const day = d.getDay();
  const add = ((8 - day) % 7) || 7;
  d.setDate(d.getDate() + add);
  return isoDate(d);
}

function defaultState() {
  const mode = 'standard';
  const settings = {
    startDate: nextMondayIso(),
    weeks: 1,
    mode,
    workoutTemplate: PROGRAMME_MODES[mode].workoutTemplate,
    dietTemplate: PROGRAMME_MODES[mode].dietTemplate,
    useCarryOver: true,
    allowHybrid: false,
    recoveryState: 'normal',
    cardioTemplate: 'fullBikeIntervalsSwim',
    mealVariety: 'balanced',
    batchStyle: 'twoPortions',
  };
  const rows = makeRows(settings.startDate, settings.weeks);
  return {
    settings,
    rows,
    previousContext: [],
    workoutStatus: {},
    mealStatus: {},
    partialReasons: {},
    report: { alcoholStatus: '', alcoholNote: '', subjectiveNote: '', illness: '', travel: '', workStress: '' },
    ui: {
      tab: 'dashboard',
      openWorkoutDate: '',
      collapsedDietDays: {},
      shoppingDates: rows.slice(0, 7).map((r) => r.date),
      shoppingChecked: {},
      hideChecked: false,
      generatedReport: '',
      compactCompleted: true,
    },
    notice: '',
  };
}

let state = loadState();
render();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return deepMerge(defaultState(), JSON.parse(saved));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return defaultState();
}
function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object') return base;
  const out = { ...base };
  Object.entries(patch).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value) && base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) out[key] = deepMerge(base[key], value);
    else out[key] = value;
  });
  return out;
}
function saveState(message = '') {
  if (message) state.notice = message;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function setState(mutator, message = '') {
  mutator(state);
  saveState(message);
  render();
}
function updateDraftState(mutator) {
  mutator(state);
  saveState();
}
function bindDraftText(selector, updater) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('input', (e) => updateDraftState((s) => updater(s, e)));
    el.addEventListener('blur', (e) => {
      const y = window.scrollY;
      updateDraftState((s) => updater(s, e));
      render();
      requestAnimationFrame(() => window.scrollTo(0, y));
    });
  });
}
function computed() {
  const options = {
    mode: state.settings.mode,
    allowHybrid: state.settings.allowHybrid,
    useCarryOver: state.settings.useCarryOver,
    previousContext: state.previousContext,
    recoveryState: state.settings.recoveryState,
  };
  const trainingPlan = generateTrainingPlan(state.rows, options);
  const dietPlan = generateDietPlan(state.rows, trainingPlan, state.settings);
  const shopping = buildShoppingList(dietPlan, state.mealStatus, state.ui.shoppingDates, state.ui.shoppingChecked);
  const validation = validateReport({ trainingPlan, dietPlan, workoutStatus: state.workoutStatus, mealStatus: state.mealStatus, partialReasons: state.partialReasons, alcoholStatus: state.report.alcoholStatus, subjectiveNote: state.report.subjectiveNote });
  const summary = reportSummary({ trainingPlan, dietPlan, workoutStatus: state.workoutStatus, mealStatus: state.mealStatus, partialReasons: state.partialReasons });
  const warnings = offPlanWarnings(dietPlan, state.mealStatus);
  const planWarnings = trainingPlan.flatMap((r) => r.warning ? [{ date: r.date, message: r.warning }] : []);
  return { trainingPlan, dietPlan, shopping, validation, summary, warnings, planWarnings };
}

function esc(value) { return String(value ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function selectedOption(value, option) { return value === option ? 'selected' : ''; }
function checked(value) { return value ? 'checked' : ''; }
function card(content, extra = '') { return `<div class="card ${extra}">${content}</div>`; }
function section(title, subtitle, body) { return `<section class="section"><div class="sectionHead"><div><div class="eyebrow">Transformation Engine</div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div></div>${body}</section>`; }
function selectHtml(value, options, dataAttr, placeholder = '') { return `<select ${dataAttr}>${options.map((option) => `<option value="${esc(option)}" ${selectedOption(value, option)}>${esc(option || placeholder)}</option>`).join('')}</select>`; }
function metric(label, value, sub) { return `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong><small>${esc(sub)}</small></div>`; }

function render() {
  const c = computed();
  const tabs = [['dashboard', 'Dashboard'], ['plan', 'Plan'], ['calendar', 'Calendar'], ['workouts', 'Workouts'], ['diet', 'Diet'], ['shopping', 'Shopping'], ['report', 'Report']];
  app.innerHTML = `
    <div class="appFrame">
      <header class="hero">
        <div>
          <div class="eyebrow">Post-Holiday Focus Build</div>
          <h1>Transformation Engine <span>v${VERSION}</span></h1>
          <p>Mobile-first training, diet, shopping and weekly reporting. Health metrics removed: use Samsung screenshots separately at Friday check-in.</p>
        </div>
        <div class="heroActions"><button data-action="save" class="secondary">Save</button><button data-action="reset" class="dangerGhost">Reset</button></div>
      </header>
      ${state.notice ? `<div class="notice">${esc(state.notice)}</div>` : ''}
      <main>${renderTab(c)}</main>
      <nav class="bottomNav">${tabs.map(([id, label]) => `<button class="${state.ui.tab === id ? 'active' : ''}" data-tab="${id}"><span>${label}</span></button>`).join('')}</nav>
    </div>`;
  bindGlobalEvents();
}
function renderTab(c) {
  if (state.ui.tab === 'dashboard') return renderDashboard(c);
  if (state.ui.tab === 'plan') return renderPlanTab(c);
  if (state.ui.tab === 'calendar') return renderCalendarTab(c);
  if (state.ui.tab === 'workouts') return renderWorkoutTab(c);
  if (state.ui.tab === 'diet') return renderDietTab(c);
  if (state.ui.tab === 'shopping') return renderShoppingTab(c);
  return renderReportTab(c);
}

function renderDashboard(c) {
  const mode = PROGRAMME_MODES[state.settings.mode];
  return section('Post-holiday focus dashboard', 'Clean working view: plan, execute, report. Samsung screenshots remain separate for sleep, energy, body composition and activity.', `
    <div class="dashboardHero">
      <div><span>Mode</span><strong>${esc(mode.label)}</strong><small>${esc(DIET_TEMPLATES[state.settings.dietTemplate])}</small></div>
      <div><span>Start</span><strong>${formatDate(state.settings.startDate)}</strong><small>${state.settings.weeks} week${state.settings.weeks > 1 ? 's' : ''} planned</small></div>
    </div>
    <div class="metricGrid">
      ${metric('Main lifts', `${c.summary.completedLifts}/${c.summary.plannedLifts}`, 'required sessions')}
      ${metric('Cardio/Swim', `${c.summary.completedCardio}/${c.summary.plannedCardio}`, CARDIO_SWIM_TEMPLATES[state.settings.cardioTemplate]?.label || 'structured')}
      ${metric('Optional hybrid', `${c.summary.completedHybrid}/${c.summary.plannedHybrid}`, state.settings.allowHybrid ? 'allowed if compatible' : 'off')}
      ${metric('Diet days', `${c.summary.fullDietDays} full`, `${c.summary.partialDietDays} partial / ${c.summary.flexibleDietDays} flexible`)}
      ${metric('Report fields', `${c.validation.blockers.length} blockers`, `${c.validation.flags.length} warnings`)}
      ${metric('Meal prep', state.settings.batchStyle === 'twoPortions' ? '2 portions' : state.settings.batchStyle, state.settings.mealVariety)}
    </div>
    ${card(`<h3>Monday restart default</h3><p>Standard mode, 4 lifts, one structured cardio/swim exposure, balanced meal variety and two-portion batch cooking. Tighten after Friday check-in rather than overcorrecting immediately after the holiday.</p>`, 'premium')}
    ${card(`<h3>Friday check-in model</h3><p>Use the app report for plan/execution/diet/variance. Attach Samsung screenshots separately for sleep, energy, body composition and activity.</p>`, 'infoCard')}
  `);
}

function renderPlanTab() {
  const mode = PROGRAMME_MODES[state.settings.mode];
  return section('Plan setup', 'Generate the week around rota, recovery, previous-week spacing, structured swim/cardio and optional Beast Mode hybrid work.', `
    ${card(`
      <div class="mobileForm">
        <label>Start date<input type="date" value="${state.settings.startDate}" data-plan="startDate" /></label>
        <label>Plan length<select data-plan="weeks">${[1,2,3,4].map((w) => `<option value="${w}" ${Number(state.settings.weeks) === w ? 'selected' : ''}>${w} week${w > 1 ? 's' : ''}</option>`).join('')}</select></label>
        <label>Programme mode<select data-plan="mode">${Object.entries(PROGRAMME_MODES).map(([key, val]) => `<option value="${key}" ${state.settings.mode === key ? 'selected' : ''}>${val.label}</option>`).join('')}</select></label>
        <label>Recovery state<select data-plan="recoveryState">${[['good','Good'],['normal','Normal'],['flat','Flat / low energy'],['postCall','Post-call / sleep disrupted']].map(([key, label]) => `<option value="${key}" ${selectedOption(state.settings.recoveryState, key)}>${label}</option>`).join('')}</select></label>
        <label>Workout template<select data-plan="workoutTemplate">${Object.entries(WORKOUT_TEMPLATES).map(([key, label]) => `<option value="${key}" ${state.settings.workoutTemplate === key ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
        <label>Diet template<select data-plan="dietTemplate">${Object.entries(DIET_TEMPLATES).map(([key, label]) => `<option value="${key}" ${state.settings.dietTemplate === key ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
        <label>Cardio/Swim template<select data-plan="cardioTemplate">${Object.entries(CARDIO_SWIM_TEMPLATES).map(([key, val]) => `<option value="${key}" ${state.settings.cardioTemplate === key ? 'selected' : ''}>${val.label}</option>`).join('')}</select></label>
        <label>Meal variety<select data-plan="mealVariety">${['maximum simplicity','balanced','higher variety'].map((v) => `<option value="${v}" ${selectedOption(state.settings.mealVariety, v)}>${v}</option>`).join('')}</select></label>
        <label>Batch style<select data-plan="batchStyle">${[['single','Single portions'],['twoPortions','Two portions at once'],['flexible','Flexible']].map(([key, label]) => `<option value="${key}" ${selectedOption(state.settings.batchStyle, key)}>${label}</option>`).join('')}</select></label>
      </div>
      <div class="toggleStack">
        <label><input type="checkbox" data-setting-check="useCarryOver" ${checked(state.settings.useCarryOver)} /> Use previous-week carry-over spacing</label>
        <label><input type="checkbox" data-setting-check="allowHybrid" ${checked(state.settings.allowHybrid)} /> Allow optional 5th Hybrid Upper Pump when compatible</label>
      </div>
      <div class="infoBox">Current mode maps to <strong>${WORKOUT_TEMPLATES[mode.workoutTemplate]}</strong> and <strong>${DIET_TEMPLATES[mode.dietTemplate]}</strong>. Cardio/swim is planned as a first-class session but sits below the four main lifts. Hybrid is optional and only added if spacing allows.</div>
      <div class="actions"><button data-action="generate-plan">Generate new plan</button><button data-action="capture-context" class="secondary">Save current week as carry-over context</button></div>
    `)}
  `);
}

function renderCalendarTab({ trainingPlan, dietPlan, warnings, planWarnings }) {
  const allWarnings = [...warnings.map((w) => w.message), ...planWarnings.map((w) => `${formatDate(w.date)}: ${w.message}`)];
  const warningHtml = allWarnings.length ? `<div class="warningPanel">${allWarnings.map((w) => `<p>${esc(w)}</p>`).join('')}</div>` : '';
  return section('Calendar', 'Phone-first cards. Tap a workout card to jump to its expanded workout.', `
    ${warningHtml}
    <div class="dayCards">${trainingPlan.map((row, i) => renderCalendarCard(row, dietPlan[i], i)).join('')}</div>
  `);
}
function renderCalendarCard(row, dietDay, i) {
  const partial = dietDay.noMeals ? 'No planned meals / untracked' : dietDay.isPartial ? `Partial: ${dietDay.nutrition.kcal} kcal / ${dietDay.nutrition.protein}g protein` : `${dietDay.nutrition.kcal} kcal / ${dietDay.nutrition.protein}g protein`;
  return `<article class="dayCard ${isPast(row.date) ? 'past' : ''}">
    <div class="dayTop"><div><strong>${formatDate(row.date)}</strong><small>${isPast(row.date) ? 'Locked history' : 'Live plan'}</small></div><button class="sessionPill ${statusClass(row.session)}" data-open-workout="${row.date}">${row.session}</button></div>
    <div class="mobileForm compact">
      <label>Date<input type="date" value="${row.date}" data-row="${i}" data-field="date" /></label>
      <label>Shift${selectHtml(row.shift, SHIFTS, `data-row="${i}" data-field="shift"`, 'Select shift')}</label>
      <label>Equipment${selectHtml(row.equipment, EQUIPMENT, `data-row="${i}" data-field="equipment"`, 'Select equipment')}</label>
      <label>Constraint${selectHtml(row.constraint, CONSTRAINTS, `data-row="${i}" data-field="constraint"`, 'None')}</label>
      <label>Meals${mealChooser(row, i)}</label>
    </div>
    <div class="tagRow"><span class="smallTag ${dietDay.isPartial || dietDay.noMeals ? 'warn' : 'ok'}">${esc(partial)}</span>${row.warning ? `<span class="smallTag warn">${esc(row.warning)}</span>` : ''}</div>
  </article>`;
}
function mealChooser(row, i) {
  const checks = MEAL_KEYS.map((key) => `<label class="miniCheck"><input type="checkbox" data-meal-toggle="${key}" data-row="${i}" ${checked(row.meals?.[key])} ${row.mealsMode === 'select' ? '' : 'disabled'} />${MEAL_LABELS[key]}</label>`).join('');
  return `<select data-row="${i}" data-field="mealsMode"><option value="full" ${selectedOption(row.mealsMode, 'full')}>Full diet plan</option><option value="select" ${selectedOption(row.mealsMode, 'select')}>Select meals</option><option value="none" ${selectedOption(row.mealsMode, 'none')}>No planned meals</option></select><div class="miniChecks">${checks}</div>`;
}

function renderWorkoutTab({ trainingPlan }) {
  const workouts = trainingPlan.filter((r) => r.session !== 'Rest / flexible');
  return section('Workouts', 'Expandable sections only. Cardio/swim is structured; optional hybrid does not count as failed if missed.', `<div class="panelStack">${workouts.map((row) => renderWorkoutPanel(row)).join('') || card('No workouts generated yet.')}</div>`);
}
function renderWorkoutPanel(row) {
  const open = state.ui.openWorkoutDate === row.date;
  const items = tailorWorkout(row.session, row.equipment, state.settings.workoutTemplate, state.settings.cardioTemplate);
  return `<details class="workoutPanel" ${open ? 'open' : ''} data-workout-date="${row.date}"><summary><span>${formatDate(row.date)} · ${row.session}</span><small>${row.session === 'Cardio/Swim' ? CARDIO_SWIM_TEMPLATES[state.settings.cardioTemplate]?.label : (row.equipment || 'No equipment selected')}</small></summary>${items.map((item) => `<div class="exercise"><div><strong>${esc(item.name)}</strong><p>${esc(item.notes)}</p></div><span>${esc(item.prescription)}</span></div>`).join('')}</details>`;
}

function renderDietTab({ dietPlan }) {
  const sorted = [...dietPlan].sort((a, b) => {
    const ac = state.ui.collapsedDietDays[a.date] ? 1 : 0;
    const bc = state.ui.collapsedDietDays[b.date] ? 1 : 0;
    if (ac !== bc) return ac - bc;
    const today = new Date().toISOString().slice(0, 10);
    if (a.date === today) return -1;
    if (b.date === today) return 1;
    return a.date.localeCompare(b.date);
  });
  return section('Diet plan', 'Expanded batchable meal library. Active days stay at the top; completed days collapse to reduce scrolling.', `<div class="dietGrid">${sorted.map((day) => renderDietDay(day)).join('')}</div>`);
}
function renderDietDay(day) {
  const collapsed = state.ui.collapsedDietDays[day.date];
  if (collapsed) return card(`<div class="collapsedDay"><strong>${formatDate(day.date)}</strong><span>${day.nutrition.kcal ? `${day.nutrition.kcal} kcal / ${day.nutrition.protein}g protein planned` : 'No generated meals'}</span><button data-uncollapse-day="${day.date}" class="secondary">Reopen</button></div>`, 'collapsed');
  return card(`
    <div class="cardTop"><div><h3>${formatDate(day.date)}</h3><p>${classifyDietDay(day, state.mealStatus, state.partialReasons[day.date] || '')}${day.templateName ? ' · ' + esc(day.templateName) : ''}</p></div><div class="macro">${day.noMeals ? 'Not tracked' : `${day.nutrition.kcal} kcal<br>${day.nutrition.protein}g protein`}</div></div>
    ${day.noMeals ? `<div class="infoBox">No meals generated for this day. It will need an explanation in the weekly report.</div>` : day.selectedMeals.map((key) => renderMeal(day, key)).join('')}
    <div class="actions"><button data-collapse-day="${day.date}" class="secondary">Mark day complete in diet view</button></div>
  `);
}
function renderMeal(day, key) {
  const mealId = day.meals[key];
  const meal = MEALS[mealId];
  const details = mealDetails(mealId).map((line) => `<li><strong>${esc(line.qtyText)}</strong> ${esc(line.label)} <span>${esc(line.guidance)}</span></li>`).join('');
  return `<div class="mealCard"><div class="mealHead"><strong>${MEAL_LABELS[key]} · ${esc(meal.name)}</strong></div><ul>${details}</ul></div>`;
}

function renderShoppingTab({ dietPlan, shopping }) {
  return section('Shopping list', 'Shop-friendly grouped cards with exact use and rounded buy quantities. Completed/off-plan/skipped meals are excluded.', `
    ${card(`<div class="actions wrap"><button data-action="shopping-week">Full week</button><button data-action="shopping-plan" class="secondary">Full plan</button><button data-action="shopping-clear" class="secondary">Clear</button><label class="inline"><input type="checkbox" data-action="shopping-hide" ${checked(state.ui.hideChecked)} /> Hide checked</label></div><div class="dateChips">${dietPlan.map((d) => `<label><input type="checkbox" data-shopping-date="${d.date}" ${checked(state.ui.shoppingDates.includes(d.date))} />${formatDate(d.date)}</label>`).join('')}</div>`)}
    ${card(`<div class="shoppingList">${shopping.filter((item) => !state.ui.hideChecked || !item.checked).map((item) => `<label class="shopItem"><input type="checkbox" data-shop-item="${item.id}" ${checked(item.checked)} /><div><strong>${esc(item.label)}</strong><span>${esc(item.amount)}</span><small>${esc(item.guidance)}</small></div></label>`).join('') || '<p>No shopping items for the selected dates/statuses.</p>'}</div>`)}
  `);
}

function renderReportTab(c) {
  return section('Weekly report', 'Manual fields are limited to context Samsung cannot know: diet, alcohol, illness, travel, work stress and subjective comments.', `
    ${renderValidation(c.validation)}
    ${card(renderSummary(c.summary), 'summaryCard')}
    ${card(renderWorkoutConfirmation(c.trainingPlan))}
    ${card(renderMealConfirmation(c.dietPlan))}
    ${card(renderReportMeta())}
    ${card(`<div class="actions"><button data-action="generate-report" ${c.validation.canGenerate ? '' : 'disabled'}>Generate weekly report</button><button data-action="copy-report" class="secondary">Copy report</button></div><textarea readonly class="reportBox">${esc(state.ui.generatedReport || buildReportText(c))}</textarea>`)}
  `);
}
function renderValidation(validation) {
  const block = validation.blockers.length ? `<div class="blocked"><strong>Report blocked until required fields are complete</strong>${validation.blockers.map((b) => `<p>${esc(b)}</p>`).join('')}</div>` : `<div class="okPanel"><strong>Report fields complete</strong><p>Warnings may still appear, but they do not block generation.</p></div>`;
  const flags = validation.flags.length ? `<div class="warningPanel"><strong>Warnings</strong>${validation.flags.map((f) => `<p>${esc(f)}</p>`).join('')}</div>` : '';
  return block + flags;
}
function renderSummary(s) {
  return `<h3>Weekly adherence summary</h3><div class="summaryGrid"><span>Main lifts <strong>${s.completedLifts}/${s.plannedLifts}</strong></span><span>Cardio/swim <strong>${s.completedCardio}/${s.plannedCardio}</strong></span><span>Optional hybrid <strong>${s.completedHybrid}/${s.plannedHybrid}</strong></span><span>Full diet days <strong>${s.fullDietDays}</strong></span><span>Partial days <strong>${s.partialDietDays}</strong></span><span>Flexible/off-plan <strong>${s.flexibleDietDays}</strong></span></div>`;
}
function renderWorkoutConfirmation(trainingPlan) {
  const rows = trainingPlan.filter((r) => r.session !== 'Rest / flexible');
  return `<h3>Workout completion</h3>${rows.map((row) => { const rec = state.workoutStatus[row.date] || { status: 'unconfirmed', note: '' }; const optional = row.session === 'Hybrid Upper Pump'; return `<div class="confirmCard"><div><strong>${formatDate(row.date)} · ${row.session}</strong><small>${optional ? 'Optional / not a blocker' : row.session === 'Cardio/Swim' ? CARDIO_SWIM_TEMPLATES[state.settings.cardioTemplate]?.label : row.equipment || ''}</small></div><select data-workout-status="${row.date}">${WORKOUT_STATUSES.map((s) => `<option value="${s}" ${selectedOption(rec.status, s)}>${s.replaceAll('_', ' ')}</option>`).join('')}</select><input placeholder="Note if useful / required" value="${esc(rec.note || '')}" data-workout-note="${row.date}" /></div>`; }).join('')}`;
}
function renderMealConfirmation(dietPlan) {
  return `<h3>Diet completion</h3>${dietPlan.map((day) => `<div class="reportDay"><div class="reportDayHead"><strong>${formatDate(day.date)}</strong><span>${classifyDietDay(day, state.mealStatus, state.partialReasons[day.date] || '')} · ${day.noMeals ? 'Not tracked' : `${day.nutrition.kcal} kcal / ${day.nutrition.protein}g protein`}</span></div>${day.isPartial || day.noMeals ? `<input class="full" placeholder="Required explanation for partial/untracked day" value="${esc(state.partialReasons[day.date] || '')}" data-partial-reason="${day.date}" />` : ''}${day.selectedMeals.map((key) => renderMealConfirmRow(day, key)).join('')}</div>`).join('')}`;
}
function renderMealConfirmRow(day, key) {
  const id = `${day.date}:${key}`;
  const rec = state.mealStatus[id] || { status: 'unconfirmed', note: '' };
  return `<div class="confirmCard mealConfirm"><div><strong>${MEAL_LABELS[key]}</strong><small>${MEALS[day.meals[key]]?.name || ''}</small></div><select data-meal-status="${id}">${MEAL_STATUSES.map((s) => `<option value="${s}" ${selectedOption(rec.status, s)}>${s.replaceAll('_', ' ')}</option>`).join('')}</select><input placeholder="Required if off-plan/skipped" value="${esc(rec.note || '')}" data-meal-note="${id}" /></div>`;
}
function renderReportMeta() {
  return `<h3>Manual context</h3><div class="mobileForm"><label>Alcohol status${selectHtml(state.report.alcoholStatus, ALCOHOL_STATUSES, 'data-report="alcoholStatus"', 'Select alcohol status')}</label><label>Work stress<input value="${esc(state.report.workStress || '')}" data-report="workStress" placeholder="low / moderate / high / extreme" /></label><label>Illness<input value="${esc(state.report.illness || '')}" data-report="illness" placeholder="none / symptoms / injury" /></label><label>Travel/social<input value="${esc(state.report.travel || '')}" data-report="travel" placeholder="none / planned / significant" /></label></div><label>Alcohol note<textarea data-report="alcoholNote" placeholder="Optional note">${esc(state.report.alcoholNote || '')}</textarea></label><label>Subjective physique/performance note<textarea data-report="subjectiveNote" placeholder="Felt leaner, puffy, strong, flat, hungry, stressed, etc.">${esc(state.report.subjectiveNote || '')}</textarea></label>`;
}

function buildReportText(c) {
  const s = c.summary;
  const settings = state.settings;
  const lines = [];
  lines.push('TRANSFORMATION ENGINE V3.1 WEEKLY REPORT FOR CHATGPT');
  lines.push('');
  lines.push('PROGRAMME SETTINGS');
  lines.push(`Programme mode: ${PROGRAMME_MODES[settings.mode].label}`);
  lines.push(`Workout template: ${WORKOUT_TEMPLATES[settings.workoutTemplate]}`);
  lines.push(`Diet template: ${DIET_TEMPLATES[settings.dietTemplate]}`);
  lines.push(`Cardio/swim template: ${CARDIO_SWIM_TEMPLATES[settings.cardioTemplate]?.label || settings.cardioTemplate}`);
  lines.push(`Meal variety: ${settings.mealVariety}; batch style: ${settings.batchStyle}`);
  lines.push(`Recovery state selected: ${settings.recoveryState}`);
  lines.push(`Previous-week context used: ${settings.useCarryOver ? 'yes' : 'no'}`);
  lines.push(`Optional hybrid allowed: ${settings.allowHybrid ? 'yes' : 'no'}`);
  lines.push(`Start date: ${settings.startDate}`);
  lines.push(`Plan length: ${settings.weeks} week(s)`);
  lines.push('');
  lines.push('WEEKLY ADHERENCE SUMMARY');
  lines.push(`Planned main lifting sessions: ${s.completedLifts}/${s.plannedLifts} completed`);
  lines.push(`Optional Hybrid Upper Pump: ${s.completedHybrid}/${s.plannedHybrid} completed`);
  lines.push(`Cardio/swim: ${s.completedCardio}/${s.plannedCardio} completed`);
  lines.push(`Diet days fully completed: ${s.fullDietDays}/${c.dietPlan.length}`);
  lines.push(`Partial diet days: ${s.partialDietDays}/${c.dietPlan.length}`);
  lines.push(`Flexible/off-plan days: ${s.flexibleDietDays}/${c.dietPlan.length}`);
  lines.push(`No-meal/untracked days: ${s.noMealDays}/${c.dietPlan.length}`);
  lines.push(`Alcohol status: ${state.report.alcoholStatus}${state.report.alcoholNote ? ' | note: ' + state.report.alcoholNote : ''}`);
  lines.push(`Work stress: ${state.report.workStress || 'not logged'} | Illness: ${state.report.illness || 'not logged'} | Travel/social: ${state.report.travel || 'not logged'}`);
  lines.push(`Subjective note: ${state.report.subjectiveNote}`);
  lines.push('');
  lines.push('PLANNED CALENDAR');
  c.trainingPlan.forEach((r) => lines.push(`${formatDate(r.date)} | ${r.shift || 'Blank/free'} | ${r.equipment || 'No equipment selected'} | ${r.constraint || 'No constraint'} | ${r.session}${r.warning ? ' | warning: ' + r.warning : ''}`));
  lines.push('');
  lines.push('WORKOUT COMPLETION');
  c.trainingPlan.filter((r) => r.session !== 'Rest / flexible').forEach((r) => { const rec = state.workoutStatus[r.date] || {}; lines.push(`${formatDate(r.date)} | ${r.session} | ${rec.status || 'unconfirmed'}${rec.note ? ' | note: ' + rec.note : ''}`); });
  lines.push('');
  lines.push('DIET COMPLETION');
  c.dietPlan.forEach((d) => { lines.push(`${formatDate(d.date)} | ${classifyDietDay(d, state.mealStatus, state.partialReasons[d.date] || '')}${d.templateName ? ' | template: ' + d.templateName : ''} | ${d.noMeals ? 'not tracked' : `${d.nutrition.kcal} kcal / ${d.nutrition.protein}g protein planned`}${state.partialReasons[d.date] ? ' | explanation: ' + state.partialReasons[d.date] : ''}`); d.selectedMeals.forEach((key) => { const rec = state.mealStatus[`${d.date}:${key}`] || {}; lines.push(`  - ${MEAL_LABELS[key]}: ${MEALS[d.meals[key]]?.name || ''} | ${rec.status || 'unconfirmed'}${rec.note ? ' | note: ' + rec.note : ''}`); }); });
  lines.push('');
  lines.push('VALIDATION FLAGS');
  if (c.validation.flags.length) c.validation.flags.forEach((f) => lines.push(`- ${f}`)); else lines.push('No validation flags.');
  lines.push('');
  lines.push('INTERPRETATION REQUEST');
  lines.push('- Interpret this report alongside Samsung screenshots for sleep, energy, body composition and activity.');
  lines.push('- Recommend next week mode from app adherence + screenshots + rota constraints.');
  lines.push('- Decide whether optional Hybrid Upper Pump is appropriate next week.');
  return lines.join('\n');
}

function statusClass(session) { if (session === 'Rest / flexible') return 'rest'; if (session === 'Cardio/Swim') return 'cardio'; if (session === 'Lower + Core') return 'lower'; if (session === 'Hybrid Upper Pump') return 'hybrid'; return 'upper'; }
function captureContext(trainingPlan = computed().trainingPlan) {
  return trainingPlan.filter((r) => r.session !== 'Rest / flexible').slice(-7).map((r) => ({ date: r.date, session: r.session }));
}

function bindGlobalEvents() {
  document.querySelectorAll('[data-tab]').forEach((btn) => btn.addEventListener('click', () => setState((s) => { s.ui.tab = btn.dataset.tab; })));
  document.querySelector('[data-action="save"]')?.addEventListener('click', () => setState(() => {}, 'Saved locally.'));
  document.querySelector('[data-action="reset"]')?.addEventListener('click', () => { if (confirm('Reset the local v3.1 app state?')) { state = defaultState(); saveState('Reset complete.'); render(); } });
  document.querySelectorAll('[data-plan]').forEach((input) => input.addEventListener('change', (e) => setState((s) => {
    const field = e.target.dataset.plan;
    s.settings[field] = field === 'weeks' ? Number(e.target.value) : e.target.value;
    if (field === 'mode') {
      s.settings.workoutTemplate = PROGRAMME_MODES[e.target.value].workoutTemplate;
      s.settings.dietTemplate = PROGRAMME_MODES[e.target.value].dietTemplate;
      s.settings.allowHybrid = e.target.value === 'beast';
      if (e.target.value === 'recovery') s.settings.cardioTemplate = 'recoveryZone2';
      if (e.target.value === 'standard') s.settings.cardioTemplate = 'fullBikeIntervalsSwim';
      if (e.target.value === 'beast') s.settings.cardioTemplate = 'structuredSwim';
    }
  })));
  document.querySelectorAll('[data-setting-check]').forEach((input) => input.addEventListener('change', (e) => setState((s) => { s.settings[e.target.dataset.settingCheck] = e.target.checked; })));
  document.querySelector('[data-action="capture-context"]')?.addEventListener('click', () => setState((s) => { s.previousContext = captureContext(computed().trainingPlan); }, 'Current plan saved as previous-week carry-over context.'));
  document.querySelector('[data-action="generate-plan"]')?.addEventListener('click', () => setState((s) => { const oldPlan = computed().trainingPlan; if (s.settings.useCarryOver) s.previousContext = captureContext(oldPlan); s.rows = makeRows(s.settings.startDate, s.settings.weeks); s.workoutStatus = {}; s.mealStatus = {}; s.partialReasons = {}; s.ui.shoppingDates = s.rows.slice(0, 7).map((r) => r.date); s.ui.collapsedDietDays = {}; s.ui.generatedReport = ''; }, 'New v3.1 plan generated.'));
  document.querySelectorAll('[data-row][data-field]').forEach((el) => el.addEventListener('change', (e) => setState((s) => { const i = Number(e.target.dataset.row); const field = e.target.dataset.field; s.rows[i][field] = e.target.value; if (field === 'mealsMode' && e.target.value === 'full') s.rows[i].meals = { breakfast: true, lunch: true, snack: true, dinner: true }; })));
  document.querySelectorAll('[data-meal-toggle]').forEach((el) => el.addEventListener('change', (e) => setState((s) => { const i = Number(e.target.dataset.row); const key = e.target.dataset.mealToggle; s.rows[i].meals[key] = e.target.checked; })));
  document.querySelectorAll('[data-open-workout]').forEach((el) => el.addEventListener('click', (e) => setState((s) => { s.ui.tab = 'workouts'; s.ui.openWorkoutDate = e.currentTarget.dataset.openWorkout; })));
  document.querySelectorAll('[data-collapse-day]').forEach((el) => el.addEventListener('click', (e) => setState((s) => { s.ui.collapsedDietDays[e.target.dataset.collapseDay] = true; })));
  document.querySelectorAll('[data-uncollapse-day]').forEach((el) => el.addEventListener('click', (e) => setState((s) => { delete s.ui.collapsedDietDays[e.target.dataset.uncollapseDay]; })));
  document.querySelectorAll('[data-shopping-date]').forEach((el) => el.addEventListener('change', (e) => setState((s) => { const date = e.target.dataset.shoppingDate; if (e.target.checked) s.ui.shoppingDates = [...new Set([...s.ui.shoppingDates, date])]; else s.ui.shoppingDates = s.ui.shoppingDates.filter((d) => d !== date); })));
  document.querySelector('[data-action="shopping-week"]')?.addEventListener('click', () => setState((s) => { s.ui.shoppingDates = s.rows.slice(0, 7).map((r) => r.date); }));
  document.querySelector('[data-action="shopping-plan"]')?.addEventListener('click', () => setState((s) => { s.ui.shoppingDates = s.rows.map((r) => r.date); }));
  document.querySelector('[data-action="shopping-clear"]')?.addEventListener('click', () => setState((s) => { s.ui.shoppingDates = []; }));
  document.querySelector('[data-action="shopping-hide"]')?.addEventListener('change', (e) => setState((s) => { s.ui.hideChecked = e.target.checked; }));
  document.querySelectorAll('[data-shop-item]').forEach((el) => el.addEventListener('change', (e) => setState((s) => { s.ui.shoppingChecked[e.target.dataset.shopItem] = e.target.checked; })));
  document.querySelectorAll('[data-workout-status]').forEach((el) => el.addEventListener('change', (e) => setState((s) => { const date = e.target.dataset.workoutStatus; s.workoutStatus[date] = { ...(s.workoutStatus[date] || {}), status: e.target.value }; })));
  bindDraftText('[data-workout-note]', (s, e) => { const date = e.target.dataset.workoutNote; s.workoutStatus[date] = { ...(s.workoutStatus[date] || { status: 'unconfirmed' }), note: e.target.value }; });
  document.querySelectorAll('[data-meal-status]').forEach((el) => el.addEventListener('change', (e) => setState((s) => { const id = e.target.dataset.mealStatus; s.mealStatus[id] = { ...(s.mealStatus[id] || {}), status: e.target.value }; })));
  bindDraftText('[data-meal-note]', (s, e) => { const id = e.target.dataset.mealNote; s.mealStatus[id] = { ...(s.mealStatus[id] || { status: 'unconfirmed' }), note: e.target.value }; });
  bindDraftText('[data-partial-reason]', (s, e) => { s.partialReasons[e.target.dataset.partialReason] = e.target.value; });
  document.querySelectorAll('[data-report]').forEach((el) => {
    if (el.tagName === 'SELECT') el.addEventListener('change', (e) => setState((s) => { s.report[e.target.dataset.report] = e.target.value; }));
    else bindDraftText(`[data-report="${el.dataset.report}"]`, (s, e) => { s.report[e.target.dataset.report] = e.target.value; });
  });
  document.querySelector('[data-action="generate-report"]')?.addEventListener('click', () => setState((s) => { s.ui.generatedReport = buildReportText(computed()); }, 'Weekly report generated.'));
  document.querySelector('[data-action="copy-report"]')?.addEventListener('click', () => { const text = state.ui.generatedReport || buildReportText(computed()); navigator.clipboard?.writeText(text); setState((s) => { s.notice = 'Weekly report copied.'; }); });
}
