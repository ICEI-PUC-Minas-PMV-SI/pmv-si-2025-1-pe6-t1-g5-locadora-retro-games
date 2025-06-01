import { notifications } from "@mantine/notifications";

export const toast = {
    error: (message) => {
      notifications.show({
        title: "Erro",
        color: "red",
        message: message,
      });
    },
    success: (message) => notifications.show({
      title: "Sucesso",
      color: "green",
      message: message,
    }),
    warning: (message) => notifications.show({
      title: "Aviso",
      color: "yellow",
      message: message,
    }),
    log: (message) => notifications.show({
      title: "Notificação",
      color: "blue",
      message: message,
    }),
  }

