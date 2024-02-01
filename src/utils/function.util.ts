import { faker } from "@faker-js/faker";

export function getUUID() {
  return faker.string.uuid() + faker.animal.bird();
}

export async function waitForSeconds(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, seconds * 1000);
  });
}
