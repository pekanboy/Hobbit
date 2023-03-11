import allureReporter from '@wdio/allure-reporter'
import {StepBodyFunction} from 'allure-js-commons';

export class LoggerService {
    static step(name: string, callback: StepBodyFunction) {
        allureReporter.step(name, callback);
    }
}