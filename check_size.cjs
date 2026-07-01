const fs = require('fs');
const sizeOf = require('image-size');
const dimensions = sizeOf('/Users/ijioxc/.gemini/antigravity-ide/brain/f5d53d23-792f-45e7-be52-4e697684405b/towanworks_screenshot.png');
console.log(dimensions.width, dimensions.height);
