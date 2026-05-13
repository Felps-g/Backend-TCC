const supabase = require('../supabase');

exports.criar = async (req, res) => {
  try {
    const { placar, time_oponente, vitoria } = req.body;
    const user_id = req.user.id;

    if (!placar || !time_oponente || vitoria === undefined) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('jogos')
      .insert([{ user_id, placar, time_oponente, vitoria }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from('jogos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (error || !data) return res.status(404).json({ erro: 'Jogo não encontrado.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { placar, time_oponente, vitoria } = req.body;

    const { data, error } = await supabase
      .from('jogos')
      .update({ placar, time_oponente, vitoria })
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error || !data) return res.status(400).json({ erro: 'Erro ao atualizar ou jogo não encontrado.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const { error } = await supabase
      .from('jogos')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};