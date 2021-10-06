![Context Mapper](https://raw.githubusercontent.com/wiki/ContextMapper/context-mapper-dsl/logo/cm-logo-github-small.png) 
# Context Mapper VS Code Extension 
[![Build](https://github.com/ContextMapper/vscode-extension/workflows/Build/badge.svg)](https://github.com/ContextMapper/vscode-extension/actions) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[ContextMapper](https://contextmapper.org/) is an open source tool providing a Domain-specific Language based on Domain-Driven Design (DDD) patterns for context mapping and service decomposition.

![Context Mapper VS Code Extension](https://contextmapper.org/img/vscode-extension-screenshot-1.png)

Related repositories are:

 * [Context Mapper DSL, Eclipse Plugin, and Language Server (LSP)](https://github.com/ContextMapper/context-mapper-dsl)
 * [Context Mapper Example Models](https://github.com/ContextMapper/context-mapper-examples)

With the ContextMapper DSL language you can express DDD Context Maps. Once you have modeled your system with the language, you can use the provided generators to create graphical Context Maps, UML diagrams, service contracts, Spring Boot applications (via JHipster JDL) and calculate proposals for service decompositions with [Service Cutter](https://github.com/ServiceCutter/ServiceCutter).

Checkout our website [https://contextmapper.org/](https://contextmapper.org/) to get started.
The Context Mapper project has been developed as part of projects at [OST (former HSR)](https://www.ost.ch) and you can find the project reports and further background information [here](https://contextmapper.org/background-and-publications/).

 **Installation Links:**
  * VS Code:
    * **[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=contextmapper.context-mapper-vscode-extension)**
  * Eclipse:
    * **[Eclipse Marketplace](https://marketplace.eclipse.org/content/context-mapper)**
    * Update Site: https://contextmapper.jfrog.io/ui/native/context-mapper-eclipse/updates/

## Features
We have only recently published the VS Code extension and it does not support all Context Mapper features yet. Find a feature support table [here](https://contextmapper.org/docs/ide/). We continuously work on the extension and it should support all features soon!

## System Requirements
To use the ContextMapper VS Code extension you need the following tools (besides [VS Code](https://code.visualstudio.com/) and our extension) installed locally:

* [Oracle Java](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or [OpenJDK](https://openjdk.java.net/) (JRE 8 or newer)
* If you want to use our [Context Map generator](https://contextmapper.org/docs/context-map-generator/) you need to have [Graphviz](https://www.graphviz.org/) installed on your system.
    * Ensure that the binaries are part of the _PATH_ environment variable and can be called from the terminal.
    * Especially on Windows this is not the case after the installation of [Graphviz](https://www.graphviz.org/). The default installation path is
      `C:\Program Files (x86)\GraphvizX.XX`, which means you have to add `C:\Program Files (x86)\GraphvizX.XX\bin` to your _PATH_ variable.
* Maybe you want to install the [PlantUML extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) for the generated PlantUML diagrams.

## Getting Started
 * The extension can be downloaded and installed via the [Marketplace](https://marketplace.visualstudio.com/items?itemName=contextmapper.context-mapper-vscode-extension).
 * Or: search for "Context Mapper" the extensions view of your running VS code (Ctrl+Shift+X).

 * Next steps after installation: Consult our [website](https://contextmapper.org/) to learn how to [get started with Context Mapper](https://contextmapper.org/docs/getting-started/).

## Build and/or Run Extension Locally
This project uses [Gradle](https://gradle.org/) to build the VS code extension.

Once you cloned this repository, you can build the project with the following command:

```bash
./gradlew clean snapshot vscodeExtension
```

Use the following command to build and run the extension in your VS code:

```bash
./gradlew snapshot startCode
```

**Note:** VS Code must be available on the command line as `code` to use the command above.

## Setup Development Environment
We use [VS Code](https://code.visualstudio.com/) to develop this extension. You can simply clone this repo and import the sources into [VS Code](https://code.visualstudio.com/). You can run the extension with `F5` and `Enter` (select `npm:compile` build task).

## Contributing
Contribution is always welcome! Here are some ways how you can contribute:
 * Create Github issues if you find bugs or just want to give suggestions for improvements.
 * This is an open source project: if you want to code, [create pull requests](https://help.github.com/articles/creating-a-pull-request/) from [forks of this repository](https://help.github.com/articles/fork-a-repo/). Please refer to a Github issue if you contribute this way.
 * If you want to contribute to our documentation and user guides on our website [https://contextmapper.org/](https://contextmapper.org/), create pull requests from forks of the corresponding page repo [https://github.com/ContextMapper/contextmapper.github.io](https://github.com/ContextMapper/contextmapper.github.io) or create issues [there](https://github.com/ContextMapper/contextmapper.github.io/issues).

## Licence
ContextMapper is released under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).
