import {GpuCarbonEstimator} from '../../../lib/gpu-carbon-estimator';

describe('lib/gpu-carbon-estimator: ', () => {
  describe('GpuCarbonEstimator: ', () => {
    describe('init GpuCarbonEstimator: ', () => {
      it('has metadata field.', () => {
        const pluginInstance = GpuCarbonEstimator({});

        expect(pluginInstance).toHaveProperty('metadata');
        expect(pluginInstance).toHaveProperty('execute');
        expect(pluginInstance.metadata).toHaveProperty('kind');
        expect(typeof pluginInstance.execute).toBe('function');
      });
    });

    describe('execute(): ', () => {
      it('makes prediction with provided inputs array.', async () => {
        expect.assertions(1);

        const gpuCarbonEstimator = GpuCarbonEstimator({});
        const inputs = [
          {
            timestamp: '2024-01-01T00:00:00Z',
            duration: 3600,
            'gpu/power-usage': 50,
          },
        ];

        const response = await gpuCarbonEstimator.execute(inputs);
        expect(response).toStrictEqual([
          {
            'gpu/carbon': 0.01133,
            'gpu/power-usage': 50,
            duration: 3600,
            timestamp: '2024-01-01T00:00:00Z',
          },
        ]);
      });
    });
  });
});
