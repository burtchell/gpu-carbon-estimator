// import {YourGlobalConfig} from './types';
import {z} from 'zod';

import {PluginInterface, PluginParams} from '../types/interface';

export const GpuCarbonEstimator = (
  // globalConfig: YourGlobalConfig  // TODO: might not need at all
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    return inputs.map(input => {
      // your logic here
      // globalConfig;
      const safeInput = Object.assign({}, input, validateInput(input));
      // TODO: then parse safeInput to get measurements at each timestamp

      return input;
    });
  };

  const validateInput = (input: PluginParams) => {
    const schema = z.object({
        'gpu/name': z.string(),
        // TODO: optionally provide TDP (to handle cases where we don't have it in our DB)
        'gpu/utilization': z.string(),
      })
      // .refine(allDefined, {
      //   message: '`gpu/utilization` should be present.',
      // });

      return validate<z.infer<typeof schema>>(schema, input);
  }

  return {
    metadata,
    execute,
  };
};
