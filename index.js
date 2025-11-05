import { chromium } from 'playwright'
import fs from 'fs'
(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.khu.ac.kr/kor/user/mapManager/view.do?menuNo=200356');
    // await page.goto('https://www.khu.ac.kr/kor/user/mapManager/view.do?menuNo=200357');
    await page.waitForTimeout(1000)
    const nums = await page.$$eval('li[id^="mark_"]', elements => elements.map(el => el.id))
    for (const num of nums) {
        await page.locator(`#${num}`).click()
        const name = await page.$eval(`div[id="child_${num.slice(5)}"] p[class="title"]`, el => el.textContent)
        const exist = await page.locator(`div[id="child_${num.slice(5)}"] p[style=" white-space: break-spaces;"]`).count()
        if (exist > 0) {
            console.log(name)
            fs.appendFileSync('seoulCampus.md', name+`${'\n'}`);
            // fs.appendFileSync('globalCampus.md', name+`${'\n'}`);
            for (let i = 0; i < exist; i++) {
                const paragraph = await page
                    .locator(`div[id="child_${num.slice(5)}"] p[style=" white-space: break-spaces;"]`)
                    .nth(i)
                    .textContent()
                console.log(paragraph)
                fs.appendFileSync('seoulCampus.md', paragraph+`${'\n'}`);
                // fs.appendFileSync('globalCampus.md', paragraph+`${'\n'}`);
            }
        }
    }
    await page.waitForTimeout(1000)
    await browser.close();
})();

