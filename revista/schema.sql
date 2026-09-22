-- Esquema do D1. Aplicar com:
--   npx wrangler d1 execute ensaio-aberto --local --file=./schema.sql
--   npx wrangler d1 execute ensaio-aberto --remote --file=./schema.sql

-- Votos de calibragem: uma linha por (edição, nível, resposta), com o total
-- acumulado. Contar por linha agregada, em vez de gravar um voto por linha,
-- deixa o incremento ser um UPDATE atômico e dispensa qualquer leitura prévia.
CREATE TABLE IF NOT EXISTS calibragem (
  slug     TEXT    NOT NULL,
  nivel    TEXT    NOT NULL,
  resposta TEXT    NOT NULL,
  total    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, nivel, resposta)
);

-- Inscritos da edição diária. O e-mail é a chave primária, então
-- ON CONFLICT DO NOTHING resolve reinscrição sem consulta extra.
CREATE TABLE IF NOT EXISTS inscritos (
  email     TEXT PRIMARY KEY,
  criado_em TEXT NOT NULL
);
