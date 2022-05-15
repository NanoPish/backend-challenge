import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'metric' })
export class Metric {
  constructor(key: string, values: number[], sum: number) {
    this.key = key;
    this.values = values;
    this.sum = sum;
  }

  @Field()
  key: string;

  @Field(type => [Int])
  values: number[];

  @Field(type => Int)
  sum: number;
}