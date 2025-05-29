const { setWorldConstructor, World } = require('@cucumber/cucumber');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.debug = false;
    this.feature = undefined;
    this.context = undefined;
    this.page = undefined;
    this.testName = undefined;
    this.startTime = undefined;
    this.server = undefined;
    this.playwrightOptions = undefined;
  }
}

setWorldConstructor(CustomWorld);
