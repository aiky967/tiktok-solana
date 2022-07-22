import { clusterApiUrl, PublicKey } from '@solana/web3.js'
import tiktok from './tiktok_clone.json'

export const SOLANA_HOST = clusterApiUrl('devnet')

export const TikTok_PROGRAM_ID = new PublicKey(
    "A9G56eewV4tHP6Fp99hJ7oMfg7Kp6d9QdGDHRfrweKki"
)

export const TIKTOK_IDL = tiktok
