import { Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";

export function NotFound() {
  const history = useHistory();

  useEffect(() => {
    toast.error(
      "Ops, a página solicitada não existe! Retornando à pagina anterior",
      {
        duration: 3000,
      }
    );
    history.goBack();
  }, [history]);

  return <Fragment />;
}
