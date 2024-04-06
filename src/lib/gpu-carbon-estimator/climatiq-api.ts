import axios from 'axios';

import {KeyValuePair} from './types';

const {env} = require('node:process');

export const ClimatiqAPI = () => {
  const BASE_URL = 'https://api.climatiq.io';

  /**
   * Fetches GPU output data from Climatiq API.
   *
   * duration: seconds
   * gpu/power-usage: watts
   * (wattage * duration) / (seconds in an hour) / 1000 = kWh
   */
  const fetchGpuOutputData = async (data: KeyValuePair): Promise<object> => {
    const extra = {
      headers: {
        Authorization: `Bearer ${env.CLIMATIQ_API_KEY}`,
      },
    };
    const body = {
      emission_factor: {
        activity_id: 'electricity-supply_grid-source_supplier_mix',
        data_version: '^10',
        region: data.region,
      },
      parameters: {
        energy_unit: 'kWh',
        energy: (data.duration * data['gpu/power-usage']) / 3600 / 1000,
      },
    };
    const response = await axios.post(
      `${BASE_URL}/data/v1/estimate`,
      body,
      extra
    );

    return response.data;
  };

  return {
    fetchGpuOutputData,
  };
};
