import { Injectable } from '@nestjs/common';
import { IncrementCounterInput } from './dto/increment-counter.input';
import { Counter } from './models/counter.model';

// should be made atomic or use a caching server for a real world use
@Injectable()
export class CountersService {
    
    // use a dictionnary for O(1) read/write
    // use Map instead of Object for performance
    private static counters: Map<string, number> = new Map();
    private static highestCounter: Counter = undefined;
    private static isSorted: boolean = false;

    // we sort only when listing all counters, making the hypothesis that there
    // will be mostly increment requests and only a few 'list all counters' requests
    // if it the opposite was true, we should sort at insert time using binary insertion
    private async sortCounters() {
        
        // don't sort if it's already sorted (race condition possible as not atomic)
        if (!CountersService.isSorted) {
            CountersService.counters =
            new Map([...CountersService.counters.entries()].sort((a, b) => b[1] - a[1]));
            CountersService.isSorted = true;
        }
    }

    async increment(data: IncrementCounterInput): Promise<Counter> {
        const oldCounterValue: number = CountersService.counters.get(data.key);
        const incrementCount: number = Math.round(data.value);
        const newCounterValue: number =
            oldCounterValue !== undefined ? oldCounterValue + incrementCount : incrementCount;
    
        CountersService.isSorted = false;
        CountersService.counters.set(data.key, newCounterValue);
        
        const resultingCounter: Counter = new Counter(data.key, newCounterValue);

        // keep track of the highest counter to reduce sorting needs
        if (CountersService.highestCounter === undefined ||
            CountersService.highestCounter.value < newCounterValue) {
            CountersService.highestCounter = resultingCounter;
        }
    
        return resultingCounter;
    }

    async findOneByKey(key?: string): Promise<Counter> {
        
        // if there is no key specified, return the higest value counter
        if (key === undefined) {
            return CountersService.highestCounter;
        }

        // else, return the specified counter
        const resultValue: number = CountersService.counters.get(key);

        if (resultValue === undefined) {
            return null;
        } else {
            return new Counter(key, resultValue);
        }
    }

    async findAll(): Promise<Counter[]> {
        await this.sortCounters();

        const resultingCounters: Counter[] = Array.from(CountersService.counters, ([key, value]) => {
            return new Counter(key, value);
          });

        return resultingCounters;
    }
}