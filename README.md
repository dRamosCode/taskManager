# Task Manager Electron app (Windows)

# About the project

**Task manager** is a Windows desktop app to easily track the time spent working on each task.

It lets you track the time and store the info in a JSON file and come back to it by choosing the date in a calendar.

## Built with

![](https://img.shields.io/badge/-%20HTML5-orange)
![](https://img.shields.io/badge/-%20CSS3-green)
![](https://img.shields.io/badge/-%20Javascript-yellow)

# Getting Started

## Prerequisites

1. Install **Node.js**
2. Install latest version of **npm**

```
npm install -g npm
```

3. Install **GIT**

## Installation

1. Create a new project folder at a desired location.

2. Initialize NPM.

Entry point must be **main.js**.

```
npm init
```

3. Install electron v19.0.8.

```
npm install --save-dev electron@19.0.8
```

4. Install fs-jetpack.

```
npm install fs-jetpack
```

4. Clone the repo into correct path.

```
git -C .\node_modules\electron\dist\resources clone https://github.com/dRamosCode/taskManager.git app
```

# Usage

Start your **Task Manager** application by executing **_electron.exe_** located in:

> ProjectFolder/node_modules/electron/dist

# Roadmap

- [x] Base version
- [x] Readme.md
- [ ] Dark theme
- [ ] Menu
- [ ] Task Planner
- [ ] Statistics / Charts

# License

MIT license.
