/** @format */

import { config } from "@onflow/fcl";

config()
  .put("app.detail.title", "Pieces NFTs")
  .put(
    "app.detail.icon",
    "https://assets-global.website-files.com/5f734f4dbd95382f4fdfa0ea/63e254beeb2edc54cc059acc_hackathon-logo.d4db7683-p-500.png"
  )
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
//.put('accessNode.api', 'https://rest-mainnet.onflow.org')
//.put('discovery.wallet', 'https://fcl-discovery.onflow.org/authn')
// .put('accessNode.api', 'http://localhost:8888')
// .put('discovery.wallet', 'http://localhost:8701/fcl/authn')
