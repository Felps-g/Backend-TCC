//RANKING SERVICE
async function getTopPlayersByEfficiency(limit) {} //pega os jogadores com maior eficiência, onde limit é o número máximo de jogadores a serem retornados
async function getTopPlayersByAveragePoints(limit) {} //pega os jogadores com maior média de pontos, onde limit é o número máximo de jogadores a serem retornados

async function getTopPlayersByPoints(limit = 5) {//pega os jogadores com mais pontos, onde limit é o número máximo de jogadores a serem retornados
    
    const { data, error } = await supabase
    .from('player_set_stats')
    .select(`
      player_id,
      attacks,
      aces,
      blocks,
      error_attack,
      error_pass,
      error_set,
      error_serve,
      players(name)
    `);

  if (error) throw new Error(error.message);

  const playersMap = {};

  data.forEach((row) => {
    const playerId = row.player_id;

    if (!playersMap[playerId]) {
      playersMap[playerId] = {
        playerId,
        name: row.players?.name,
        hits: 0,
        errors: 0
      };
    }

    // soma acertos
    const hits =
      (row.attacks || 0) +
      (row.aces || 0) +
      (row.blocks || 0);

    // soma erros
    const errors =
      (row.error_attack || 0) +
      (row.error_pass || 0) +
      (row.error_set || 0) +
      (row.error_serve || 0);

    playersMap[playerId].hits += hits;
    playersMap[playerId].errors += errors;
  });

  // Calcula eficiência final
  const result = Object.values(playersMap).map((player) => {
    const total = player.hits + player.errors;

    return {
      playerId: player.playerId,
      name: player.name,
      efficiency: total === 0 ? 0 : (player.hits / total) * 100,
      hits: player.hits,
      errors: player.errors
    };
  });

  // Ordena pela eficiência
  return result
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, limit);
}
async function getTopPlayersByErrors(limit = 5) {} //pega os jogadores com mais erros, onde limit é o número máximo de jogadores a serem retornados