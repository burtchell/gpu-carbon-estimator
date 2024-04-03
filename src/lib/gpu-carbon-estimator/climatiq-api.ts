import axios from 'axios';

import {KeyValuePair} from './types';

export const ClimatiqAPI = () => {
  const BASE_URL = "https://api.climatiq.io"

  /**
   * Fetches GPU output data from Climatiq API.
   */
  const fetchGpuOutputData = async (
    data: KeyValuePair,
  ): Promise<object> => {
    const dataCast = {
      energy: data['gpu/power-usage'],
      energy_unit: "kWh"
    }
    const response = await axios.post(
      `${BASE_URL}/data/v1/estimate`,
      dataCast
    )

    return response.data;
  }

  return {
    fetchGpuOutputData,
  }
}