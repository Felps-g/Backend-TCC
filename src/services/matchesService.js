async function createMatch(data){} //cria uma nova partida
async function getAllMatches(){} //pega todas as partidas
async function getMatchById(id){} //pega uma partida pelo ID
async function createMatchSets(matchId, sets){} //cria os sets de uma partida, onde matchId é o ID da partida e sets é um array de objetos com as informações dos sets (setNumber, teamAScore, teamBScore)
async function getMatchSets(matchId){} //pega os sets de uma partida pelo ID da partida
async function updateMatchSet(matchId, setNumber, teamAScore, teamBScore){} //atualiza o placar de um set específico de uma partida, onde matchId é o ID da partida, setNumber é o número do set a ser atualizado, teamAScore é o novo placar do time A e teamBScore é o novo placar do time B