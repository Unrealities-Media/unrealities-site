// Interpret the source rubric without inventing a review or a viewing recommendation.
function temporalRole(movie) {
  const raw = movie.TT_Score;
  if (raw === '' || raw == null || !Number.isInteger(Number(raw)) || Number(raw)<0 || Number(raw)>10) return 'The role of time travel has not yet been assessed.';
  const score = Number(raw);
  const role = score === 0 ? 'No established temporal element in the identified film.' : score === 1 ? 'A brief temporal moment, cameo or sequel setup.' : score === 2 ? 'Limited time travel with a consequential outcome.' : score <= 4 ? 'Time travel supports the story or a substantial sequence.' : score <= 6 ? 'Time travel is an important premise, with limited sustained exploration.' : score <= 8 ? 'Time travel drives much of the story.' : 'Temporal events and their consequences run throughout the story.';
  return role + (movie.TT_Confidence === 'high' ? '' : ' This assessment is provisional.');
}
function catalogMeaning(movie) {
  return ({included:'Meets the archive’s time-travel criteria.',questionable:'A borderline case: the temporal interpretation remains disputed.',excluded:'Kept to explain the boundary of the genre; it is not included in the core time-travel catalog.'})[movie.Catalog_Status] || 'Catalog eligibility has not yet been settled.';
}
module.exports = { temporalRole, catalogMeaning };
