import {LoggerService} from "../servises/LoggerService/LoggerService";

const step = (stepLog: string) => {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const targetFunction = descriptor.value;
        
        descriptor.value = () => {
            LoggerService.step(stepLog, () => {targetFunction()})
        }
    }
}

Reflect.defineProperty(global, 'step', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: step,
});
