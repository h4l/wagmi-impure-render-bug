import { WagmiProvider, useAccount, useConnect, useDisconnect } from "wagmi";
import { config } from "./wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Root({ queryClient }: { queryClient: QueryClient }) {
  const [rootState, setRootState] = useState<number>(0);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App rootState={rootState} setRootState={setRootState} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function App({
  rootState,
  setRootState,
}: {
  rootState: number;
  setRootState: (n: number) => void;
}) {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div>
        <h2>Root State</h2>
        <p>Current: {rootState}</p>
        <p>
          <button onClick={() => setRootState(rootState + 1)}>
            Change Root State
          </button>
        </p>

        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  );
}

export default App;
