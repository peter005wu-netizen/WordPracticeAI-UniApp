# Project Structure

## Root Directory
- App.vue - Main application component
- index.html - HTML template
- main.js - Application entry point
- manifest.json - Project manifest file
- pages.json - Page configuration
- uni.promisify.adaptor.js - Uni-app promisify adaptor
- uni.scss - Global SCSS styles

## Directories

### .claude/
- context.md
- instructions.md
- memory.md
- project-structure.md

### pages/
#### pages/index/
- index.vue - Main page component

### static/
- logo.png - Application logo image

### unpackage/
#### unpackage/dist/
##### unpackage/dist/dev/
###### unpackage/dist/dev/.sourcemap/
####### unpackage/dist/dev/.sourcemap/mp-weixin/
- common/
  - assets.js.map
  - vendor.js.map
- pages/
  - index/
    - index.js.map
- app.js.map

###### unpackage/dist/dev/mp-weixin/
- common/
  - assets.js
  - vendor.js
- pages/
  - index/
    - index.js
    - index.json
    - index.wxml
    - index.wxss
- static/
  - logo.png
- app.js
- app.json
- app.wxss
- project.config.json