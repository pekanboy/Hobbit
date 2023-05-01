import allureReporter from '@wdio/allure-reporter';
import {Status} from 'allure-js-commons';

export class LoggerService {
    static async step(name: string, callback: Function, reporter?: any) {
        allureReporter.startStep(name);
        try {
            await callback();
            allureReporter.endStep(Status.PASSED)
        } catch (error) {
            allureReporter.endStep(Status.BROKEN);
        }
    }

    static async addTestCaseLink(link: string) {
        allureReporter.addLink(link, 'Test case url');
    }
}