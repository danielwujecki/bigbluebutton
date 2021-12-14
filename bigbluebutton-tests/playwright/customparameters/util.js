const { expect } = require('@playwright/test');
const e = require('../core/elements');
const c = require('./constants');
const { ELEMENT_WAIT_TIME, ELEMENT_WAIT_LONGER_TIME } = require('../core/constants');

async function forceListenOnly(test) {
  await test.wasRemoved(e.echoYesButton);
  await test.hasText(e.toastContainer, e.joiningMessageLabel);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

async function zoomIn(test) {
  try {
    await test.page.evaluate((zoomIn) => {
      setInterval(() => {
        document.querySelector(zoomIn).scrollBy(0, 10);
      }, 100);
    }, e.zoomIn);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function zoomOut(test) {
  try {
    await test.page.evaluate((zoomIn) => {
      setInterval(() => {
        document.querySelector(zoomIn).scrollBy(10, 0);
      }, 100);
    }, e.zoomIn);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function poll(page1, page2) {
  await page1.waitForSelector(e.whiteboard, ELEMENT_WAIT_LONGER_TIME);
  await page1.waitAndClick(e.actions);
  await page1.waitAndClick(e.polling);
  await page1.waitAndClick(e.pollYesNoAbstentionBtn);
  await page1.waitAndClick(e.startPoll);
  await page2.waitForSelector(e.pollingContainer);
  await page2.waitAndClick(e.yesBtn);
  await page1.waitAndClick(e.publishPollingLabel);
}

async function previousSlide(test) {
  await test.waitAndClick(e.prevSlide);
}

async function nextSlide(test) {
  await test.waitAndClick(e.nextSlide);
}

async function annotation(test) {
  await test.waitAndClick(e.tools);
  await test.waitAndClick(e.pencil);
  await test.waitAndClick(e.whiteboard);
  await test.page.waitForFunction(
    (whiteboard) => document.querySelectorAll(`${whiteboard} > g > g`)[1].innerHTML !== '',
    e.whiteboard,
    { timeout: ELEMENT_WAIT_TIME }
  );
}

function encodeCustomParams(param) {
  try {
    let splited = param.split('=');
    splited[1] = encodeURIComponent(splited[1]).replace(/%20/g, '+');
    return splited.join('=');
  } catch (err) {
    console.log(err);
  }
}

function getAllShortcutParams() {
  const getParams = (shortcutArray) => {
    return Object.values(shortcutArray.map(e => `"${e.param}"`));
  }
  return c.shortcuts.replace('$', [...getParams(c.initialShortcuts), ...getParams(c.laterShortcuts)]);
}

async function checkAccesskey(test, key) {
  return test.checkElement(`[accesskey="${key}"]`);
}

async function checkShortcutsArray(test, shortcut) {
  for (const { key } of shortcut) {
    const resp = await checkAccesskey(test, key);
    await expect(resp).toBeTruthy();
  }
}

exports.zoomIn = zoomIn;
exports.zoomOut = zoomOut;
exports.poll = poll;
exports.previousSlide = previousSlide;
exports.nextSlide = nextSlide;
exports.annotation = annotation;
exports.hexToRgb = hexToRgb;
exports.forceListenOnly = forceListenOnly;
exports.encodeCustomParams = encodeCustomParams;
exports.getAllShortcutParams = getAllShortcutParams;
exports.checkAccesskey = checkAccesskey;
exports.checkShortcutsArray = checkShortcutsArray;
