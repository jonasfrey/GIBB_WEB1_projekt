let midi, apcIn, apcOut;

document.getElementById('connect').addEventListener('click', async () => {
  try {
    midi = await navigator.requestMIDIAccess({ sysex: false });
    // pick the first device that looks like an APC as input & output


    // let a_o_device = midi.inputs.values();
    // globalThis.a_o_device = a_o_device;
    // console.log('Available MIDI devices:', [...midi.inputs.values()], [...midi.outputs.values()]);

    // for (const input of midi.inputs.values()) {
    //   if (/APC|AKAI/i.test(input.name)) apcIn = input;
    // }
    // for (const output of midi.outputs.values()) {
    //   if (/APC|AKAI/i.test(output.name)) apcOut = output;
    // }
    // if (!apcIn || !apcOut) {
    //   console.log('APC not found. Devices:', [...midi.inputs.values()], [...midi.outputs.values()]);
    //   return;
    // }
    let a_o_in = midi.inputs.values();
    let a_o_out = midi.outputs.values();
    globalThis.a_o_in = a_o_in
    let apcIn = a_o_in[0];
    let apcOut = a_o_out[0];
    console.log(apcIn)
    debugger 
    // Listen to button/knob/fader messages
    apcIn.onmidimessage = (e) => {
      const [status, data1, data2] = e.data;   // status=0x8n..0xEn
      const type = status & 0xF0;              // 0x90 = note on, 0x80 = note off, 0xB0 = CC
      const ch = (status & 0x0F) + 1;

      // Log what comes in (use this to map your unit)
      console.log(`ch${ch} ${type===0x90?'NOTE ON':type===0x80?'NOTE OFF':type===0xB0?'CC':'?'} ${data1} val ${data2}`);

      // Simple echo-to-light: many APCs light a pad when they receive the same Note On back.
      if (type === 0x90 && data2 > 0) {
        lightPad(data1, data2);   // reuse incoming velocity for color/brightness if supported
      }
    };

    // Quick LED test on a few pads (adjust note numbers for your model)
    testChase();

    console.log('APC connected:', apcIn.name, apcOut.name);
  } catch (err) {
    console.error('MIDI error:', err);
  }
});

function lightPad(note, velocity=127, channel=0) {
  // Send NOTE ON to set pad LED (common on APC devices)
  // status byte: 0x90 | channel (0–15)
  apcOut && apcOut.send([0x90 | channel, note & 0x7F, velocity & 0x7F]);
}

function clearPad(note, channel=0) {
  // Velocity 0 is off on most devices
  apcOut && apcOut.send([0x90 | channel, note & 0x7F, 0]);
}

async function testChase() {
  // Try lighting a short row to discover mapping (many APCs map the 8×8 grid to notes ~0–63)
  const guesses = [0,1,2,3,4,5,6,7]; // change if nothing lights up
  for (const n of guesses) { lightPad(n, 127); await sleep(120); }
  await sleep(400);
  for (const n of guesses) { clearPad(n); }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));