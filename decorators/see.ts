import {LoggerService} from "../servises/LoggerService/LoggerService.js";

const see = (link: string) => {
    LoggerService.addTestCaseLink(link);
}

Reflect.defineProperty(global, 'see', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: see,
});
