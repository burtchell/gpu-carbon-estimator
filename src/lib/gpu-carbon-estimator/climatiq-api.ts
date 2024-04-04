import axios from 'axios';

import {KeyValuePair} from './types';

export const ClimatiqAPI = () => {
  const BASE_URL = "https://api.climatiq.io"

  /**
   * Fetches GPU output data from Climatiq API.
   *
   * duration: seconds
   * gpu/power-usage: watts
   * (wattage * duration) / (seconds in an hour) / 1000 = kWh
   */
  const fetchGpuOutputData = async (
    data: KeyValuePair,
  ): Promise<object> => {
    const dataCast = {
      energy: (data.duration * data['gpu/power-usage']) / 3600 / 1000,
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
