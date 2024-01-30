import { faker } from "@faker-js/faker";

export function getUUID() {
  return faker.string.uuid() + faker.animal.bird();
}
