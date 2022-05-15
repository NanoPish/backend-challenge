import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecordMetricInput } from './dto/record-metric.input';
import { RecordMetricPayload } from './dto/record-metric.payload';
import { Metric } from './models/metric.model';
import { MetricsService } from './metrics.service';


@Resolver(of => Metric)
export class MetricsResolver {
  constructor(private readonly metricsService: MetricsService) {}

  @Query(returns => Metric, {nullable: true})
  async metric(@Args('key', { nullable: true }) key?: string): Promise<Metric | null> {
    const metric = await this.metricsService.findOneByKey(key);

    return metric;
  }

  @Query(returns => [Metric])
  metrics(): Promise<Metric[]> {
    return this.metricsService.findAll();
  }

  @Mutation(returns => RecordMetricPayload, {nullable: true})
  async incrementMetric(
    @Args('input') IncrementMetricInput: RecordMetricInput,
  ): Promise<RecordMetricPayload | null> {
    const metric: Metric = await this.metricsService.increment(IncrementMetricInput);

    return new RecordMetricPayload(metric);
  }
}