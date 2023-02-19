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
