import { Injectable } from '@nestjs/common';
import { IncrementMetricInput } from './dto/increment-metric.input';
import { Metric } from './models/metric.model';

// should be made atomic or use a caching server for a real world use
@Injectable()
export class MetricsService {
    // use a dictionnary for fast search O(1)
    // use Map to implement it instead of Object for performance
    private static metrics: Map<string, number> = new Map();
    private static highestMetric: Metric = undefined;
    private static isSorted: boolean = false;

    // we sort only when listing all metrics, making the hypothesis that there
    // will be mostly increment requests and only a few 'list all metrics' requests
    // if it the opposite was true, we should sort at insert time using binary insertion
    private async sortMetrics() {
        // don't sort if it's already sorted (race condition issue as not atomic)
        if (!MetricsService.isSorted) {
            MetricsService.metrics =
            new Map([...MetricsService.metrics.entries()].sort((a, b) => b[1] - a[1]));
            MetricsService.isSorted = true;
        }
    }

    async increment(data: IncrementMetricInput): Promise<Metric> {
        const oldMetricValue = MetricsService.metrics.get(data.key);
        const incrementCount = Math.round(data.value);
        const newMetricValue = oldMetricValue !== undefined ? oldMetricValue + incrementCount : incrementCount;
    
        MetricsService.isSorted = false;
        MetricsService.metrics.set(data.key, newMetricValue);
        
        const resultingMetric = new Metric(data.key, newMetricValue);

        // keep track of the highest metric to reduce sorting needs
        if (MetricsService.highestMetric === undefined ||
            MetricsService.highestMetric.value < newMetricValue) {
            MetricsService.highestMetric = resultingMetric;
        }
    
        return resultingMetric;
    }

    async findOneByKey(key?: string): Promise<Metric> {
        // if there is no key specified, return the higest value metric
        if (key === undefined) {
            return MetricsService.highestMetric;
        }

        // else, return the specified metric
        const resultValue = MetricsService.metrics.get(key);

        if (resultValue === undefined) {
            return undefined;
        } else {
            return new Metric(key, resultValue);
        }
    }

    async findAll(): Promise<Metric[]> {
        await this.sortMetrics();

        const resultingMetrics: Metric[] = Array.from(MetricsService.metrics, ([key, value]) => {
            return new Metric(key, value);
          });

        return resultingMetrics;
    }
}