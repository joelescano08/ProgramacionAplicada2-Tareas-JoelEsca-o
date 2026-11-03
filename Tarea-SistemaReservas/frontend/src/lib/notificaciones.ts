import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export const tienePermiso = async () => {
  const { granted, canAskAgain } = await requestPermissionsAsync();
  if (!granted) {
    console.warn(`Permiso de notificaciones denegado${canAskAgain ? '' : ' (actívalo en Ajustes > Apps > Expo Go > Notificaciones)'}`);
  }
  return granted;
};

export const programarNotificacionReserva = async (reservaId: number, nombreServicio: string, fecha: string, hora: string) => {
  try {
    if (!(await tienePermiso())) return;

    await scheduleNotificationAsync({
      content: { 
        title: '¡Reserva Confirmada!', 
        body: `Has reservado con éxito el servicio: ${nombreServicio}` 
      },
      trigger: null
    });
    const fechaHoraReserva = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    const msFaltantes = fechaHoraReserva.getTime() - ahora.getTime();
    const horasFaltantes = msFaltantes / (1000 * 60 * 60);

    if (horasFaltantes < 24) {
      console.log('Faltan menos de 24 horas, ignorando notificación.');
      return;
    }

    const fechaNotificacion = new Date(fechaHoraReserva.getTime() - (24 * 60 * 60 * 1000));

    const notificacionId = await scheduleNotificationAsync({
      content: { 
        title: 'Recordatorio de Reserva', 
        body: `Recuerda que mañana tienes tu servicio de: ${nombreServicio} a las ${hora}` 
      },
      trigger: { 
        type: SchedulableTriggerInputTypes.DATE, 
        date: fechaNotificacion 
      }
    });

    await AsyncStorage.setItem(`notif_${reservaId}`, notificacionId);

  } catch (err) {
    console.warn('No se pudo programar la notificación:', err);
  }
};

export const cancelarNotificacionReserva = async (reservaId: number) => {
  try {
    const notificacionId = await AsyncStorage.getItem(`notif_${reservaId}`);
    if (notificacionId) {
      await cancelScheduledNotificationAsync(notificacionId);
      await AsyncStorage.removeItem(`notif_${reservaId}`);
      console.log('Notificación cancelada correctamente.');
    }
  } catch (err) {
    console.warn('Error al cancelar la notificación:', err);
  }
};