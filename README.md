# Virtual Energy Hub

This is a project that is related to energy data and decentralized ledger technology.

We will create documentation and software that makes it easy to upload smart meter data to a decentralized database (bigchaindb). Next to that we offer a dashboard that gives users insights in their own data as well as the (anonymized) data of others.

By creating this project we:

- Bring decentralized ledger technology concepts to the average person.
- Empower users with self owned energy data.
- Collect a lot of potential useful data, that can be analyzed (by humankind) later on.

This project scope doesn’t implement the following functionality, though these ideas could be implemented later by the open source community:

- Advanced analysis tools.
- Integrations with other data platforms like Ocean, IOTA Marketplace & Streamr.
- Monetization of data.

***Introduction video***

[![VEH Intro video](https://img.youtube.com/vi/jOXnr2jcwck/0.jpg)](https://www.youtube.com/watch?v=jOXnr2jcwck) 

***Video on the project concept***

[![VEH Concept video](https://img.youtube.com/vi/OkTXPwqOrpo/0.jpg)](https://www.youtube.com/watch?v=OkTXPwqOrpo) 

***Video on how to pick up bounties***

Do you want to cowork on this project? Cool! There are some bounties available:

[![VEH Issue bounties explanation](https://img.youtube.com/vi/lIgz_kYujk0/0.jpg)](https://www.youtube.com/watch?v=lIgz_kYujk0) 

See https://slides.com/bartwr/rotterdam-the-hague-virtual-energy-hub for the slides from the video above.

## About

The Rotterdam Virtual Energy Lab / Hub is a public, open-source, distributed database for smart meter data. Users can contribute their data and in return gain access to a personal energy usage dashboard, detailed datasets from all contributors, and cloud-based data analysis tools. 

The primary goal of the Lab/Hub is to make energy data more accessible for the people who actually produce this data (i.e. everyone). Obviously, this goal is closely aligned with the movement for self-sovereign and community-owned data, a movement that has been growing in recent years thanks to Distributed Ledger Technologies such as Blockchains. 

Why is it important for users to have easy access to both their data and that of their peers? Because data is currently (overwhelmingly) collected and stored in large, privately owned data silos. These silos are informational bottlenecks; their contents is controlled, distributed, and potentially even changed by the people who own the silos, not the people who produce the data. We can innovate faster if the data in these silos is publically available, and able to be immediately utilized for whatever means. 

The VEL/H is currently in the initial stages of development, We are focussing our efforts on  onboarding smart meters (beginning to populate the database), as well as build our community. In the coming months we will be developing a data explorer and a set of tools for data analysis. 

Obviously we have plans beyond the next few months - you can see our roadmap below for a more detailed overview of our long term goals! [to be created]

## How to contribute?

- See if you want to contribute to one of the [tasks](https://github.com/BlocklabNL/VEL/issues) defined
- Let people know this project exists (i.e. by following [@openenergyhub](https://twitter.com/openenergyhub) on Twitter)
- Give us a shout out via mail@bartroorda.nl with your ideas / comments / etc

## Currently available code in this repository

Connection &amp; functions for connection between IoT device and BDB testnet.
Examples and functions for connection, registration, and updating of IoT device info & readouts with BDB.

Web interface coming soon. Bash script for uploading and hosting via GitHub Pages included if that's the way we go.

Sequelize being used for Postgres ORM. Users stored in this db to get around worries re: setting up our own blockchain-based ID system + GDPR compliance.

*see* `./details.txt` *for further info*

- [ ] need append tx in `python/automated_sensehat_upload`
- [x] change connection in `python/automated_sensehat_upload` to tesnet
- [x] consolidate `prep_code/javascript_prep` into just connection + functions
- [x] db setup for standard users
	+ [x] routes
	+ [x] db models
	+ [x] config
- [ ] create web interface:
	+ [x] html skeleton
	+ [ ] proper code for site
	+ [ ] generic infographics ( scrape BDB )
	+ [ ] personal dashboard ( scrape BDB )
	+ ~~[ ] uPort login / integration~~
	+ [ ] 'standard' login
		- [ ] db orm interfacing
		- [ ] cookie + secret
		- [ ] secure signup ( bcrypt )
	+ ~~[ ] routes for all functions in drivers:~~
		- ~~[ ] registerDevice()~~
		- ~~[ ] deviceInfo()~~
		- ~~[ ] update()~~
		- ~~[ ] burn()~~
	+ [x] .sh for upload & hosting if done via GitHub Pages

Further *potential* development paths
- [ ] integrate FOAM for geo-spatial data verification ( cf. https://f-o-a-m.github.io/foam.developer/ for tools )
- [ ] look into classification of 'data trustworthy-ness' re: method of data input
	+ [ ] look into hardware integration & distribution for this ( cf. Zymbit )
	+ [ ] look into potential to build atop this re: levels of trusted data ( e.g. TCR )
- [ ] integrate on-chain ID management ( e.g. uPort )
