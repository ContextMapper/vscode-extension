![Context Mapper](https://raw.githubusercontent.com/wiki/ContextMapper/context-mapper-dsl/logo/cm-logo-github-small.png) 
# Context Mapper VS Code Extension (work in progress)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

[ContextMapper](https://contextmapper.org/) is an open source tool providing a Domain-specific Language based on Domain-Driven Design (DDD) patterns for context mapping and service decomposition.

This repository contains the VS Code extension of Context Mapper. 

![Context Mapper VS Code Extension](https://contextmapper.org/img/vscode-extension-screenshot-1.png)

Related repositories are:

 * [Context Mapper DSL, Eclipse Plugin, and Language Server (LSP)](https://github.com/ContextMapper/context-mapper-dsl)
 * [Context Mapper Example Models](https://github.com/ContextMapper/context-mapper-examples)

**NOTE:** This extension is currenlty work in progress and not yet released. 

With the ContextMapper DSL language you can express DDD context maps. Once you have modeled your system with the language you can use the provided generators to create UML diagrams, service contracts, and calculate proposals for service decomposition with [Service Cutter](https://github.com/ServiceCutter/ServiceCutter).

Checkout our website [https://contextmapper.org/](https://contextmapper.org/) to get started.
The Context Mapper project has been developed as part of research projects at [HSR](https://www.hsr.ch) and you can find the project reports and further background information [here](https://contextmapper.org/background-and-publications/).

 **Installation:**
  * Eclipse:
    * [Eclipse Marketplace](https://marketplace.eclipse.org/content/context-mapper)
    * Update Site: **https://dl.bintray.com/contextmapper/context-mapping-dsl/updates/**
  * VS Code:
    * **Not yet released and published**
    * (_Documentation below explains how you can run the extension locally_)

## Features
The VS Code extension already supports the following Context Mapper features: (we are working on this extension to support all features soon; if you need all features please use our Eclipse plugin)

* ContextMapper DSL language support (CML files)
    * Write context maps with bounded contexts and their relationships (Strategic DDD)
    * Specify bounded contexts (Tactic DDD): Tactic DSL based on [Sculptor](https://github.com/sculptor/sculptor)
    * Find examples in our [examples repository](https://github.com/ContextMapper/context-mapper-examples)
    * Consult our [online documentation](https://contextmapper.org/docs/) to get detailed language documentation, manuals and how to get started.
* Generate [PlantUML](http://plantuml.com/) component diagram from context map
* Generate [PlantUML](http://plantuml.com/) class diagram from bounded context and/or subdomain (tactic DDD)
* Generate [MDSL](https://socadk.github.io/MDSL/) (micro-) service contracts out of DDD context maps
* Generate [generic text files](https://contextmapper.org/docs/generic-freemarker-generator/) using [Freemarker](https://freemarker.apache.org/) templates

## System Requirements
To use the ContextMapper VS Code extension you need the following tools (besides [VS Code](https://code.visualstudio.com/) and our extension) installed locally:

* [Oracle Java](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) or [OpenJDK](https://openjdk.java.net/) (JRE 8 or newer)
* If you want to use our [Context Map generator](https://contextmapper.org/docs/context-map-generator/) you need to have [Graphviz](https://www.graphviz.org/) installed on your system.
    * Ensure that the binaries are part of the _PATH_ environment variable and can be called from the terminal.
    * Especially on Windows this is not the case after the installation of [Graphviz](https://www.graphviz.org/). The default installation path is
      `C:\Program Files (x86)\GraphvizX.XX`, which means you have to add `C:\Program Files (x86)\GraphvizX.XX\bin` to your _PATH_ variable.
* Maybe you want to install the [PlantUML extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) for the generated PlantUML diagrams.

## Getting Started
**TODO: document installation process as soon as the extension is released**

**Note:** For now, please use our [Eclipse plugin](https://contextmapper.org/docs/getting-started/).

## Build and/or Run Extension Locally
This project uses [Gradle](https://gradle.org/) to build the VS code extension.

Once you cloned this repository, you can build the project with the following command:

```bash
./gradlew clean build
```

Use the following command to build and run the extension in your VS code:

```bash
./gradlew startCode
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
