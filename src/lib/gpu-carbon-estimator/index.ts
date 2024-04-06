import {z} from 'zod';

import {PluginInterface, PluginParams} from '../types/interface';

import {validate} from '../../util/validations';
import {
  GpuCarbonEstimatorOutputType,
  ConfigParams,
  KeyValuePair,
} from './types';
import {ClimatiqAPI} from './climatiq-api';

const climatiqApi = ClimatiqAPI();

export const GpuCarbonEstimator = (
  globalConfig: ConfigParams
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Calculates the output carbon emissions of a given GPU power usage.
   */
  const execute = async (inputs: PluginParams[]) => {
    const result = [];

    for await (const input of inputs) {
      const safeInput = Object.assign({}, input, validateInput(input));
      const mergedWithConfig = Object.assign(
        {},
        input,
        safeInput,
        globalConfig
      );
      const carbonResult = await fetchData(mergedWithConfig);

      result.push({...input, ...carbonResult});
    }

    return result;
  };

  /**
   * Fetches data from the Climatiq API.
   */
  const fetchData = async (
    input: PluginParams
  ): Promise<GpuCarbonEstimatorOutputType> => {
    const data = Object.assign({}, input);
    const response = await climatiqApi.fetchGpuOutputData(data);
    const result = formatResponse(response);
    const outputData: GpuCarbonEstimatorOutputType = {
      'gpu/carbon': result.co2e,
    };

    console.log(outputData);

    return outputData;
  };

  /**
   * Formats the response by converting units and extracting relevant data.
   * Coverts the embodied carbon value from kgCO2eq to gCO2eq, defaulting to 0 if 'impacts' is not present.
   * Converts the energy value from J to kWh, defaulting to 0 if 'impacts' is not present.
   * 1,000,000 J / 3600 = 277.7777777777778 Wh.
   * 1 MJ / 3.6 = 0.278 kWh
   */
  const formatResponse = (data: KeyValuePair) => {
    const co2estimatesInData = 'co2e' in data;
    const co2estimates = co2estimatesInData ? data.co2e : 0;

    return {co2e: co2estimates};
  };

  /**
   * Check for required input fields.
   */
  const validateInput = (input: PluginParams) => {
    // defaults:
    //   - gpu/name: NVIDIA A100-PCIe-40GB
    //   - gpu/power-capacity: 250  # watts, drop this?
    // inputs:
    //   - timestamp: '2021-01-01T00:00:00Z'
    //     duration: 10  # secs
    //     gpu/power-usage: 34  # watts
    //   - timestamp: '2021-01-01T00:00:10Z'
    //     duration: 10  # secs
    //     gpu/power-usage: 51  # watts
    const schema = z.object({
      duration: z.number().gt(0),
      // 'gpu/name': z.string(),  // not required
      'gpu/power-usage': z.number(),
    });

    return validate<z.infer<typeof schema>>(schema, input);
  };

  return {
    metadata,
    execute,
  };
};
