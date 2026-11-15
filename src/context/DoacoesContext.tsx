import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { Doacao, StatusDoacao } from "../types/Doacao";
import { useSolicitacoes } from "./SolicitacoesContext";

const CHAVE_DOACOES = "@partilhae_doacoes";

type DoacoesContextType = {
  doacoes: Doacao[];
  loading: boolean;
  adicionarDoacao: (idSolicitacao: string, idDoador: number) => Promise<void>;
  atualizarStatusDoacao: (id: string, status: StatusDoacao) => Promise<void>;
  excluirDoacao: (id: string) => Promise<void>;
};

const DoacoesContext = createContext<DoacoesContextType>(
  {} as DoacoesContextType,
);

export function DoacoesProvider({ children }: PropsWithChildren) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    solicitacoes,
    loading: loadingSolicitacoes,
    atualizarStatus,
  } = useSolicitacoes();

  useEffect(() => {
    carregarDoacoes();
  }, []);

  async function carregarDoacoes() {
    try {
      const dados = await AsyncStorage.getItem(CHAVE_DOACOES);

      if (dados) {
        setDoacoes(JSON.parse(dados));
      }
    } catch (error) {
      console.log("Erro ao carregar doações:", error);
    } finally {
      setLoading(false);
    }
  }

  async function salvarDoacoes(lista: Doacao[]) {
    await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(lista));

    setDoacoes(lista);
  }

  async function adicionarDoacao(idSolicitacao: string, idDoador: number) {
    if (loading || loadingSolicitacoes) {
      throw new Error("Aguarde o carregamento dos dados.");
    }

    const solicitacao = solicitacoes.find((item) => item.id === idSolicitacao);

    if (!solicitacao) {
      throw new Error("Solicitação não encontrada.");
    }

    if (solicitacao.status !== "aberta") {
      throw new Error("Esta solicitação não está disponível.");
    }

    const jaExiste = doacoes.some(
      (doacao) =>
        doacao.idSolicitacao === idSolicitacao && doacao.status !== "cancelada",
    );

    if (jaExiste) {
      throw new Error("Esta solicitação já possui uma doação.");
    }

    const novaDoacao: Doacao = {
      id: `${Date.now()}-${Math.random()}`,
      idSolicitacao,
      idDoador,
      idReceptor: solicitacao.idReceptor,
      status: "em_andamento",
      dataCriacao: new Date().toISOString(),
    };

    await salvarDoacoes([...doacoes, novaDoacao]);

    await atualizarStatus(idSolicitacao, "em_andamento");
  }

  async function atualizarStatusDoacao(id: string, status: StatusDoacao) {
    if (loading || loadingSolicitacoes) {
      throw new Error("Aguarde o carregamento dos dados.");
    }

    const doacao = doacoes.find((item) => item.id === id);

    if (!doacao) {
      throw new Error("Doação não encontrada.");
    }

    if (doacao.status === "concluida" || doacao.status === "cancelada") {
      throw new Error("Esta doação já foi finalizada e não pode ser alterada.");
    }

    const podeAtualizar =
      (doacao.status === "em_andamento" &&
        (status === "entregue" || status === "cancelada")) ||
      (doacao.status === "entregue" && status === "concluida");

    if (!podeAtualizar) {
      throw new Error("Esta mudança de status não é permitida.");
    }

    const listaAtualizada: Doacao[] = doacoes.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            dataConclusao:
              status === "concluida"
                ? new Date().toISOString()
                : item.dataConclusao,
          }
        : item,
    );

    await salvarDoacoes(listaAtualizada);

    if (status === "concluida") {
      await atualizarStatus(doacao.idSolicitacao, "concluida");
    }

    if (status === "cancelada") {
      await atualizarStatus(doacao.idSolicitacao, "aberta");
    }
  }

  async function excluirDoacao(id: string) {
    const doacao = doacoes.find((item) => item.id === id);

    if (!doacao) {
      throw new Error("Doação não encontrada.");
    }

    if (doacao.status !== "cancelada") {
      throw new Error("Somente doações canceladas podem ser excluídas.");
    }

    const listaAtualizada = doacoes.filter((item) => item.id !== id);

    await salvarDoacoes(listaAtualizada);
  }

  return (
    <DoacoesContext.Provider
      value={{
        doacoes,
        loading: loading || loadingSolicitacoes,
        adicionarDoacao,
        atualizarStatusDoacao,
        excluirDoacao,
      }}
    >
      {children}
    </DoacoesContext.Provider>
  );
}

export function useDoacoes() {
  return useContext(DoacoesContext);
}
