import { Field, ObjectType } from '@nestjs/graphql';
import { Counter } from '../models/counter.model'

@ObjectType()
export class IncrementCounterPayload {
  constructor(counter: Counter) {
    this.counter = counter;
  }
  
  @Field()
  counter: Counter;
}