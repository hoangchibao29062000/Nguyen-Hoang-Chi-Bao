import axiosClient from './axiosClient';
import { ICoin } from 'models';
import { ListDataResponse } from 'models/common';

const coinApi = {
    async getListCoin(): Promise<ListDataResponse<ICoin>> {
        const url = "/prices.json";
        return await axiosClient.get(url);
    },
}

export default coinApi;