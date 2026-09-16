import { MiraeAssetBroker } from "../brokers/miraeasset/adapter.js";
import { SamsungPopBroker } from "../brokers/samsungpop/adapter.js";
import { loadConfig } from "../config.js";
import { toExportHolding } from "../lib/holding-export.js";
import { normalizeMiraeAssetHoldings, normalizeSamsungHoldings } from "../lib/normalize.js";

const READ_ONLY_BROKERS = new Set(["samsungpop", "miraeasset"]);

type ExportOptions = {
  brokers: string[];
  headless: boolean;
};

function parseOptions(argv: string[]): ExportOptions {
  const brokersValue = argv[argv.indexOf("--brokers") + 1] ?? "samsungpop,miraeasset";
  const brokers = brokersValue.split(",").map((value) => value.trim()).filter(Boolean);
  if (brokers.length === 0 || brokers.some((broker) => !READ_ONLY_BROKERS.has(broker))) {
    throw new Error("--brokers 는 samsungpop,miraeasset 중 하나 이상이어야 합니다.");
  }

  return {
    brokers,
    headless: !argv.includes("--visible"),
  };
}

async function fetchBrokerHoldings(brokerId: string, headless: boolean) {
  const config = loadConfig();
  if (brokerId === "samsungpop") {
    const snapshot = await new SamsungPopBroker(config).fetchHoldings({
      allAccounts: true,
      headless,
    });
    return normalizeSamsungHoldings(snapshot).map(toExportHolding);
  }

  const page = await new MiraeAssetBroker(config).fetchAccountsPage({ headless });
  return normalizeMiraeAssetHoldings(page).map(toExportHolding);
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const holdings = [];
  for (const brokerId of options.brokers) {
    holdings.push(...await fetchBrokerHoldings(brokerId, options.headless));
  }

  process.stdout.write(JSON.stringify({
    readOnly: true,
    fetchedAt: new Date().toISOString(),
    holdings,
  }));
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
