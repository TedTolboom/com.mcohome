# MCOHome
This app adds support for Z-wave devices made by [MCOHome](http://www.mcohome.com).  
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://raw.githubusercontent.com/TedTolboom/com.mcohome/master/assets/images/small.png">
</a>  

## Links:
[MCOHome app Athom apps](https://apps.athom.com/app/com.mcohome)                    
[MCOHome app Github repository](https://github.com/TedTolboom/com.mcohome)   

## Supported devices:
### MCOHome Touch Panel Switches (1 - 4x)    
A glass panel switch with 1 - 4 capacitive touch buttons.    
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Switch-1/assets/icon.svg" width="10%" height="10%">
</a>
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Switch-2/assets/icon.svg" width="10%" height="10%">
</a>
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Switch-3/assets/icon.svg" width="6.2%" height="10%">
</a>
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Switch-4/assets/icon.svg" width="10%" height="10%">
</a>  
**Supported devices:**   
* Touch panel switch 1x: MH-S311(H), MH-S411(H), MH-S511(H)  (Z-Wave Plus)    
* Touch panel switch 2x: MH-S312(H), MH-S412, MH-S512, MH-S312 (Z-Wave Plus)   
* Touch panel switch 3x: MH-S513 (Z-Wave Plus)
* Touch panel switch 4x: MH-S314, MH-S514, MH-S314 (Z-Wave Plus)

### MCOHome Touch Panel Dimmer  
A glass panel dimmer with 1 capacitive touch buttons.   
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Switch-1/assets/icon.svg" width="10%" height="10%">
</a>

A glass panel dimmer with 2 capacitive touch buttons.   
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Dimmer-1-Plus/assets/icon.svg" width="10%" height="10%">
</a>

**Supported devices:**     
* Touch panel dimmer 1x: MH-P311, MH-P411, MH-P511  
* Touch panel dimmer 2x: MH-DT311

### MCOHome Shutter Panel  
A glass shutter panel with 2 capacitive touch buttons.   
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Shutter-Panel/assets/icon.svg" width="10%" height="10%">
</a>

**Supported devices:**     
* Touch shutter panel: MH-C321

### MCOHome Micro-dimmer
A Z-Wave enabled 1-load in-wall dimmer   
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Micro-Dimmer/assets/icon.svg" width="10%" height="10%">
</a>   
**Supported devices:**   
* Micro dimmer: MH-P220   

### MCOHome Micro-switch
A Z-Wave enabled 1-load in-wall relay   
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/Micro-Switch/assets/icon.svg" width="10%" height="10%">
</a>   
**Supported devices:**   
* Micro switch: MH-S220   

### MCOHome MH7(H) Thermostat     
Z-Wave enabled programmable heating thermostat.    
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/MH7/assets/icon.svg" width="10%" height="10%">
</a>  

**Supported devices:**    
* Heating thermostat (MH7): MH7-EH, MH7-WH   
* Heating thermostat (MH7H): MH7H-EH, MH7H-WH    

### MCOHome CO2 monitor     
Monitor CO2 concentration in air.    
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/MH9-CO2/assets/icon.svg" width="10%" height="10%">
</a>  

**Supported devices:**    
* CO2 monitor (MH9-CO2): MH9-CO2-WA, MH9-CO2-WD    

### MCOHome PM2.5 monitor     
Monitor the air quality in terms of Atmospheric particulate matter (PM2.5).    
<a href="https://github.com/TedTolboom/com.mcohome">
  <img src="https://rawgit.com/TedTolboom/com.mcohome/master/drivers/MH10-PM2.5/assets/icon.svg" width="10%" height="10%">
</a>  

**Supported devices:**    
* PM2.5 monitor (MH10-PM2.5): MH10-PM2.5-WA, MH10-PM2.5-WD    


## Supported Languages:
* English   
* Dutch    

## Supported Z-wave regions:
* Europe   
* Russia    
* China   
* U.S./Canada/Mexico        

## Feedback:
Any requests please post them in the [MCOHome app topic on the Athom Community Forum](https://community.athom.com/t/159) or contact me on [Slack](https://athomcommunity.slack.com/team/tedtolboom)    
If possible, please report issues at the [issues section on Github](https://github.com/TedTolboom/com.mcohome/issues) otherwise in the above mentioned topic.     

### Donate:
If you like the app, consider a donation to support development    

## Changelog:    
### v1.3.5
* Add additional productTypeID's for PM2.5 sensor      

### v1.3.4
* Fix issue with Switch-3-Plus devices   
* Removed config folder (obsolete)   
* Update Homey meshdriver to 1.3.23

### v1.3.0
* Add additional productTypeID's for Switch 3 - Plus, thanks Kevin   
* Fix issue with Shutter panel, thanks Geurt   
* Updated app to new app store requirements (incl. icon)
* Update Homey meshdriver to 1.3.22
* Removed mobile interface (Homey v1.x) and bumped app requirement to 4.x   

### v1.2.3
* Add additional productTypeID's for Micro dimmer (MH-P220)      

### v1.2.2
* Add additional productTypeID's for MH9 CO2 monitor   
**update:**   
* Update Homey meshdriver to 1.2.32     

### v1.2.1
* Add additional productTypeID's for MH7(H) Thermostats   
* Minor (cosmetical) modifications to make the app Homey SW v2.0.0 compatible     

### v1.2.0
* Add support for the MH7 Thermostats   
* Add support for the MH7H Thermostats      

### v1.1.3
* Add support for a "Start dim level change" and "Stop dim level change" action card for the dimmer devices   
* Add link to [MCO home app topic](https://community.athom.com/t/159) on community.athom.com   
**update:**   
* Update Homey meshdriver to 1.2.28    

### v1.1.2
* Fix missing on off feature on mobile card for touch dimmers (re-inclusion required)

### v1.1.1
* Add support for Touch shutter panel: MH-C321
* Update Homey meshdriver to 1.2.11  

### v1.1.0
* Add Athom community forum link to app      
* Update Homey meshdriver to 1.2.9  
* Add dim-duration to the dimmer devices    
* Add support for Z-wave plus version of touch panel switch (3)
* Add support for the micro-dimmer and micro-switch   
* Mass update of all productID's  
* Fix issue with CO2 sensor not reporting CO2 alarm [#5](https://github.com/TedTolboom/com.mcohome/issues/5)  
* Fix issue where CO2 and PM2.5 sensors are not (re)setting their alarms   

### v1.0.6
* Add support for MH-S311(H) and MH-S312(H) for Z-Wave Plus models   
* Update Homey meshdriver to 1.2.7   

### v1.0.5      
* Add support for MH-P311 (including new Z-wave plus version)   
* Add support for Z-wave plus version of touch panel switch MH-S312, MH-S314     

### v1.0.4      
* Add additional productID for MH9-CO2    
* Update meshdriver to 1.2.4      

### v1.0.3
* Add containment for issue with report handling MH10-PM2 for measure_PM2.5 capability       
* Update meshdriver to 1.2.3      

### v1.0.2
* Clean-up icons for MH9-CO2 and MH10-PM2      
* Add additional productID for MH10-PM2   

### v1.0.1
* Update to Z-wave meshdriver capabilities      
* Update correct image Switch-4   
* Add additional productID's for Touch Panel Switches (1-4x)        

### v1.0.0
* App store release   
