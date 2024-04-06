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
            region: 'US',
            'gpu/power-usage': 50,
          },
        ];

        const response = await gpuCarbonEstimator.execute(inputs);
        expect(response).toStrictEqual([
          {
            'gpu/carbon': 0.01944,
            'gpu/power-usage': 50,
            region: 'US',
            duration: 3600,
            timestamp: '2024-01-01T00:00:00Z',
          },
        ]);
      });

      it('makes prediction with provided inputs array (another region).', async () => {
        expect.assertions(1);

        const gpuCarbonEstimator = GpuCarbonEstimator({});
        const inputs = [
          {
            timestamp: '2024-01-01T00:00:00Z',
            duration: 3600,
            region: 'GB',
            'gpu/power-usage': 50,
          },
        ];

        const response = await gpuCarbonEstimator.execute(inputs);
        expect(response).toStrictEqual([
          {
            'gpu/carbon': 0.01035,
            'gpu/power-usage': 50,
            region: 'GB',
            duration: 3600,
            timestamp: '2024-01-01T00:00:00Z',
          },
        ]);
      });
    });
  });
});
