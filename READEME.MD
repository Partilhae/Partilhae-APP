# 💜 Partilhaê

Um app desenvolvido para conectar pessoas que precisam de alimentos àquelas que desejam ajudar, aproximando **beneficiários** e **doadores** por meio de solicitações e doações organizadas por região.

O **Partilhaê** busca facilitar a solidariedade no cotidiano, oferecendo um ambiente no qual beneficiários podem publicar suas necessidades e doadores podem encontrar solicitações, oferecer ajuda e acompanhar a entrega dos alimentos.

---

## Sobre o Projeto

A proposta parte do problema da insegurança alimentar e da dificuldade de conectar quem necessita de doações a quem pode contribuir. O aplicativo reúne essas pessoas em dois fluxos principais:

- **Beneficiário** — publica solicitações de alimentos, acompanha as ajudas recebidas e confirma o recebimento das doações;
- **Doador** — explora solicitações por região, inicia doações e acompanha seu andamento.

---

## Conexão com os Objetivos de Desenvolvimento Sustentável (ODS)

O **Partilhaê** foi desenvolvido para a **Global Solution — CitizenTech**, considerando os Objetivos de Desenvolvimento Sustentável (ODS) da **Agenda 2030 da Organização das Nações Unidas (ONU)**.

Entre os ODS apresentados no desafio, o projeto tem como **foco principal o ODS 2 — Fome Zero e Agricultura Sustentável**, além de contribuir para os objetivos do **ODS 10 — Redução das Desigualdades** e do **ODS 11 — Cidades e Comunidades Sustentáveis**.

### ODS 2 — Fome Zero e Agricultura Sustentável (Foco principal)

O Partilhaê busca contribuir para o enfrentamento da **insegurança alimentar** ao facilitar a conexão entre pessoas que precisam de alimentos e pessoas dispostas a doar. Os beneficiários podem publicar solicitações de ajuda, enquanto os doadores encontram pedidos e iniciam doações pelo aplicativo.

### ODS 10 — Redução das Desigualdades

A proposta procura diminuir barreiras de acesso à ajuda alimentar, aproximando pessoas com diferentes necessidades e possibilidades de contribuição. Ao organizar as solicitações e o acompanhamento das doações, o aplicativo incentiva a participação em ações solidárias.

### ODS 11 — Cidades e Comunidades Sustentáveis

Os filtros por **bairro, cidade e estado** ajudam os doadores a encontrar solicitações de determinadas regiões, incentivando a formação de redes locais de apoio e colaboração entre moradores.

### Nosso Foco

O **foco central do Partilhaê é o combate à insegurança alimentar por meio da tecnologia e da solidariedade**. Mais do que registrar pedidos, a proposta é aproximar quem precisa de ajuda de quem deseja contribuir, tornando esse processo mais organizado, acessível e próximo das comunidades.

O projeto utiliza a tecnologia mobile como ferramenta de impacto social, em alinhamento com a proposta **CitizenTech** de desenvolver soluções digitais voltadas às necessidades da sociedade.

---

## Tipos de Usuário

### Beneficiário

O beneficiário utiliza o aplicativo para solicitar alimentos e acompanhar as contribuições recebidas.

Entre as funcionalidades implementadas estão:

- cadastro e autenticação;
- manutenção da sessão e acesso ao perfil;
- criação de solicitações de ajuda geral ou específica;
- inclusão de alimentos, quantidades e unidades em solicitações específicas;
- informação de bairro, cidade e estado nas solicitações;
- listagem, visualização, edição, cancelamento e exclusão de solicitações, conforme seu status;
- acompanhamento das doações recebidas;
- confirmação do recebimento dos alimentos;
- conversas relacionadas às doações;
- recursos de denúncia;
- edição de perfil, configurações e logout.

### Doador

O doador utiliza o aplicativo para encontrar solicitações e acompanhar as doações que iniciou.

Entre as funcionalidades implementadas estão:

- cadastro e autenticação;
- manutenção da sessão e acesso ao perfil;
- exploração de solicitações abertas;
- filtros de solicitações por **estado, cidade e bairro**;
- visualização dos detalhes e alimentos solicitados;
- início de uma doação ao selecionar **Quero ajudar**;
- acompanhamento das doações em andamento, concluídas e canceladas;
- informação de que a entrega foi realizada;
- conversas relacionadas às doações;
- recursos de denúncia;
- edição de perfil, configurações e logout.

---

## Fluxo Principal

O fluxo central conecta o beneficiário ao doador e mantém etapas distintas para entrega e recebimento:

