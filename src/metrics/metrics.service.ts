import { Injectable } from '@nestjs/common';
import { RecordMetricInput } from './dto/record-metric.input';
import { Metric } from './models/metric.model';

@Injectable()
export class MetricsService {
    private static metrics: Map<string, number> = new Map();
    private static highestMetric: Metric = undefined;
    private static isSorted: boolean = false;

    private async sortMetrics() {
        if (!MetricsService.isSorted) {
            MetricsService.metrics =
            new Map([...MetricsService.metrics.entries()].sort((a, b) => b[1] - a[1]));
            MetricsService.isSorted = true;
        }
    }

    async increment(data: RecordMetricInput): Promise<Metric> {
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