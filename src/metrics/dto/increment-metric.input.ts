import { Field, InputType} from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class IncrementMetricInput {
  @Field()
  @MaxLength(30)
  key: string;

  @Field()
  value: number;

}