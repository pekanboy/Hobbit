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

    async CheckVisible(expected: boolean): Promise<void> {
        const visibilityStatus = await this.GetVisible()
		assert.strictEqual(
            visibilityStatus,
            expected, 
            `Видимость элемента ${this.Name} (${visibilityStatus}) не совпадает с ожидаемым значением (${expected})`);
	}

    ClickTo(): void {
		this.self.click();
	}

    async CheckTextContent(expected: string): Promise<void> {
		const actual = await this.textContent;

		assert.strictEqual(
			actual,
			expected,
			`Текстовое содержимое элемента ${this.name} (${actual}) ` +
				`не совпадает с ожидаемым значением (${expected})`,
		);
	}
}