# Tester mon programme :

* npm install && npm run start:dev
* lancer mon serveur sur localhost:3000 et exécuter les requêtes de l'énoncé
* lancer les tests automatisés avec npm run test:e2e

<p align="center">
  <img alt="Riot logo" src="https://tryriot.com/wp-content/themes/riot-2020-production/images/logo-purple.svg" />
  <br>
  <br>
</p>

# Riot Backend-challenge

Hi there!

Since you got here, you're probably taking a part in our recruitment process for Back-end developer position, right?

We're super happy to hear that! Getting right to it — the main purpose of this test is to check out your backend skills. We'd like to get to know your approach of solving the following problems:

- Understand specs requirements.
- Manipulate Data structure.
- Create a small API in Node.js.

Feel free to open an issue if you got any questions or suggestions! Once it's ready, send us a repository link at louis@tryriot.com.

Happy coding and cheers,

Louis, CTO @ Riot

## Table of Contents

- [Riot Backend-challenge](#riot-backend-challenge)
  - [Table of Contents](#table-of-contents)
    - [Exercise 1 : Counters & Metrics Service](#exercise-1--counters--metrics-service)
      - [Problem](#problem)
      - [API](#api)
        - [Counters](#counters)
        - [Metrics](#metrics)
      - [Clarifications](#clarifications)
      - [Examples](#examples)
      - [GraphQL schema](#graphql-schema)
    - [Exercise 2 : 30 minutes technical interview and debriefing](#exercise-2--30-minutes-technical-interview-and-debriefing)

### Exercise 1 : Counters & Metrics Service

#### Problem

Build a counter logging and reporting service which will allow to increment various counters and retrieve their current values.

Build a metrics logging and reporting service which will allow to retrieve and sum the metrics' values by time window for the most recent hour.

You will build a lightweight web server that implements the API defined below.

#### API

##### Counters

**Increment counter Mutation**

Increment the counter with the provided value for the given key and return the counter.

**Counters Query**

Returns all the counters ordered by the highest value.

**Counter Query**

Return the counter for a given key, if not provided return the counter with highest value. if no counter is found, return `null`.

##### Metrics

**Record metric Mutation**

Record the metric with the provided value for the given key and return the metric.

**Metrics Query**

Returns all the metrics ordered by the highest sum.

**Metric Query**

Return the metric for a given key. if no metric is found, return `null`.

#### Clarifications

- For the sake of the problem, persistence is not required. Therefore don't use a database but just use in-memory data structures or file storage only. A lightweight abstraction over the storage is expected, so that we could potentially implement a different storage and see if the project still works. Make sure to always use promises with your storage, even if you only implement an in-memory one and don't really need promises.
- Unless you have a strong preference otherwise, just use the boilerplate given in the repository.
- You should optimize for both readability of your code and performance.
- All values will be rounded to the nearest integer.
- You can get rid of any reported data after it is more than an hour old since we only need up to the most recent hour.

#### Examples

**Counters**

```gql
# Given that the project is running with a blank state.
# Given that I run the following mutations:

mutation incr {
  incrementCounter(input: {key: "a", value: 1}) {
    counter {
      key
      value
    }
  }
}

mutation incr {
  incrementCounter(input: {key: "b", value: 1}) {
    counter {
      key
      value
    }
  }
}

mutation incr {
  incrementCounter(input: {key: "b", value: 2}) {
    counter {
      key
      value
    }
  }
}

mutation incr {
  incrementCounter(input: {key: "b", value: 3}) {
    counter {
      key
      value
    }
  }
}

# When I make the following queries, then I should get the expected results:

query allCounters {
  counters {
    key
    value
  }
}
# Expected result:
# {
#   "data": {
#     "counters": [
#       {
#         "key": "b",
#         "value": 6
#       },
#       {
#         "key": "a",
#         "value": 1
#       }
#     ]
#   }
# }

query getCounter {
  counter(key: "a") {
    key
    value
  }
}
# Expected result:
# {
#   "data": {
#     "counter": {
#       "key": "a",
#       "value": 1
#     }
#   }
# }

query getCounter {
  counter(key: "b") {
    key
    value
  }
}
# Expected result:
# {
#   "data": {
#     "counter": {
#       "key": "b",
#       "value": 6
#     }
#   }
# }

query getCounter {
  counter {
    key
    value
  }
}
# Expected result:
# {
#   "data": {
#     "counter": {
#       "key": "b",
#       "value": 6
#     }
#   }
# }
```

**Metrics**

```gql
# Given that the project is running with a blank state.
# Given that I ran the following mutations:

# 2 hours ago
mutation record {
  recordMetric(input: {key: "a", value: 4}) {
    metric {
      key
      values
      sum
    }
  }
}

# 30 minutes ago
mutation record {
  recordMetric(input: {key: "a", value: 3}) {
    metric {
      key
      values
      sum
    }
  }
}

# 40 seconds ago
mutation record {
  recordMetric(input: {key: "a", value: 7}) {
    metric {
      key
      values
      sum
    }
  }
}

# 5 seconds ago
mutation record {
  recordMetric(input: {key: "a", value: 2}) {
    metric {
      key
      values
      sum
    }
  }
}

# When I make the following query, then I should get the expected results:

query allMetrics {
  metrics {
    key
    value
    sum
  }
}
# Expected result:
# {
#   "data": {
#     "metrics": [
#       {
#         "key": "a",
#         "values": [3, 7, 2],
#         "sum": 12
#       }
#     ]
#   }
# }
```

** Note that the metric posted 2 hours ago is not included in the sum since we only care about data in the most recent hour for these APIs.

#### GraphQL schema

Your GraphQL API must have the following schema:

```gql
input IncrementCounterInput {
  key: String!
  value: Int!
}

type IncrementCounterPayload {
  counter: Counter!
}

input RecordMetricInput {
  key: String!
  value: Int!
}

type RecordMetricPayload {
  metric: Metric!
}

type Counter {
  key: String!
  value: Int!
}

type Metric {
  key: String!
  values: [Int!]!
  sum: Int!
}

type Query {
  counters: [Counter!]!
  counter(key: String): Counter
  metrics: [Metric!]!
  metric(key: String!): Metric
}

type Mutation {
  incrementCounter(input: IncrementCounterInput!): IncrementCounterPayload
  recordMetric(input: RecordMetricInput!): RecordMetricPayload
}
```

### Exercise 2 : 30 minutes technical interview and debriefing

Once finished, send me your repository link by email: louis@tryriot.com & book a call [HERE](http://calendly.com/louis-cibot/30min)
