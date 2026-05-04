//CREATE
async function registerPlayerSetStats(data) {} //registra as estatísticas de um jogador em uma partida, onde data é um objeto com as informações do jogador, partida e estatísticas (playerId, matchId, points, errors, etc.)

//READ PLAYER STATS
async function getPlayerSetStats(playerId, setId) {} //pega as estatísticas de um jogador em uma partida pelo ID do jogador e ID da partida
async function getPlayerAveragePoints(playerId) {} //calcula a média de pontos de um jogador em todas as partidas
async function getPlayerAveragePointsLastX(playerId, x) {} //calcula a média de pontos de um jogador nas últimas X partidas
async function getPlayerEfficiency(playerId) {} //calcula a eficiência de um jogador
async function getPlayerEfficiencyLastX(playerId, x) { //calcula a eficiência de um jogador nas últimas X partidas
    // 1. pegar últimos X matches desse jogador
  const { data: matchesData, error: matchError } = await supabase
    .from('player_set_stats')
    .select('match_id')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false });

  if (matchError) throw new Error(matchError.message);

  const uniqueMatches = [
    ...new Set(matchesData.map((m) => m.match_id))
  ].slice(0, x);

  // 2. pegar stats desses matches
  const { data, error } = await supabase
    .from('player_set_stats')
    .select(`
      attacks,
      aces,
      blocks,
      error_attack,
      error_pass,
      error_set,
      error_serve
    `)
    .eq('player_id', playerId)
    .in('match_id', uniqueMatches);

  if (error) throw new Error(error.message);

  let hits = 0;
  let errors = 0;

  data.forEach((row) => {
    hits +=
      (row.attacks || 0) +
      (row.aces || 0) +
      (row.blocks || 0);

    errors +=
      (row.error_attack || 0) +
      (row.error_pass || 0) +
      (row.error_set || 0) +
      (row.error_serve || 0);
  });

  const total = hits + errors;

  return {
    playerId,
    matchesAnalyzed: uniqueMatches.length,
    efficiency: total === 0 ? 0 : (hits / total) * 100,
    hits,
    errors
  };
}

//READ MATCH STATS
async function getMatchPerformanceBySet(matchId){ //pega o desempenho de uma partida por set, onde matchId é o ID da partida
      const { data, error } = await supabase
    .from('player_set_stats')
    .select(`
      set_id,
      attacks,
      aces,
      blocks,
      error_attack,
      error_pass,
      error_set,
      error_serve,
      match_sets(set_number)
    `)
    .eq('match_id', matchId);

  if (error) throw new Error(error.message);

  const grouped = {};

  data.forEach((row) => {
    const setId = row.set_id;

    if (!grouped[setId]) {
      grouped[setId] = {
        setNumber: row.match_sets?.set_number,
        hits: 0,
        errors: 0
      };
    }

    const hits =
      (row.attacks || 0) +
      (row.aces || 0) +
      (row.blocks || 0);

    const errors =
      (row.error_attack || 0) +
      (row.error_pass || 0) +
      (row.error_set || 0) +
      (row.error_serve || 0);

    grouped[setId].hits += hits;
    grouped[setId].errors += errors;
  });

  return Object.values(grouped).map((set) => {
    const total = set.hits + set.errors;

    return {
      set: set.setNumber,
      efficiency: total === 0 ? 0 : (set.hits / total) * 100,
      hits: set.hits,
      errors: set.errors
    };
  });
}
async function getMatchPointsAverage(matchId) {} //calcula a média de pontos de uma partida
async function getMatchErrorsByFundament(matchId) {} //pega os erros de uma partida por fundamento

//READ SET STATS
async function getSetStats(setId) {} //pega as estatísticas de um set pelo ID do set
async function getSetEfficiency(setId) {} //calcula a eficiência de um set
async function getSetErrorsByFundament(setId){ // pega os erros por set por fundamento, onde setId é o ID do set       
    const { data, error } = await supabase 
            .from('player_set_stats')
            .select(`
                error_attack,
                error_pass,
                error_set,
                error_serve
            `)
            .eq('set_id', setId);

        if (error) throw new Error(error.message);

        const result = data.reduce(
            (acc, row) => {
                acc.error_attack += row.error_attack || 0;
                acc.error_pass += row.error_pass || 0;
                acc.error_set += row.error_set || 0;
                acc.error_serve += row.error_serve || 0;
                return acc;
            },
            {
                error_attack: 0,
                error_pass: 0,
                error_set: 0,
                error_serve: 0
            }
        );

  return result;
    }
//READ PLAYER + MATCH STATS
async function getPlayerErrorsByFundament(playerId, matchId) {} //pega os erros de um jogador em uma partida por fundamento

//READ TEAM STATS
async function getTeamPointsAverageLastX(teamId, x) {} //calcula a média de pontos de um time nas últimas X partidas
async function getTeamEfficiencyLastX(teamId, x) {} //calcula a eficiência de um time nas últimas X partidas

