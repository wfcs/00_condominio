# 🏢 CondoConnect

> Sistema SaaS multi-tenant para gestão completa de condomínios

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Sobre o Projeto

**CondoConnect** é uma plataforma completa de gestão condominial desenvolvida pela **Fluxibi**, oferecendo ferramentas modernas para síndicos, moradores, portaria e equipe de manutenção.

### ✨ Principais Funcionalidades

#### 👥 Para Moradores
- 🗳️ **Votações Online** - Participe de assembleias e enquetes
- 📢 **Mural de Avisos** - Comunicados, eventos e anúncios
- 🔔 **Notificações** - Entregas e visitantes em tempo real
- 💬 **Interação Social** - Comentários e likes em publicações

#### 🏛️ Para Síndicos
- 📊 **Dashboard Executivo** - Visão geral com métricas em tempo real
- 📄 **Gestão de Documentos** - Upload e organização de atas, balancetes e contratos
- 💰 **Sistema Financeiro** - Integração com Asaas para cobranças
- 📈 **Gauge de Aderência** - Acompanhamento de pagamentos em tempo real
- 👥 **Gestão de Usuários** - Cadastro e controle de moradores
- 🔧 **Operacional** - Gerenciamento de tarefas e manutenções

#### 🛡️ Para Portaria
- 📦 **Registro de Entregas** - Notificação automática aos moradores
- 👤 **Controle de Visitantes** - Registro com foto e notificação
- 📸 **Upload de Fotos** - Documentação visual de ocorrências

#### 🔧 Para Manutenção
- 📋 **Chamados** - Visualização e gestão de tarefas
- ⚡ **Priorização** - Sistema de prioridades (Baixa, Média, Alta, Crítica)
- ✅ **Status** - Acompanhamento (Aberto, Em Andamento, Resolvido)

---

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Estilização utility-first
- **Font Awesome** - Ícones

### Backend (Planejado)
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Storage
  - Real-time subscriptions

### Integrações
- **Asaas** - Gateway de pagamentos
  - PIX
  - Boleto
  - Cartão de Crédito

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passo a Passo

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/condoconnect.git

# Entre na pasta do projeto
cd condoconnect/app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `app/`:

```env
# Asaas API (opcional - para sistema financeiro)
VITE_ASAAS_API_KEY=sua_chave_api_aqui
VITE_ASAAS_ENV=sandbox  # ou 'production'
VITE_ASAAS_API_URL=https://sandbox.asaas.com/api/v3

# Supabase (opcional - para backend real)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

---

## 👤 Usuários de Demonstração

### Síndico
- **Email:** `ana@exemplo.com`
- **Senha:** Qualquer senha (modo demo)
- **Acesso:** Todas as funcionalidades

### Morador
- **Email:** `ricardo@exemplo.com`
- **Senha:** Qualquer senha (modo demo)
- **Acesso:** Votações, Mural, Notificações

### Portaria
- **Email:** `joao@exemplo.com`
- **Senha:** Qualquer senha (modo demo)
- **Acesso:** Registro de entregas e visitantes

### Manutenção
- **Email:** `carlos@exemplo.com`
- **Senha:** Qualquer senha (modo demo)
- **Acesso:** Chamados operacionais

### Admin Master (Fluxibi)
- **Email:** `adm@fluxibi.com.br`
- **Senha:** Qualquer senha (modo demo)
- **Acesso:** Todos os condomínios

---

## 🏗️ Estrutura do Projeto

```
app/
├── components/          # Componentes React
│   ├── Login.tsx       # Tela de login
│   ├── Dashboard.tsx   # Painel principal
│   ├── Sidebar.tsx     # Menu lateral
│   ├── Navbar.tsx      # Barra superior
│   ├── PollsView.tsx   # Votações
│   ├── BoardView.tsx   # Mural
│   ├── GatehouseView.tsx    # Portaria
│   ├── OperationalView.tsx  # Operacional
│   ├── ManagementView.tsx   # Gestão de usuários
│   ├── DocumentsView.tsx    # Gestão de documentos
│   └── GaugeChart.tsx       # Gráfico de aderência
├── lib/                # Bibliotecas e utilitários
│   └── supabase.ts     # Cliente Supabase
├── types.ts            # Definições TypeScript
├── constants.ts        # Dados mock
├── App.tsx             # Componente raiz
├── index.html          # HTML principal
└── main.tsx            # Entry point

