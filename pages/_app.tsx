import "@/styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import type { AppProps } from "next/app"
import { Fragment, useEffect, useRef } from "react"
import Link from "next/link"

import { Poppins } from "@next/font/google"
import {
  WagmiConfig,
  createClient,
  chain,
  configureChains,
  useAccount,
} from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import toast, { Toaster } from "react-hot-toast"

const { provider, chains } = configureChains(
  [chain.mainnet],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: "topus.digital",
  chains,
})

const client = createClient({
  autoConnect: true,
  provider,
  connectors,
})

const fontPoppins = Poppins({
  weight: ["400", "500", "700"],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={fontPoppins.className}>
      <WagmiConfig client={client}>
        <RainbowKitProvider
          appInfo={{
            disclaimer: Disclaimer,
          }}
          chains={chains}
        >
          <ModalLayout>
            <Component {...pageProps} />
          </ModalLayout>
        </RainbowKitProvider>
      </WagmiConfig>
    </main>
  )
}

function ModalLayout({ children }: any) {
  const toastRef = useRef<string>()
  const { isConnecting, isConnected } = useAccount()

  useEffect(() => {
    toast.dismiss(toastRef.current)
    if (isConnecting) {
      toastRef.current = toast.loading("Connecting...", {
        className: "font-bold",
        duration: 7_000, // hide after 7sec
      })
    }
  }, [isConnecting, isConnected])

  return (
    <Fragment>
      <Toaster />
      {children}
    </Fragment>
  )
}

// Used to replace RainbowKit footer content
function Disclaimer() {
  return (
    <Link href="/" target="_blank" className="text-sm text-zinc-400">
      topus.digital
    </Link>
  )
}
