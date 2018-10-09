# Notes, links to other projects, random thoughts and so on


## Domotics projects

To gather as much data as possible and make onboarding easy and fun we should integrate with domotics projects.

- [Domoticz](http://www.domoticz.com/)


## Random thoughts


### Costs

We should try to keep the costs of onboarding down and keep it as simple as possible.

Normal costs:

- Raspberry Pi 3B   ~40 euro
- Usb power supply  ~10 euro
- SD card           ~10 euro
- P1 cable          ~20 euro

Total: ~70 euro


We could try to reduce this costs by offering or let someone offer a cheaper cable that hooks up directly to the GPIO pins
Maybe we could even get the electricity to power Raspberry Pi from the P1 port.

Possible lower costs:

- Raspberry Pi zero W ~15 euro
- SD card             ~10 euro
- Custom cable        ~10 euro

Total: ~25 euro


## Raspberry pi setup:

### Updating pi

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get --fix-broken install
sudo apt-get upgrade
```

### Software needed for hotspot

```
sudo apt-get install dnsmasq hostapd
sudo systemctl stop dnsmasq
sudo systemctl stop hostapd
```

### Setup hostname

To change the hostname to oehu run:

```
sudo raspi-config
```

Then go to network options -> Hostname -> and type "oehu"
You need to reboot for the changes to take effect

### Accesspoint setup

https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md (excluding bridging instructions)

### Software needed for data uploading

Node 10.10 is tested and working steadily instructions on doing this can be found here:
https://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/

```
git clone https://github.com/oehu/oehu-setup-api
cd oehu-setup-api
npm install
```

because the api can change wifi settings it needs to run as root

If you are on the same network you can now access the api at http://oehu.local:8000


### Software needed for wifi gui

```
git clone https://github.com/MickdeGraaf/oehu-wifi-setup
cd oehu-wifi-setup
npm install
npm install react-scripts -g
npm run build
```

### Run stuff at startup

install pm2

```
npm install -g pm2
pm2 startup
```

run the output off pm2 startup in the terminal

install http-server

```
npm install -g http-server
```

In the oehu-setup-api folder run

```
pm2 start sudo --no-automation --name oehu-api -- npm run start
```

In the wifi gui build folder run

```
pm2 start sudo --no-automation --name oehu-wifi-gui -- http-server . -p 80
```

Make it run at boot

```
pm2 save
```
