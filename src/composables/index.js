import { useQuasar } from "quasar";

export default function useNotify() {
  const $q = useQuasar();

  const sendNotify = (message, type) => {
    $q.notify({
      type,
      message,
    });
  };

  return {
    sendNotify,
  };
}