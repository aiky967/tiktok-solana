import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import tiktok from './tiktok_clone.json';

export const SOLANA_HOST = clusterApiUrl('devnet')

export const TIKTOK_PROGRAM_ID = new PublicKey(
  "8aYmhhTSgDZfQ8ka8YagjocQkDhFeCu1YbEVq5PPg8kF"
)

export const TIKTK_IDL = tiktok