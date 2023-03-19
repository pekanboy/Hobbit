import {LoggerService} from "../servises/LoggerService/LoggerService.js";

const step = (stepLog: string) => {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const targetFunction = descriptor.value;
        
        descriptor.value = (...args: any[]) => {
            return new Promise(async (resolve, reject) => {
                resolve(await LoggerService.step(stepLog, async () => await targetFunction?.apply(target, args)));
            });
        };
    }
}

Reflect.defineProperty(global, 'step', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: step,
});
