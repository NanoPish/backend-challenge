import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecordMetricInput } from './dto/record-metric.input';
import { RecordMetricPayload } from './dto/record-metric.payload';
import { Metric } from './models/metric.model';
import { MetricsService } from './metrics.service';


@Resolver(of => Metric)
export class MetricsResolver {
  constructor(private readonly metricsService: MetricsService) {}

  @Query(returns => Metric, {nullable: true})
  async metric(@Args('key') key: string): Promise<Metric | null> {
    const metric = await this.metricsService.findOneByKey(key);

    return metric;
  }

  @Query(returns => [Metric])
  metrics(): Promise<Metric[]> {
    return this.metricsService.findAll();
  }

  @Mutation(returns => RecordMetricPayload, {nullable: true})
  async recordMetric(
    @Args('input') RecordMetricInput: RecordMetricInput,
  ): Promise<RecordMetricPayload | null> {
    const metric: Metric = await this.metricsService.record(RecordMetricInput);

    return new RecordMetricPayload(metric);
  }
}