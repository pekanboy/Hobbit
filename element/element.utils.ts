/**
 * Функция находит fileld в obj. Сначала ищет в самом объекте, а потом в родителях.
 * Возвращает field первого родителя, у которого есть это поле
 * @param obj - объект в котором ищем field
 * @param field - название поля, значение которого ищем
 * @returns field | null
 */
export function tryToGetGetterDescriptor(obj: object | null, field: string): PropertyDescriptor | null {
	while (obj) {
		const descriptor = Reflect.getOwnPropertyDescriptor(obj, field);
		if (descriptor && descriptor.get) {
			return descriptor;
		}
		obj = Reflect.getPrototypeOf(obj);
	}

	return null;
}
