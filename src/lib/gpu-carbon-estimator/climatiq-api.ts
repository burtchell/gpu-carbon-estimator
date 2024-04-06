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
        // id: '075b570e-62d2-40f7-89e2-252a2ed547c0', // TODO: this needs to be determined by location
        activity_id: 'electricity-supply_grid-source_supplier_mix',
        data_version: '^10',
        region: data.region,
      },
      parameters: {
        energy: (data.duration * data['gpu/power-usage']) / 3600 / 1000,
        energy_unit: 'kWh',
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
