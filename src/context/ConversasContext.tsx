import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Conversa, Mensagem } from "../types/Conversa";
import { buscarUsuarioLogado } from "../services/AuthService";

const CHAVE_CONVERSAS = "@partilhae_conversas";
const CHAVE_MENSAGENS = "@partilhae_mensagens";

type ConversasContextType = {
  conversas: Conversa[];
  mensagens: Mensagem[];
  loading: boolean;

  iniciarConversa: (
    idDoacao: string,
    idUsuarioDoador: number,
    idUsuarioBeneficiario: number,
  ) => Promise<Conversa>;

  enviarMensagem: (
    idConversa: string,
    idRemetente: number,
    texto: string,
  ) => Promise<void>;

  listarMensagens: (idConversa: string) => Mensagem[];
};

const ConversasContext = createContext<ConversasContextType>(
  {} as ConversasContextType,
);

export function ConversasProvider({ children }: PropsWithChildren) {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const conversasSalvas = await AsyncStorage.getItem(CHAVE_CONVERSAS);
      const mensagensSalvas = await AsyncStorage.getItem(CHAVE_MENSAGENS);

      if (conversasSalvas) {
        setConversas(JSON.parse(conversasSalvas));
      }

      if (mensagensSalvas) {
        setMensagens(JSON.parse(mensagensSalvas));
      }
    } catch (error) {
      console.log("Erro ao carregar conversas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function iniciarConversa(
    idDoacao: string,
    idUsuarioDoador: number,
    idUsuarioBeneficiario: number,
  ): Promise<Conversa> {
    if (loading) {
      throw new Error("Aguarde o carregamento das conversas.");
    }

    if (
      !Number.isInteger(idUsuarioDoador) ||
      idUsuarioDoador <= 0 ||
      !Number.isInteger(idUsuarioBeneficiario) ||
      idUsuarioBeneficiario <= 0
    ) {
      throw new Error(
        "Não foi possível identificar os participantes da conversa.",
      );
    }

    const conversaExistente = conversas.find(
      (conversa) => conversa.idDoacao === idDoacao,
    );

    if (conversaExistente) {
      if (
        conversaExistente.idUsuarioDoador !== idUsuarioDoador ||
        conversaExistente.idUsuarioBeneficiario !== idUsuarioBeneficiario
      ) {
        throw new Error(
          "Os participantes não correspondem à conversa existente.",
        );
      }
      return conversaExistente;
    }

    if (
      !Number.isInteger(idUsuarioDoador) ||
      idUsuarioDoador <= 0 ||
      !Number.isInteger(idUsuarioBeneficiario) ||
      idUsuarioBeneficiario <= 0
    ) {
      throw new Error(
        "Não foi possível identificar os participantes da conversa.",
      );
    }

    const novaConversa: Conversa = {
      id: `${Date.now()}-${Math.random()}`,
      idDoacao,
      idUsuarioDoador,
      idUsuarioBeneficiario,
      dataCriacao: new Date().toISOString(),
    };

    const novasConversas = [...conversas, novaConversa];

    await AsyncStorage.setItem(CHAVE_CONVERSAS, JSON.stringify(novasConversas));

    setConversas(novasConversas);

    return novaConversa;
  }

  async function enviarMensagem(
    idConversa: string,
    idRemetente: number,
    texto: string,
  ) {
    const conversa = conversas.find((item) => item.id === idConversa);

    if (!conversa) {
      throw new Error("Conversa não encontrada.");
    }

    if (
      idRemetente !== conversa.idUsuarioDoador &&
      idRemetente !== conversa.idUsuarioBeneficiario
    ) {
      throw new Error("Usuário não participa desta conversa.");
    }

    const textoLimpo = texto.trim();

    if (!textoLimpo) {
      throw new Error("A mensagem não pode estar vazia.");
    }

    const usuario = await buscarUsuarioLogado();

    if (!usuario || usuario.idUsuario !== idRemetente) {
      throw new Error("Você não tem permissão para enviar esta mensagem.");
    }
    const novaMensagem: Mensagem = {
      id: `${Date.now()}-${Math.random()}`,
      idConversa,
      idRemetente,
      texto: textoLimpo,
      dataEnvio: new Date().toISOString(),
    };

    const novasMensagens = [...mensagens, novaMensagem];

    await AsyncStorage.setItem(CHAVE_MENSAGENS, JSON.stringify(novasMensagens));

    setMensagens(novasMensagens);
  }

  function listarMensagens(idConversa: string): Mensagem[] {
    return mensagens
      .filter((mensagem) => mensagem.idConversa === idConversa)
      .sort(
        (a, b) =>
          new Date(a.dataEnvio).getTime() - new Date(b.dataEnvio).getTime(),
      );
  }

  return (
    <ConversasContext.Provider
      value={{
        conversas,
        mensagens,
        loading,
        iniciarConversa,
        enviarMensagem,
        listarMensagens,
      }}
    >
      {children}
    </ConversasContext.Provider>
  );
}

export function useConversas() {
  return useContext(ConversasContext);
}
