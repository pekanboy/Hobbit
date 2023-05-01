import type {Options} from '@wdio/types';
import './decorators/step.js';
import './decorators/see.js';

const isSeleniumRunner = process.env.SELENIUM === 'on';

const baseConfig: Options.Testrunner = {
    runner: 'local',

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: './tsconfig.json',
        }
    },
    
    hostname: '89.208.208.18',
    port: 4444,
    path: '/wd/hub/',
    headless: true,
    
    specs: [
        './projects/example/cases/**/*'
    ],
    exclude: [],


    maxInstances: 10,
    capabilities: [{
        maxInstances: 3,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: ['disable-gpu'],
        },
        'selenoid:options': {
            'enableVNC': true,
            'enableVideo': false,
            'screenResolution': '1920x1080',
        },
        acceptInsecureCerts: true
    }],
    
    logLevel: 'warn',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    injectGlobals: true,
    connectionRetryCount: 3,

    services: ['chromedriver'],
    framework: 'mocha',
    reporters: [['allure', {
        outputDir: 'allure-results',
        disableMochaHooks: true,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        addConsoleLogs: true,
    }]],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        retries: 0,
        trace: true,
		fullTrace: true,
		'throw-deprecation': true,
		'trace-deprecation': true,
    },

    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {Object}  test             test object
     * @param {Object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {Any}     result.result    return object of test function
     * @param {Number}  result.duration  duration of test
     * @param {Boolean} result.passed    true if test has passed, otherwise false
     * @param {Object}  result.retries   informations to spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },
};

export const config: Options.Testrunner = {
    ...baseConfig,
    services: [
        ...(baseConfig.services?.filter((name) => !isSeleniumRunner || name !== 'chromedriver') || []),
    ]
}
