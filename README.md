# IA Mail Assist — Automação Inteligente de E-mails

> Sistema empresarial de interpretação e resposta automatizada de e-mails corporativos utilizando Inteligência Artificial Generativa com o modelo **Google Gemini 3.8 Flash** e arquitetura Human-in-the-Loop (aprovação humana prévia).

---

## 📌 1. Visão Geral do Projeto

O **IA Mail Assist** foi desenvolvido para solucionar a sobrecarga de caixas de entrada empresariais em canais de atendimento, vendas, suporte técnico e acompanhamento de pedidos. 

O sistema analisa o contexto da mensagem, identifica a real intenção do remetente e redige respostas profissionais, empáticas e personalizadas em português brasileiro. 

### 🛡️ Princípio Ético e Segurança (Human-in-the-Loop)
- **Não há envio automático sem validação:** Todas as mensagens geradas permanecem em status de rascunho com o rótulo "Aguardando revisão".
- **Anti-Alucinação Estrita:** A IA é instruída a **nunca inventar** preços, pedidos, prazos de entrega ou políticas internas. Quando faltam informações essenciais, a IA solicita os dados educadamente ao cliente ou orienta a verificação com o time responsável.
- **Proteção de Credenciais:** A chave de API do Gemini (`GEMINI_API_KEY`) roda com exclusividade no backend Node.js/Express, nunca sendo exposta ao navegador do cliente.

---

## 🚀 2. Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend:** Node.js, Express, tsx.
- **Inteligência Artificial:** SDK oficial `@google/genai` com o modelo `gemini-3.8-flash`.
- **Estruturação de Dados:** `responseSchema` com JSON estrito validado pelo Gemini.

---

## ⚙️ 3. Como Configurar a Chave da API Gemini

Para executar o projeto, você precisará de uma chave de API do Google Gemini.

### Passo a passo para obter a chave gratuita:
1. Acesse o portal oficial [Google AI Studio](https://aistudio.google.com/).
2. Faça login com sua conta Google.
3. No menu lateral, clique em **"Get API key"** (Obter chave de API).
4. Clique em **"Create API key"** em um projeto novo ou existente.
5. Copie a chave gerada (ela começa com `AIzaSy...`).

### Configurando no projeto:
1. Na raiz do projeto, copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo `.env` e insira sua chave:
   ```env
   GEMINI_API_KEY="sua_chave_aqui"
   PORT=3000
   ```
*(No ambiente do Google AI Studio Build, a chave pode ser injetada automaticamente pelo painel de Secrets).*

---

## 💻 4. Instalação e Execução Local

### Pré-requisitos
- Node.js versão 18 ou superior instalado.
- Gerenciador de pacotes `npm`.

### Passos de Execução

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *O sistema estará acessível em `http://localhost:3000`.*

3. **Compilar para produção (Build):**
   ```bash
   npm run build
   ```

4. **Executar em modo produção:**
   ```bash
   npm run start
   ```

---

## 🧪 5. Casos de Teste Integrados

A aplicação já conta com 4 botões de teste rápido com os exemplos solicitados para demonstração acadêmica:

1. **Exemplo 1 — Atendimento:**
   > *"Olá, gostaria de saber como posso atualizar meus dados cadastrais."*
   > **Comportamento esperado da IA:** Explica cordialmente o procedimento padrão ou solicita a confirmação do documento de identificação, sem alterar dados por conta própria.

2. **Exemplo 2 — Vendas:**
   > *"Bom dia, gostaria de receber informações sobre os produtos e preços disponíveis."*
   > **Comportamento esperado da IA:** Agradece o interesse, apresenta-se de forma consultiva e informa que o catálogo atualizado será disponibilizado pelo especialista de vendas, sem inventar valores ou tabelas de preços fictícias.

3. **Exemplo 3 — Suporte Técnico:**
   > *"Estou com dificuldades para utilizar o serviço e preciso de ajuda."*
   > **Comportamento esperado da IA:** Demonstra empatia, acolhe a solicitação e solicita detalhes adicionais (como mensagem de erro, tela ou navegador utilizado) para que a equipe de suporte possa agir com precisão.

4. **Exemplo 4 — Pedido:**
   > *"Gostaria de saber a previsão de entrega do meu pedido."*
   > **Comportamento esperado da IA:** Solicita o número do pedido ou CPF do titular para localização no sistema logístico, deixando claro que não pode confirmar prazos sem a identificação do pedido.

---

## 📂 6. Estrutura do Código-Fonte

```
├── .env.example          # Modelo de variáveis de ambiente
├── README.md             # Documentação completa de instalação e arquitetura
├── metadata.json         # Metadados da aplicação AI Studio
├── package.json          # Dependências e scripts de execução
├── server.ts             # Servidor Express, proxy seguro do Gemini e SSR/Vite
├── index.html            # Ponto de entrada HTML com meta tags SEO/OpenGraph
└── src/
    ├── main.tsx          # Ponto de entrada do React
    ├── index.css         # Importações do Tailwind CSS
    ├── App.tsx           # Aplicação principal (Dashboard, Formulário, IA e Histórico)
    ├── types.ts          # Definições TypeScript para mensagens, categorias e respostas
    └── components/
        ├── Header.tsx           # Cabeçalho corporativo com status da conexão
        ├── EmailForm.tsx        # Formulário de entrada com seletor de categorias e testes rápidos
        ├── ResponseCard.tsx     # Card de resposta gerada, resumo, intent e edição humana
        ├── HistoryList.tsx      # Histórico da sessão com status de revisão
        ├── GuideModal.tsx       # Modal interativo do Guia Acadêmico e Instalação
        └── Toast.tsx            # Notificações visuais elegantes (copiado, erros, etc.)
```

---

## 🎓 7. Apresentação Acadêmica e Entrega

Este projeto foi estruturado seguindo as melhores práticas de Engenharia de Software:
- **Separação de responsabilidades:** Backend protegendo credenciais e Frontend focado na experiência de usuário (UX).
- **Tratamento robusto de erros:** Mensagens claras em português em caso de falha de conexão, ausência de chave ou campos inválidos.
- **Pronto para GitHub:** Código limpo, tipado com TypeScript estrito e sem arquivos residuais.