```text
Beneficiário cria uma solicitação
                ↓
Solicitação fica com status "aberta"
                ↓
Doador encontra a solicitação pelos filtros regionais
                ↓
Doador visualiza os detalhes e seleciona "Quero ajudar"
                ↓
Doação fica "em andamento"
                ↓
Doador realiza a entrega e informa no aplicativo
                ↓
Doação fica com status "entregue"
                ↓
Beneficiário confirma o recebimento dos alimentos
                ↓
Doação e solicitação ficam "concluídas"
```

O registro de **entrega informada** não conclui automaticamente a doação: é necessária a confirmação do beneficiário. O aplicativo também contempla o cancelamento conforme as regras de status implementadas.

---

## Solicitações de Alimentos

As solicitações podem ser de dois tipos:

- **Ajuda geral:** descrição da necessidade, sem lista obrigatória de itens;
- **Ajuda específica:** lista de alimentos com quantidade e unidade.

Cada solicitação contém informações como título, descrição, tipo de ajuda, data de criação, status e localização por **bairro, cidade e estado**.

O doador pode filtrar as solicitações abertas usando esses dados regionais. A localização é registrada na própria solicitação, sem depender de acesso aos dados privados de outro usuário pela API.

As solicitações são armazenadas localmente no aplicativo, utilizando **AsyncStorage** e **Context API**.

---

## Doações e Acompanhamento

O acompanhamento de doações utiliza os seguintes status:

| Status | Significado |
| --- | --- |
| `em_andamento` | Um doador aceitou ajudar com a solicitação. |
| `entregue` | O doador informou que realizou a entrega. |
| `concluida` | O beneficiário confirmou o recebimento. |
| `cancelada` | A doação foi cancelada. |

---

## Notificações

O Partilhaê utiliza **notificações locais**, implementadas com `expo-notifications`, para informar os três principais acontecimentos de uma doação:

1. **Solicitação aceita:** quando um doador inicia uma ajuda;
2. **Entrega informada:** quando o doador marca que entregou os alimentos;
3. **Recebimento confirmado:** quando o beneficiário confirma o recebimento e a doação é concluída.

---

## Tecnologias Utilizadas

| Tecnologia | Utilização |
| --- | --- |
| **React Native** | Desenvolvimento da aplicação mobile |
| **React** | Construção da interface |
| **Expo** | Ambiente de desenvolvimento e execução |
| **TypeScript** | Tipagem e organização do código |
| **React Navigation** | Navegação por stacks e abas |
| **AsyncStorage** | Persistência local |
| **Context API** | Gerenciamento de estados compartilhados |
| **Axios** | Comunicação HTTP com a API |
| **Expo Notifications** | Notificações locais |
| **Expo Vector Icons** | Ícones da interface |
| **React Native StyleSheet** | Estilização e padronização visual |
| **API REST Java** | Autenticação e dados de usuários |
| **ViaCEP** | Consulta e preenchimento de endereço por CEP |

---

## Integração com a API

O Partilhaê utiliza uma **API REST Java** para recursos de cadastro, autenticação e dados dos usuários. A comunicação HTTP é organizada na camada `services`, com auxílio do Axios.

Pelo render ser gratuito, a autenticação ou cadastro de usuários demora cerca de 5 minutos, sugiro ligar o render antes de testar o app

Link: https://partilhae-java.onrender.com/swagger-ui/index.html#/


A consulta ao **ViaCEP** auxilia no preenchimento e na validação de informações de endereço durante o cadastro.


## Autenticação e Sessão

A autenticação é realizada pela **API Java**, com uso de token JWT e armazenamento das informações da sessão no dispositivo.

Os perfis de acesso são diferenciados pelas roles utilizadas pela API:

```text
DOADOR
RECEPTOR
```

Na interface, o perfil técnico `RECEPTOR` é apresentado como **Beneficiário**.

Após o login, o usuário é direcionado para seu respectivo fluxo de navegação. A sessão pode ser encerrada pelo logout.

---

## Arquitetura

```text
src/
├── components/      
├── context/          
├── estilos/         
├── navigation/      
├── screens/         
├── services/        
└── types/           
```
---

## Navegação

A navegação é organizada com **React Navigation**, utilizando **Native Stack** e **Bottom Tabs**.

### Fluxo do Doador

```text
Doador
├── Início
├── Solicitações
│   └── Detalhes da solicitação
├── Minhas Doações
│   └── Detalhes da doação
├── Conversas
│   └── Chat
└── Perfil
    ├── Editar perfil
    ├── Configurações
    └── Minhas denúncias
```

