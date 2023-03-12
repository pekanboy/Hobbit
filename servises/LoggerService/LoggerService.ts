import allureReporter from '@wdio/allure-reporter'
import {StepBodyFunction} from 'allure-js-commons';

export class LoggerService {
    static async step(name: string, callback: StepBodyFunction) {
        await allureReporter.step(name, callback);
    }
}