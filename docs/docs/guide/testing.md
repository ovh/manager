# Testing

Our testing configuration allows to test `.js;.ts;.jsx;.tsx` extensions. The configuration is already available at the root folder.

We use [Gherkin](https://cucumber.io/docs/gherkin/reference/) to help keep our tests readable and maintainable. Each test is related to a feature file that looks like this :

```gherkin
Feature: Shell client

Scenario: Plugin method invokation
  Given I have one plugin registered in my shell
  And My shell and shell client are configured with a direct message bus
  When I invoke a method from my plugin
  Then The invokation should be resolved with the method result
```

We use the package [`jest-cucumber`](https://github.com/bencompton/jest-cucumber) to link our test files `.spec.ts` with our features to ensure we did follow the BDD method and didn't forget any test case that we were planning on doing.

You can check out examples by clicking on this [link](https://github.com/ovh/manager/blob/master/packages/components/ovh-shell/__tests__/client/shell-client.spec.ts)

To run all your tests, you can use the following command :

```sh
$ yarn test:jest
```

You can also run a specific test from the root by specifying the part of a part of the path :

```sh
# This will run container tests
$ yarn test:jest container

# This will only run the shell test
$ yarn test:jest shell.spec.ts
```

To write a unit test :

- Write your use cases in a `.feature` file.
- Link your feature to your test using the method `loadFeature` from `jest-cucumber`.
- Start writing your use cases with the `given`, `when`, `then` methods exposed by the `test` method from `jest-cucumber`.

Everything that is new should be tested. There is no coverage minimum but make sure that your main features don't break. It is appreciated if you can go further than that.

If you are using `React`, you can test your UI by using [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/).
You can either use Gherkin to test your logic, or, if you want to test that your UI don't change, use snapshot testing features provided by jest.

You can find examples under the `container` app.
