import { useState } from "react";



function useAsync (req) {
  const [state, setState] = useState({
    pending: false,
    error: null,
    data: null,
  });

  async function execute(params){
    setState((state) => ({
      ...state,
      pending: true,
      data: null,
      error: null,
    }));

    try {
      const data = await req(params);

      setState((state) => ({
        ...state,
        pending: false,
        data,
      }));

      return { data };
    } catch (error) {
      setState((state) => ({
        ...state,
        pending: false,
        error,
      }));

      return { error };
    }
  }

  return {
    ...state,
    execute,
  };
}

export default useAsync;