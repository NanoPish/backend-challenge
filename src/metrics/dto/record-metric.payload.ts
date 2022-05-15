import { Field, ObjectType } from '@nestjs/graphql';
import { Metric } from '../models/metric.model'

@ObjectType()
export class RecordMetricPayload {
  constructor(metric: Metric) {
    this.metric = metric;
  }
  
  @Field()
  metric: Metric;
}