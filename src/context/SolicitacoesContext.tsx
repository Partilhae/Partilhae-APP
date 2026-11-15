import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  NovaSolicitacao,
  Solicitacao,
  StatusSolicitacao,
} from "../types/Solicitacao";

const CHAVE_SOLICITACOES = "@partilhae_solicitacoes";

type SolicitacoesContextType = {
  solicitacoes: Solicitacao[];
  loading: boolean;
  adicionarSolicitacao: (
    dados: NovaSolicitacao,
    idReceptor: number,
  ) => Promise<void>;
  atualizarSolicitacao: (id: string, dados: NovaSolicitacao) => Promise<void>;
  atualizarStatus: (id: string, status: StatusSolicitacao) => Promise<void>;
  excluirSolicitacao: (id: string) => Promise<void>;
};

const SolicitacoesContext = createContext<SolicitacoesContextType>(
  {} as SolicitacoesContextType,
);

export function SolicitacoesProvider({ children }: PropsWithChildren) {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  async function carregarSolicitacoes() {
    try {
      const dados = await AsyncStorage.getItem(CHAVE_SOLICITACOES);

      if (dados) {
        setSolicitacoes(JSON.parse(dados));
      }
    } catch (error) {
      console.log("Erro ao carregar solicitações:", error);
    } finally {
      setLoading(false);
    }
  }

  async function salvarSolicitacoes(lista: Solicitacao[]) {
    await AsyncStorage.setItem(CHAVE_SOLICITACOES, JSON.stringify(lista));

    setSolicitacoes(lista);
  }

  async function adicionarSolicitacao(
    dados: NovaSolicitacao,
    idReceptor: number,
  ) {
    const novaSolicitacao: Solicitacao = {
      ...dados,
      id: `${Date.now()}-${Math.random()}`,
      idReceptor,
      status: "aberta",
      dataCriacao: new Date().toISOString(),
    };

    await salvarSolicitacoes([...solicitacoes, novaSolicitacao]);
  }

  async function atualizarSolicitacao(id: string, dados: NovaSolicitacao) {
    const solicitacao = solicitacoes.find((item) => item.id === id);

    if (!solicitacao) {
      throw new Error("Solicitação não encontrada.");
    }

    if (solicitacao.status !== "aberta") {
      throw new Error("Somente solicitações abertas podem ser editadas.");
    }

    const listaAtualizada = solicitacoes.map((item) =>
      item.id === id
        ? {
            ...item,
            titulo: dados.titulo,
            descricao: dados.descricao,
            tipoAjuda: dados.tipoAjuda,
            itens: dados.tipoAjuda === "especifico" ? dados.itens : [],
          }
        : item,
    );

    await salvarSolicitacoes(listaAtualizada);
  }

  async function atualizarStatus(id: string, status: StatusSolicitacao) {
    const solicitacao = solicitacoes.find((item) => item.id === id);

    if (!solicitacao) {
      throw new Error("Solicitação não encontrada.");
    }

    if (status === "cancelada" && solicitacao.status !== "aberta") {
      throw new Error("Somente solicitações abertas podem ser canceladas.");
    }

    const listaAtualizada = solicitacoes.map((item) =>
      item.id === id ? { ...item, status } : item,
    );

    await salvarSolicitacoes(listaAtualizada);
  }

  async function excluirSolicitacao(id: string) {
    const solicitacao = solicitacoes.find((item) => item.id === id);

    if (!solicitacao) {
      throw new Error("Solicitação não encontrada.");
    }

    if (solicitacao.status !== "aberta" && solicitacao.status !== "cancelada") {
      throw new Error("Esta solicitação não pode ser excluída.");
    }

    const listaAtualizada = solicitacoes.filter((item) => item.id !== id);

    await salvarSolicitacoes(listaAtualizada);
  }

  return (
    <SolicitacoesContext.Provider
      value={{
        solicitacoes,
        loading,
        adicionarSolicitacao,
        atualizarSolicitacao,
        atualizarStatus,
        excluirSolicitacao,
      }}
    >
      {children}
    </SolicitacoesContext.Provider>
  );
}

export function useSolicitacoes() {
  return useContext(SolicitacoesContext);
}