.agent/
└── skills/             # Skills do agente
```

---

## 🎨 Funcionalidades Detalhadas

### 📄 Gestão de Documentos

Sistema completo para organização de documentos condominiais:

**Categorias:**
- Ata de Assembleia
- Balancete
- Contrato
- Regulamento
- Comprovante
- Outros

**Recursos:**
- Upload de arquivos (PDF, DOC, XLS, imagens)
- Busca e filtros
- Download e visualização
- Exclusão com confirmação
- Metadados (autor, data, tamanho)
- Isolamento por condomínio (RLS)

### 💰 Sistema Financeiro (Asaas)

Integração completa com gateway de pagamentos:

**Funcionalidades:**
- Geração de cobranças (individual ou em massa)
- Múltiplas formas de pagamento (PIX, Boleto, Cartão)
- Dashboard financeiro
- Acompanhamento de status
- Relatórios de inadimplência
- Webhooks para atualização automática

**Gauge de Aderência:**
- Visualização em tempo real do percentual de pagamentos
- Código de cores (Verde ≥90%, Amarelo 60-89%, Vermelho <60%)
- Animação suave do ponteiro
- Legenda e status textual

### 🗳️ Sistema de Votações

Assembleias e enquetes digitais:

- Criação de votações com múltiplas opções
- Votação única por unidade
- Resultados em tempo real
- Gráficos de barras
- Data de encerramento
- Ativação/desativação

### 📢 Mural de Avisos

Comunicação centralizada:

- Categorias (Assembleia, Comunicado, Evento, Brechó, Social)
- Sistema de likes
- Comentários aninhados
- Anexos de arquivos
- Filtros por categoria
- Busca

---

## 🔒 Segurança

### Multi-Tenancy
- Isolamento de dados por condomínio (`clientId`)
- Filtros RLS-like no frontend
- Admin Master com acesso global

### Autenticação
- Sistema de login com validação de email
- Recuperação de senha com validação
- Perfis de acesso (Morador, Síndico, Portaria, Manutenção)

### Próximos Passos
- [ ] Implementar RLS real no Supabase
- [ ] Autenticação JWT
- [ ] 2FA (Two-Factor Authentication)
- [ ] Logs de auditoria

---

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop (1920px+)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (320px - 768px)

---

## 🌙 Dark Mode

Suporte completo a tema escuro:
- Toggle no navbar
- Persistência em localStorage
- Cores otimizadas para ambos os temas
- Transições suaves

---

## 🚧 Roadmap

### ✅ Concluído
- [x] Sistema de login e autenticação
- [x] Dashboard com métricas
- [x] Votações online
- [x] Mural de avisos
- [x] Gestão de usuários
- [x] Portaria (entregas e visitantes)
- [x] Operacional (chamados)
- [x] Gestão de documentos
- [x] Gauge de aderência de pagamento
- [x] Dark mode
- [x] Responsividade

### 🔄 Em Desenvolvimento
- [ ] Integração Asaas (cobranças)
- [ ] Backend Supabase
- [ ] Upload real de documentos
- [ ] Notificações push
- [ ] Webhooks Asaas

### 📋 Planejado
- [ ] App mobile (React Native)
- [ ] Relatórios em PDF
- [ ] Integração com WhatsApp
- [ ] Chat em tempo real
- [ ] Reserva de áreas comuns
- [ ] Controle de acesso (catracas)
- [ ] Integração com câmeras

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Fluxibi** - Soluções em Gestão Condominial

- Website: [fluxibi.com.br](https://fluxibi.com.br)
- Email: contato@fluxibi.com.br

---

## 📞 Suporte

Encontrou um bug ou tem uma sugestão?

- 🐛 [Reportar Bug](https://github.com/seu-usuario/condoconnect/issues)
- 💡 [Sugerir Feature](https://github.com/seu-usuario/condoconnect/issues)
- 📧 Email: suporte@fluxibi.com.br

---

## 🙏 Agradecimentos

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)
- [Supabase](https://supabase.com/)
- [Asaas](https://www.asaas.com/)

---

<div align="center">

**Desenvolvido com ❤️ pela Fluxibi**

[⬆ Voltar ao topo](#-condoconnect)

</div>
