//exemplo de json que o scout deve gerar
// {
//   "set": 1,
//   "atleta_id": "uuid-do-atleta",
//   "stats": {
//     "saque": { "tentativas": 10, "pontos": 2, "erros": 1 },
//     "ataque": { "tentativas": 15, "pontos": 8, "erros": 3 },
//     "bloqueio": { "tentativas": 5, "pontos": 2 },
//     "defesa": 8,
//     "recepcao": { "perfeitas": 5, "positivas": 3, "erros": 1 }
//   }
//
const supabase = require('../supabase');

// Adiciona ou atualiza o scout de um atleta em um set de um jogo
exports.salvarScout = async (req, res) => {
  try {
    const { jogo_id } = req.params;
    const user_id = req.user.id;

    // Verifica se o jogo pertence ao usuário
    const { data: jogo, error: jogoError } = await supabase
      .from('jogos')
      .select('id')
      .eq('id', jogo_id)
      .eq('user_id', user_id)
      .single();

    if (jogoError || !jogo) return res.status(404).json({ erro: 'Jogo não encontrado.' });

    const { set, atleta_id, stats } = req.body;
    if (!set || !atleta_id || !stats) {
      return res.status(400).json({ erro: 'Set, atleta_id e stats são obrigatórios.' });
    }

    // Upsert: se já existir (mesmo jogo, set e atleta), atualiza; senão insere
    const { data, error } = await supabase
      .from('scout_entries')
      .upsert(
        {
          jogo_id,
          set,
          atleta_id,
          stats,
          user_id // opcional para controle
        },
        { onConflict: 'jogo_id, set, atleta_id' }
      )
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Retorna todo o scout de um jogo (todos os sets/atletas)
exports.buscarScoutJogo = async (req, res) => {
  try {
    const { jogo_id } = req.params;
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from('scout_entries')
      .select('*')
      .eq('jogo_id', jogo_id)
      .eq('user_id', user_id);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Deleta um registro de scout específico
exports.deletarScout = async (req, res) => {
  try {
    const { scout_id } = req.params;
    const user_id = req.user.id;

    const { error } = await supabase
      .from('scout_entries')
      .delete()
      .eq('id', scout_id)
      .eq('user_id', user_id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};