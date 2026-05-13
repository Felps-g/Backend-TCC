const supabase = require('../supabase');

exports.criar = async (req, res) => {
  try {
    const { nome, numero_camisa, cpf, altura, posicao } = req.body;
    const user_id = req.user.id;

    // Validação simples
    if (!nome || !numero_camisa || !cpf || !altura || !posicao) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const { data, error } = await supabase
      .from('atletas')
      .insert([{ user_id, nome, numero_camisa, cpf, altura, posicao }])
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
      .from('atletas')
      .select('*')
      .eq('user_id', user_id);

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
      .from('atletas')
      .select('*')
      .eq('id', id)
      .eq('user_id', user_id)
      .single();

    if (error || !data) return res.status(404).json({ erro: 'Atleta não encontrado.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { nome, numero_camisa, cpf, altura, posicao } = req.body;

    const { data, error } = await supabase
      .from('atletas')
      .update({ nome, numero_camisa, cpf, altura, posicao })
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error || !data) return res.status(400).json({ erro: 'Erro ao atualizar ou permissão negada.' });
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
      .from('atletas')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};