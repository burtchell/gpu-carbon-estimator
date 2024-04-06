# gpu_carbon_estimator

`gpu_carbon_estimator` estimates the carbon emissions from the energy usage of a GPU, made as a plugin for [IF](https://github.com/Green-Software-Foundation/if).

## Implementation

The plugin uses the [Climatiq](https://www.climatiq.io/) API to retrieve carbon emission estimations.

## Climatiq API Key

`gpu_carbon_estimator` requires a Climatiq API key, which you can request [here](https://www.climatiq.io/docs/guides/how-tos/getting-api-key). Once you have a key, you must define an environment variable, `$CLIMATIQ_API_KEY=<your-api-key-here>` on your machine.

## Inputs

- `gpu/power-usage`: GPU power usage in watts.
- `region`: Geographical region where the measurement was recorded. Should be a two-character string according to the [UN/LOCODE code list](https://unece.org/trade/cefact/unlocode-code-list-country-and-territory), i.e., `'US'` for the United States, `'GB'` for Great Britain.

## Returns

- `gpu/carbon`: Estimated GPU carbon emissions in kgCO2.

## Usage

To run the `gpu_carbon_estimator` plugin an instance of `GpuCarbonEstimator` must be created using `GpuCarbonEstimator()` and, if applicable, passing global configurations. Subsequently, the `execute()` function can be invoked to retrieve data on `gpu/carbon`.

This is how you could run the plugin in Typescript:

```typescript
import {GpuCarbonEstimator} from '@dukeofjukes/gpu_carbon_estimator`

const gpuCarbonEstimator = GpuCarbonEstimator({});
const response = await gpuCarbonEstimator.execute([
  {
    timestamp: '2024-01-01T00:00:00Z',
    duration: 60,
    region: 'GB',
    'gpu/power-usage': 50,
  },
  {
    timestamp: '2024-01-01T00:01:00Z',
    duration: 60,
    region: 'GB',
    'gpu/power-usage': 80,
  },
]);
```

## Example manifest

In IF plugins are expected to be invoked from an `manifest` file. This is a yaml containing the plugin configuration and inputs. The following `manifest` initializes and runs the `gpu_carbon_estimator` plugin:

```yaml
name: gpu_carbon_estimator_demo
description: estimates carbon intensity from gpu utilization
tags:
initialize:
  plugins:
    gpu_carbon_estimator:
      method: GpuCarbonEstimator
      path: '@dukeofjukes/gpu_carbon_estimator'
tree:
  children:
    child:
      pipeline:
        - gpu_carbon_estimator
      defaults:
        - region: "GB"
      inputs:
        - timestamp: '2024-01-01T00:00:00Z',
          duration: 60,  # seconds
          gpu/power-usage: 50,  # watts
        - timestamp: '2024-01-01T00:01:00Z',
          duration: 60,  # seconds
          gpu/power-usage: 80,  # watts
```

You can run this by passing it to `ie`. Run impact using the following command run from the project root:

```sh
npm i -g @grnsft/if
npm i -g @dukeofjukes/gpu_carbon_estimator
ie --manifest ./path/to/input.yml --output ./path/to/output.yml
```