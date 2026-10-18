// Быстрая проверка движка: node tools/test_engine.js
const vm = require('vm'), fs = require('fs'), path = require('path');
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
for (const f of ['js/data.generated.js', 'js/engine.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), ctx);
const A = ctx.Azza;
const show = (r) => r.primary.concat(r.others).map((p) => [p.wine.name, +p.food.toFixed(2), p.occ, +p.total.toFixed(1), p.badge]);
console.log('Италия/красное/стейк/10-40:', show(A.engine.recommend({ occasion: 'dinner', dish: 'red_meat', color: 'red', country: 'italy', budget: [10, 40] })));
const g = A.engine.recommend({ occasion: 'dinner', dish: 'red_meat', color: 'red', country: 'georgia', budget: [10, 40] });
console.log('Грузия found=', g.found, show(g));
console.log('hints red_meat', A.engine.colorHints('red_meat'), 'seafood', A.engine.colorHints('seafood'), 'any', A.engine.colorHints('any'));
console.log('pairings', A.engine.topPairings(A.engine.byId('ponte-merlot')));
console.log('поиск «мерло»', A.engine.catalog('мерло').map((w) => w.name), '«Мальбек»', A.engine.catalog('Мальбек').length);
