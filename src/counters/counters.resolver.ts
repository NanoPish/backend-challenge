import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IncrementCounterInput } from './dto/increment-counter.input';
import { IncrementCounterPayload } from './dto/increment-counter.payload';
import { Counter } from './models/counter.model';
import { CountersService } from './counters.service';


@Resolver(of => Counter)
export class CountersResolver {
  constructor(private readonly countersService: CountersService) {}

  @Query(returns => Counter, {nullable: true})
  async counter(@Args('key', { nullable: true }) key?: string): Promise<Counter | null> {
    const counter = await this.countersService.findOneByKey(key);

    return counter;
  }

  @Query(returns => [Counter])
  counters(): Promise<Counter[]> {
    return this.countersService.findAll();
  }

  @Mutation(returns => IncrementCounterPayload, {nullable: true})
  async incrementCounter(
    @Args('input') IncrementCounterInput: IncrementCounterInput,
  ): Promise<IncrementCounterPayload | null> {
    const counter: Counter = await this.countersService.increment(IncrementCounterInput);

    return new IncrementCounterPayload(counter);
  }
}