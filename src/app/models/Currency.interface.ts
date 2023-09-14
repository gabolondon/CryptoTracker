export interface Currency {
  symbol_id: string;
  asset_id_base: string;
  asset_id_quote: string;
  price: number;
  volume_1day: number;
  volume_1day_usd: number;
}
