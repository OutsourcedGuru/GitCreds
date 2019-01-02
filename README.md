# GitCreds
Generate some statistics based upon an entered Github account.

## Overview
Github has a REST API which allows repository data to be downloaded. This project uses this data to create some simple statistics to display.

## Installation

```
mkdir ~/sites && cd ~/sites
git clone https://github.com/OutsourcedGuru/GitCreds.git
cd GitCreds
npm install
npm start
```

Visit [http://localhost:3000/](http://localhost:3000/) and enter a (case-sensitive) Github user account.

![Output](https://user-images.githubusercontent.com/15971213/50614735-afdeac80-0e96-11e9-8e4a-19674158e632.png)

## Known Limitation(s)
* At the current time, it will only pull in the first 100 repositories since Github's API wants a paging metaphor after that. TBD


|Description|Version|Author|Last Update|
|:---|:---|:---|:---|
|GitCreds|v1.0.1|OutsourcedGuru|January 2, 2019|

|Donate||Cryptocurrency|
|:-----:|---|:--------:|
| ![eth-receive](https://user-images.githubusercontent.com/15971213/40564950-932d4d10-601f-11e8-90f0-459f8b32f01c.png) || ![btc-receive](https://user-images.githubusercontent.com/15971213/40564971-a2826002-601f-11e8-8d5e-eeb35ab53300.png) |
|Ethereum||Bitcoin|
