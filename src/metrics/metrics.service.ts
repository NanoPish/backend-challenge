import { Injectable } from '@nestjs/common';
import { RecordMetricInput } from './dto/record-metric.input';
import { Metric } from './models/metric.model';

@Injectable()
export class MetricsService {
    // use a dictionnary for O(1) read/write
    // use Map instead of Object for performance
    private static metrics: Map<string, Metric> = new Map();
    private static isSorted: boolean;

    async record(data: RecordMetricInput): Promise<Metric> {
        let selectedMetric: Metric = MetricsService.metrics.get(data.key);
        if (selectedMetric === undefined) {
            selectedMetric = new Metric(data.key);
        }
        selectedMetric.addValue(data.value);

        MetricsService.metrics.set(data.key, selectedMetric);
        
        return selectedMetric;
    }

    async findOneByKey(key: string): Promise<Metric | null> {
        const selectedMetric: Metric = MetricsService.metrics.get(key);

        if (selectedMetric === undefined)
            return null;

        return selectedMetric;
    }

    async findAll(): Promise<Metric[]> {
        // don't sort if it's already sorted (race condition possible as not atomic)
        if (!MetricsService.isSorted) {
            MetricsService.metrics =
            new Map([...MetricsService.metrics.entries()].sort((a, b) => b[1].sum - a[1].sum));
            MetricsService.isSorted = true;
        }

        const resultingMetrics: Metric[] = Array.from(MetricsService.metrics.values());

        return resultingMetrics;
    }
}