import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('records a new counter', async () => {
    const mutation = () => `
        mutation incr {
          incrementCounter(input: {key: "a", value: 1}) {
            counter {
              key
              value
            }
          }
        }
      `

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation(),
      });

    expect(body).toEqual({
      data: {
        incrementCounter: {
          counter: {
            "key": "a",
            "value": 1
          }
        }
      },
    });
    
  })

  it('records an existing counter', async () => {
    const mutation = () => `
        mutation incr {
          incrementCounter(input: {key: "a", value: 1}) {
            counter {
              key
              value
            }
          }
        }
      `

    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: mutation(),
      });

    expect(body).toEqual({
      data: {
        incrementCounter: {
          counter: {
            "key": "a",
            "value": 2
          }
        }
      },
    });
    
  })
});
