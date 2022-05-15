import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType({ description: 'metric' })
export class Metric {
  constructor(key: string) {
    this.key = key;
  }

  private ONE_HOUR = 60 * 60 * 1000; /* ms */

  private setSum() {
    if (this.values.length > 0) {
      this.removeOldValues();
      this.sum = this.values.reduce((a, b) => a + b, 0)
    }
  }

  public removeOldValues() {
    let markedForDeletionIndices = [];

    for (let i = 0; i < this.values.length; i++) {
      // if item has been added more than hour hour ago
      console.log('loool' + i);
      if (new Date().getTime() - this.timeArray[i] > this.ONE_HOUR) {
        markedForDeletionIndices.push(i);
      }
    }

    for (let indexToDelete of markedForDeletionIndices) {
      this.values.splice(indexToDelete, 1);
      this.timeArray.splice(indexToDelete, 1);
    }
  }

  public addValue(value: number) {
    this.values.push(Math.round(value));
    this.timeArray.push(new Date().getTime());
    this.setSum();
  }

  // used to store the time when a value was added
  private timeArray: number[] = [];

  @Field()
  key: string = undefined;

  @Field(type => [Int])
  values: number[] = [];

  @Field(type => Int)
  sum: number = undefined;
}