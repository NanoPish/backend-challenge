import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'metric ' })
export class Metric {
  constructor(key: string, value: number) {
    this.key = key;
    this.value = value;
  }

  @Field()
  key: string;

  @Field(type => Int)
  value: number;
}