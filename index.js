const { faker } = require('@faker-js/faker');
const createRandomUser = () => {
    return {
      id: faker.string.uuid(),
      username: faker.internet.username(), // before version 9.1.0, use userName()
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
  console.log(createRandomUser());