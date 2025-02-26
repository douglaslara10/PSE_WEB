// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Importa a conexão com o banco de dados


// Cria a aplicação Express
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Teste de conexão com o banco de dados
pool.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    process.exit(1); // Encerra o servidor se não conseguir conectar ao banco
  } else {
    console.log('Conectado ao banco de dados PostgreSQL com sucesso!');
  }
});

// Importar as rotas
const usuariosRoutes = require('./routes/usuariosRoutes');
const composicoesRoutes = require('./routes/composicoesRoutes');
const localizacoesRoutes = require('./routes/localizacoesRoutes');
const veiculosRoutes = require('./routes/veiculosRoutes');
const colaboradoresRoutes = require('./routes/colaboradoresRoutes');
const portariaRoutes = require('./routes/portariaRoutes');
const checklaudoRoutes = require('./routes/checklaudoRoutes');
const vencimentoRoutes = require('./routes/vencimentoRoutes'); // Corrigido para 'vencimentoRoutes' (sem 's')
const checklaudoepiRoutes = require('./routes/checklaudoepiRoutes');

// Usar as rotas
app.use('/usuarios', usuariosRoutes);
app.use('/composicoes', composicoesRoutes);
app.use('/localizacoes', localizacoesRoutes);
app.use('/veiculos', veiculosRoutes);
app.use('/colaboradores', colaboradoresRoutes);
app.use('/portaria', portariaRoutes);
app.use('/checklaudos', checklaudoRoutes);
app.use('/vencimentos', vencimentoRoutes); 
app.use('/checklaudoepi', checklaudoepiRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('API está rodando!');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
