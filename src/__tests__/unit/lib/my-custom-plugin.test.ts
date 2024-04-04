import { GpuCarbonEstimator } from '../../../lib';
import {MyCustomPlugin} from '../../../lib/my-custom-plugin';

describe('lib/gpu-carbon-estimator: ', () => {
  describe('GpuCarbonEstimator(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = GpuCarbonEstimator({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const gpuCarbonEstimator = GpuCarbonEstimator({});
        const inputs = [
          {
            timestamp: '2024-01-01T00:00:00Z',
            duration: 3600,
            'gpu/power-usage': 50,
          },
        ];

        const response = await gpuCarbonEstimator.execute(inputs, {});
        expect(response).toStrictEqual([
          {
            timestamp: '2024-01-01T00:00:00Z',
            duration: 3600,
            'gpu/power-usage': 50,
            'gpu/carbon': 0.1133,
          },
        ]);
      });
    });
  });
});
