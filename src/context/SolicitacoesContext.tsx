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
  atualizarStatus: (id: string, status: StatusSolicitacao) => Promise<void>;
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

  async function atualizarStatus(id: string, status: StatusSolicitacao) {
    const listaAtualizada = solicitacoes.map((solicitacao) =>
      solicitacao.id === id ? { ...solicitacao, status } : solicitacao,
    );

    await salvarSolicitacoes(listaAtualizada);
  }

  return (
    <SolicitacoesContext.Provider
      value={{
        solicitacoes,
        loading,
        adicionarSolicitacao,
        atualizarStatus,
      }}
    >
      {children}
    </SolicitacoesContext.Provider>
  );
}

export function useSolicitacoes() {
  return useContext(SolicitacoesContext);
}
