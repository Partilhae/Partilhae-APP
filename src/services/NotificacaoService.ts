import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configurarNotificacoes() {

  const permissaoAtual = await Notifications.getPermissionsAsync();

  if (!permissaoAtual.granted) {
    await Notifications.requestPermissionsAsync();
  }
}

export async function enviarNotificacao(titulo: string, mensagem: string) {
  try {
    const permissao = await Notifications.getPermissionsAsync();

    if (!permissao.granted) {
        console.log("Permissão e notificações não concedida.")
    return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: titulo,
        body: mensagem,
        sound: "default",
      },
      trigger: null,
    });
  } catch (error) {
    console.log("Erro ao enviar notificação:", error);
  }
}
