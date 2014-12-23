#include <Wire.h>
#include "Adafruit_GFX.h"
#include "Adafruit_LEDBackpack.h"

Adafruit_8x8matrix matrix = Adafruit_8x8matrix();

void setup() {  
  matrix.begin(0x70);
  matrix.setRotation(2);         // Rotate text to face right side up
  matrix.setTextSize(1);
  matrix.setTextWrap(false);
  matrix.setTextColor(LED_ON);
}

void loop() {

  ScratchData scratchOne = Bean.readScratchData(1);
  String nextBus = scratchToString(scratchOne);
  
  // Screen dimensions: start at 7 to start text off the right side of the screen,
  // and characters are 6 pixels wide: Max Scratch size is 20 char so 
  // 20 * 6 + 6
  for (int8_t x=7; x>=-126; x--) {
    matrix.clear();
    matrix.setCursor(x,0);
    matrix.print(nextBus);
    matrix.writeDisplay();
    Bean.sleep(25);
  }
  Bean.sleep(2000);
}

String scratchToString( ScratchData scratch ) {
  // Convert to a String object
  String str = "";
  for (int i=0; i<scratch.length; i++)
  {
    str += (String) (char) scratch.data[i];
  }

  return str;
}
