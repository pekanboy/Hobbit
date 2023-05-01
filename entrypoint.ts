import type {Options} from '@wdio/types';
import './decorators/step.js';
import './decorators/see.js';

const isSeleniumRunner = process.env.SELENIUM === 'on';
const projectName = process.env.PROJECT_NAME;
const browsers = process.env.BROWSERS?.split('|') || [];

console.log(`
========================================================================================================================
Переданные параметры:
--- PROJECT_NAME: ${process.env.PROJECT_NAME}
--- BROWSERS: ${process.env.BROWSERS}
========================================================================================================================
`);

if (typeof projectName !== 'string') {
    throw new Error(`
    ========================================================================================================================
    ========================================================================================================================
    ==================== - Название проекта не передано. Определите переменную окружения PROJECT_NAME - ====================
    ========================================================================================================================
    ========================================================================================================================
    `);
}

if (browsers.length === 0) {
    throw new Error(`
    ========================================================================================================================
    ========================================================================================================================
    ======================= - Список браузеров не передан. Определите переменную окружения BROWSERS - ======================
    ========================================================================================================================
    ========================================================================================================================
    `);
}

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
        `./projects/${projectName}/cases/**/*`
    ],
    exclude: [],


    maxInstances: 10,
    capabilities: [],
    
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

const browsersConfig: Record<string, typeof baseConfig.capabilities> = {
    'chrome': [{
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

    'firefox': [{
        maxInstances: 3,
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['-headless']
        },
        'selenoid:options': {
            'enableVNC': true,
            'enableVideo': false,
            'screenResolution': '1920x1080',
        },
        acceptInsecureCerts: true
    }],
}

export const config: Options.Testrunner = { 
    ...baseConfig,
    capabilities: browsers.reduce((acc, browser) => {
        if (!Array.isArray(acc)) {
            return [];
        }

        const browserData = Array.isArray(browsersConfig[browser]) ? browsersConfig[browser] : []

        return [...acc, ...(browserData as any)];
    }, <typeof baseConfig.capabilities>[]),
    services: [
        ...(baseConfig.services?.filter((name) => !isSeleniumRunner || name !== 'chromedriver') || []),
    ]
}
