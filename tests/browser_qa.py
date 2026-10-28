from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css=(root/'styles.css').read_text()
core=(root/'core.js').read_text()
app=(root/'app.js').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
html=html.replace('<script defer src="core.js"></script><script defer src="app.js"></script>','').replace('</body>','<script>'+core+'</script><script>'+app+'</script></body>')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':375,'height':812},device_scale_factor=1)
 page.evaluate("""() => { const store=new Map(); Object.defineProperty(window,'localStorage',{configurable:true,value:{setItem:(k,v)=>store.set(k,String(v)),getItem:k=>store.has(k)?store.get(k):null,removeItem:k=>store.delete(k)}}); }""")
 failures=[]
 page.on('pageerror',lambda err: failures.append(str(err)))
 sizes=[280,320,375,430,768,1024,1440]
 for width in sizes:
  page.set_viewport_size({'width':width,'height':812})
  page.set_content(html,wait_until='domcontentloaded')
  page.wait_for_timeout(110)
  overflow=page.evaluate('document.documentElement.scrollWidth > window.innerWidth')
  print('viewport',width,'overflow',overflow,'screens',page.locator('[data-screen]:visible').count())
  assert not overflow,('horizontal overflow',width)
  if width in [375,1440]:page.screenshot(path=str(root/'tests'/f'screen_{width}.png'),full_page=True)
 assert not failures,failures
 page.set_viewport_size({'width':375,'height':812})
 page.set_content(html)
 page.locator('#nextBtn').click()
 assert 'Describe' in page.locator('#status').inner_text()
 page.locator('#examples button').first.click()
 assert page.locator('#situation').input_value().startswith('A teammate')
 page.locator('#nextBtn').click();assert page.locator('[data-screen="1"]').is_visible()
 # value toggles
 page.locator('[data-value="privacy"]').click()
 page.locator('#nextBtn').click(); assert page.locator('[data-screen="2"]').is_visible()
 page.locator('#nextBtn').click();assert page.locator('[data-screen="3"]').is_visible()
 assert page.locator('.review-card').count()==2
 assert page.locator('.review-card li').count()>0
 assert 'Cornelius Aurelius' in page.locator('footer').inner_text()
 page.locator('#nextStep').fill('Ask my teammate what happened first.')
 page.locator('#saveBtn').click();assert 'Draft saved' in page.locator('#status').inner_text()
 page.locator('#downloadBtn').click(); assert 'downloaded' in page.locator('#status').inner_text()
 page.on('dialog',lambda dialog:dialog.accept())
 page.locator('#clearBtn').click(); assert page.locator('#situation').input_value()==''
 page.locator('#loadBtn').click();assert page.locator('#situation').input_value().startswith('A teammate')
 page.locator('#deleteBtn').click();assert 'draft deleted' in page.locator('#status').inner_text().lower()
 page.locator('#loadBtn').click();assert 'No draft' in page.locator('#status').inner_text()
 assert not failures,failures
 print('INTERACTIONS SUCCESS: validation, sample, all steps, privacy, review, draft save/load, export, restart')
 browser.close()