export interface ICoin {
  currency: string | undefined;
  price: boolean;
  date: Date | undefined;
}

export interface ICoinState {
  success: boolean;
  listCoin: ICoin[] | any;
}

export interface IWallet {
  id: number;
  isActive?: boolean;
  symbol: string;
  nameI: string;
  path: string;
  amount?: number | string;
  price?: number | string;
}