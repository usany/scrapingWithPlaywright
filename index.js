import { chromium } from 'playwright'
import fs from 'fs'
// const nums = ['mark_32', 'mark_33', 'mark_34', 'mark_35', 'mark_36', 'mark_18', 'mark_26', 'mark_30', 'mark_31', 'mark_37', 'mark_38', 'mark_23', 'mark_39', 'mark_40', 'mark_41', 'mark_42', 'mark_43', 'mark_19', 'mark_44', 'mark_45', 'mark_13', 'mark_20', 'mark_46', 'mark_47', 'mark_48', 'mark_49', 'mark_14', 'mark_50', 'mark_51', 'mark_52', 'mark_53', 'mark_54', 'mark_55', 'mark_56', 'mark_57', 'mark_58', 'mark_59', 'mark_60', 'mark_21', 'mark_61', 'mark_22', 'mark_62', 'mark_63', 'mark_64', 'mark_65', 'mark_67']
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.khu.ac.kr/kor/user/mapManager/view.do?menuNo=200356');
    await page.waitForTimeout(1000)
    const nums = await page.$$eval('li[id^="mark_"]', elements => elements.map(el => el.id))
    for (const num of nums) {
        await page.locator(`#${num}`).click()
        const name = await page.$eval(`div[id="child_${num.slice(5)}"] p[class="title"]`, el => el.textContent)
        const exist = await page.locator(`div[id="child_${num.slice(5)}"] p[style=" white-space: break-spaces;"]`).count()
        if (exist > 0) {
            console.log(name)
            fs.appendFileSync('books.md', name+`${'\n'}`);
            for (let i = 0; i < exist; i++) {
                const paragraph = await page
                    .locator(`div[id="child_${num.slice(5)}"] p[style=" white-space: break-spaces;"]`)
                    .nth(i)
                    .textContent()
                console.log(paragraph)
                fs.appendFileSync('books.md', paragraph+`${'\n'}`);
            }
        }
    }
    await page.waitForTimeout(1000)
    await browser.close();
})();

