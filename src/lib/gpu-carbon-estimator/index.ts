// import {YourGlobalConfig} from './types';
import {z} from 'zod';

import {PluginInterface, PluginParams} from '../types/interface';
// import {ConfigParams, PluginParams} from '../../types';

import {validate} from '../../util/validations';
import { GpuCarbonEstimatorOutputType, ConfigParams } from './types';
import { ClimatiqAPI } from './climatiq-api';
// import {buildErrorMessage} from '../../util/helpers';
// import {ERRORS} from '../../util/errors';

const climatiqApi = ClimatiqAPI();

export const GpuCarbonEstimator = (
  globalConfig: ConfigParams,
): PluginInterface => {

  const metadata = {
    kind: 'execute',
  };

  /**
   * Calculates the output of a given GPU power usage.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(async input => {
      const safeInput = Object.assign({}, input, validateInput(input));
      const mergedWithConfig = Object.assign(
        {},
        input,
        safeInput,
        globalConfig
      );
      const usageResult = await fetchData(mergedWithConfig);

      return {...input, usageResult}
    });
  };

  /**
   * Fetches data from the Climatiq API.
   */
  const fetchData = async (
    input: PluginParams,
  ): Promise<GpuCarbonEstimatorOutputType> => {
    const data = Object.assign({}, input);
    const response = await climatiqApi.fetchGpuOutputData(data)
    // const result = formatResponse(response);
    const outputData: GpuCarbonEstimatorOutputType = {
      'gpu/carbon': response['co2e'],
    }

    return outputData;
  }

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
      })

      return validate<z.infer<typeof schema>>(schema, input);
  }

  return {
    metadata,
    execute,
  };
};
