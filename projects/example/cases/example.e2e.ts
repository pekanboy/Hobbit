import LoginPage from '../pages/login.page.js'
import SecurePage from '../pages/secure.page.js'

describe('My Login application', () => {
    beforeEach(async () => {
        see('https://webdriver.io/docs/allure-reporter/');
    });

    it('should login with valid credentials', async () => {
        await LoginPage.open();
        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!')
    })
})
