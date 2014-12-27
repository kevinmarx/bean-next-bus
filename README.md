bean-next-bus
=============
![](I created a next trip display for the stop of your choosing using Metro Transit's Next Trip API.)

Show Metro Transit's Next Trip Data on the Punch Through Bean through Adafruit's 8x8 LED Matrix.

# Setup
_This project is not a Node module yet so bear with me_
- You can follow [@mplewis'](https://github.com/mplewis) [beantalk post](http://beantalk.punchthrough.com/t/cute-little-mini-led-matrix-and-the-bean/512) on how to set up the Bean with Adafruit's 8x8 LED matrix.
- Clone repo
- `cd bean-next-bus`
- Load the Sketch provided onto your Bean
- start Node REPL
- Create a new Bean Bus instance using either the Bean's Name or UUID and the Metro Transit Stop ID 
(_you can find a stop ID through the Metro Transit api, this defaults to the stop outside of the MPLS Punch Through office._)
```javascript
var bus = require('./index')
var Bus = new bus({ name: 'Next Bus', uuid: '', stopID: '40953' })
```
You should then see the script log the data it's setting on the Bean's characteristic in 1 minute intervals and your Bean start displaying the value stored in the characteristic. 
