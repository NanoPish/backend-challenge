import { Field, InputType, Int} from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class IncrementCounterInput {
  @Field()
  @MaxLength(30)
  key: string;

  @Field(type => Int)
  value: number;

}