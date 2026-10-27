const {test} = require('node:test');
const assert = require('node:assert/strict');
const {card,detail,number} = require('./movie-pages.cjs');
const {temporalRole,catalogMeaning} = require('./film-insight.cjs');
const movie = {id:'film',Title:'A <film>',Year:'2000',Director:'Director',TT_Score:'0',TT_Confidence:'low',_Titan:'',Catalog_Status:'included',releases:[]};
test('interpretation follows the significance rubric without treating a missing score as zero',()=>{
  assert.match(temporalRole({...movie,TT_Score:''}),/not yet been assessed/);
  assert.match(temporalRole(movie),/No established temporal element/);
  assert.match(temporalRole({...movie,TT_Score:'7',TT_Confidence:'high'}),/drives much/);
  assert.match(temporalRole({...movie,TT_Score:'10'}),/provisional/);
  assert.match(catalogMeaning({...movie,Catalog_Status:'excluded'}),/not included/);
});
test('missing scores remain distinct from genuine zero, with provisional labels',()=>{
  assert.equal(number(''),null);assert.equal(number('0'),0);assert.equal(number('NaN'),null);
  const html=card(movie);
  assert.match(html,/<strong>Unscored<\/strong>/);
  assert.match(html,/<strong>0\/10<\/strong>/);
  assert.match(html,/Provisional weighting/);
  assert.match(html,/A &lt;film&gt;/);
});
test('film guide escapes metadata, filters unsafe research links and explains missing releases',()=>{
  const html=detail({...movie,Catalog_Rationale:'<script>alert(1)</script>',Catalog_Sources:'["javascript:alert(1)","https://example.org/research"]'});
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('href="javascript:'));
  assert.match(html,/https:\/\/example.org\/research/);
  assert.match(html,/No release editions are cataloged/);
  assert.match(html,/not a score out of 100/);
});
test('release details and partial Titan inputs appear in the dedicated guide',()=>{
  const html=detail({...movie,_Titan:'80.5',Titan_Data_Status:'partial',releases:[{title:'Example UHD',format:'4K UHD',url:'https://example.org/release',region:'Region free',studio:'Example studio'}]});
  assert.match(html,/Partial inputs/);assert.match(html,/Example UHD/);assert.match(html,/Region free/);assert.match(html,/Example studio/);
});
