import {tryToGetGetterDescriptor} from './element.utils';
import * as assert from 'assert';
import {ChainablePromiseElement} from 'webdriverio'

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


	private elementCache: null | ChainablePromiseElement<WebdriverIO.Element> = null;

	
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

    get Locator(): string {
        // TODO: Добавить поддержку вложенных локаторов
        return this.locator;
    }

    get Name(): string {
        return this.name;
    }

    get self(): ChainablePromiseElement<WebdriverIO.Element>  {
		this.elementCache = this.elementCache || $(this.Locator);
		return this.elementCache;
    }

    get textContent(): Promise<string> {
		return this.self.getText();
	}


	private GetVisible(): Promise<boolean> {
		return this.self.isDisplayed();
	}

    public async CheckVisible(expected: boolean): Promise<void> {
        const visibilityStatus = await this.GetVisible()
		assert.strictEqual(
            visibilityStatus,
            expected, 
            `Видимость элемента ${this.Name} (${visibilityStatus}) не совпадает с ожидаемым значением (${expected})`);
	}

    public async ClickTo(): Promise<void> {
		return await this.self.click();
	}

    public async CheckTextContent(expected: string): Promise<void> {
		const actual = await this.textContent;

		assert.strictEqual(
			actual,
			expected,
			`Текстовое содержимое элемента ${this.name} (${actual}) ` +
				`не совпадает с ожидаемым значением (${expected})`,
		);
	}
}