### Fluxo do Beneficiário

```text
Beneficiário
├── Início
├── Minhas Solicitações
│   ├── Nova solicitação
│   ├── Detalhes da solicitação
│   └── Editar solicitação
├── Doações Recebidas
│   └── Detalhes da doação
├── Conversas
│   └── Chat
└── Perfil
    ├── Editar perfil
    ├── Configurações
    └── Minhas denúncias
```

---

## Estrutura do Projeto

Os arquivos centrais das funcionalidades de solicitações, doações e notificações incluem:

```text
src/
│
├── components/
│   ├── forms/
│   │   ├── BeneficiarioForm.tsx
│   │   ├── DenunciaForm.tsx
│   │   ├── DoadorForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── MensagemForm.tsx
│   │   ├── PerfilBeneficiarioForm.tsx
│   │   ├── PerfilDoadorForm.tsx
│   │   └── SolicitacaoForm.tsx
│   │
│   ├── Botao.tsx
│   └── Input.tsx
│
├── context/
│   ├── ConversasContext.tsx
│   ├── DoacoesContext.tsx
│   └── SolicitacoesContext.tsx
│
├── estilos/
│   └── estilo.ts
│
├── navigation/
│   ├── AppStack.tsx
│   ├── BeneficiarioStack.tsx
│   ├── BeneficiarioTabNavigator.tsx
│   ├── DoadorStack.tsx
│   └── DoadorTabNavigator.tsx
│
├── screens/
│   │
│   ├── autenticacao/
│   │   ├── CadastroBeneficiarioScreen.tsx
│   │   ├── CadastroDoadorScreen.tsx
│   │   └── LoginScreen.tsx
│   │
│   ├── beneficiario/
│   │   ├── ConfiguracoesPerfilBeneficiarioScreen.tsx
│   │   ├── DashboardBeneficiarioScreen.tsx
│   │   ├── DetalhesSolicitacoesBeneficiarioScreen.tsx
│   │   ├── DoacoesRecebidasBeneficiarioScreen.tsx
│   │   ├── EditarPerfilBeneficiarioScreen.tsx
│   │   ├── EditarSolicitacaoBeneficiarioScreen.tsx
│   │   ├── MinhasSolicitacoesBeneficiarioScreen.tsx
│   │   ├── NovaSolicitacaoBeneficiarioScreen.tsx
│   │   └── PerfilBeneficiarioScreen.tsx
│   │
│   ├── doador/
│   │    ├── ConfiguracoesPerfilDoadorScreen.tsx
│   │    ├── DashboardDoadorScreen.tsx
│   │    ├── DetalhesDoacaoDoadorScreen.tsx
│   │    ├── DetalhesSolicitacaoDoadorScreen.tsx
│   │    ├── EditarPerfilDoadorScreen.tsx
│   │    ├── ExplorarSolicitacoesDoadorScreen.tsx
│   │    ├── MinhasDoacoesDoadorScreen.tsx
│   │    └── PerfilDoadorScreen.tsx
│   └──usuario/
│        ├── ChatScreen.tsx
│        ├── ConversasScreen.tsx
│        ├── MinhasDenunciasScreen.tsx
│        └── NovaDenunciaScreen.tsx
│
├── services/
│   ├── API/
│   │   └── JavaAPI.ts
│   │
│   ├── AuthService.ts
│   ├── BeneficiarioService.ts
│   ├── DenunciasService.ts
│   ├── DoadorService.ts
│   ├── NotificacaoService.ts
│   └── ViaCepService.ts
│
└── types/
    ├── Auth.ts
    ├── Beneficiario.ts
    ├── Conversa.ts
    ├── Denuncia.ts
    ├── Doacao.ts
    ├── Doador.ts
    ├── Navigation.ts
    └── Solicitacao.ts
```

---

## Status do Projeto

**Global Solution concluída.**

---

## Integrantes

| Integrante | RM | Turma |
| --- | --- |
| Agatha Yie Won Yun | 561507 | 2TDSA |
| Ana Claudia Fernandes Martins| 561190 | 2TDSR
| André Rosa Colombo | 563112 | 2TDSA |
| Samantha Faruolo Galdi| 554794 | 2TDSA |
| Vitor Fria Dalmagro | 566052 | 2TDSA |

---

## Vídeo de Demonstração

**Link:** a espera do link 

---

## 💜 Partilhaê

Projeto acadêmico da **Global Solution 2026/2 — CitizenTech**, desenvolvido na FIAP, para a matéria Mobile Application Development 
