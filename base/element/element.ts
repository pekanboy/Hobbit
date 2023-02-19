import {tryToGetGetterDescriptor} from './element.utils';
import * as assert from 'assert';

/**
 * Класс, представляющий собой абстракцию над любым элементом страницы
 * имеет локатор и название
 * @class Element
 */

export class Element {
    /** родительский элемент (если есть) */
    public parent?: Element | null;
	/** локатор элемента (css-селектор) */
	protected locator: string;
	/** название элемента */
	protected name: string;

    constructor();
    constructor(parent: Element, locator: string, name?: string);
    constructor(locator: string, name?: string);

    constructor(...args: any[]) {
        const locatorDescriptor = tryToGetGetterDescriptor(this, 'locator');
		const nameDescriptor = tryToGetGetterDescriptor(this, 'name');

        if (!(locatorDescriptor && locatorDescriptor.get)) {
			this.locator = 'html';
		}

		if (!(nameDescriptor && nameDescriptor.get)) {
			this.name = 'Элемент';
		}

        if (args[0] instanceof Element) {
			this.parent = args.shift();
		}

		if (args.length === 0) {
			return;
		}

        if (typeof args[0] === 'string') {
			this.locator = args[0];
			if (typeof args[1] === 'string' && args[1]) {
				this.name = args[1];
			}

			return;
		}

        throw new Error(`Invalid creation of element`);
    }

    get Locator() {
        // TODO: Добавить поддержку вложенных локаторов
        return this.locator;
    }

    get Name() {
        return this.name;
    }

    get self() {
        return $(this.Locator)
    }

    get textContent(): Promise<string> {
		return this.self.getText();
	}


	public async GetVisible(): Promise<boolean> {
		return await this.self.isDisplayed();
	}

    static async CheckVisible(element: Element, expected: boolean): Promise<void> {
        const visibilityStatus = await element.GetVisible()
		assert.strictEqual(
            visibilityStatus,
            expected, 
            `Видимость элемента ${element.Name} (${visibilityStatus}) не совпадает с ожидаемым значением (${expected})`);
	}

    static ClickTo(element: Element): void {
		element.self.click();
	}

    static async CheckTextContent(element: Element, expected: string): Promise<void> {
		const actual = await element.textContent;

		assert.strictEqual(
			actual,
			expected,
			`Текстовое содержимое элемента ${element.name} (${actual}) ` +
				`не совпадает с ожидаемым значением (${expected})`,
		);
	}
}