# SDET Technical Task

## Install Guide

clone the repo onto your local machine and then run the `npm install` command in the root of the directory.

## Running the tests

You can run all the tests by using the `npm test` command.

## Output

The framework will generate a report of the data for each test located in the `./reports` directory and they'll also be displayed in the terminal.

## Env Variables

create an env file with the following data:

```
BASE_URL=https://www.londonstockexchange.com
MARKET_CAP_MINIMUM = 7000000
```

## Further Condsiderations

- Depending on the scope of the project and the aims of the testing I'd consider moving to a Page Object Model to make the framework more extensable and maintanable
- Depending on access to the user interface of the underlying system I'd be pushing to have key UI elements given test attributes to make locators more stable
- Given more time and depending on the use of the framework I'd also create more util functions for interacting with the page (The filters for example)
- I'd also spend time of developing the dismiss cookie functionality. Had a quick go at creating a function to add cookies manually, but couldn't get it working so abanded it.
- I'm not sure if the 700000 value check is valid? I couldn't see any that were greated than that?

## Test Five

I wasn't sure where to find this data so was unable to complete this test.
