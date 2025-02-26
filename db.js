  const { Pool } = require('pg');

  // Configurações do PostgreSQL
  const pool = new Pool({
    user: 'admin2369',  // Nome de usuário do PostgreSQL
    host: 'bancopse.ctqw2eiyumvh.us-east-2.rds.amazonaws.com',  // Endpoint do RDS (substitua pelo correto)
    database: 'postgres',  // Nome do banco de dados
    password: '23692369Do',  // Sua senha do PostgreSQL
    port: 5432,  // Porta padrão do PostgreSQL
    ssl: {
      rejectUnauthorized: false,  // Ativando SSL, ignorando a verificação do certificado
    }
  });

  module.exports = pool;
