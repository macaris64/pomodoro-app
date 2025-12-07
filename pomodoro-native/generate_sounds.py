import wave
import math
import random
import struct
import os

SAMPLE_RATE = 44100

def save_wav(filename, data):
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)  # Mono
        f.setsampwidth(2)  # 16-bit
        f.setframerate(SAMPLE_RATE)
        f.writeframes(data)
    print(f"Generated {filename}")

def generate_sine_wave(freq, duration, volume=0.5):
    n_samples = int(SAMPLE_RATE * duration)
    data = bytearray()
    for i in range(n_samples):
        t = float(i) / SAMPLE_RATE
        value = int(math.sin(2 * math.pi * freq * t) * 32767 * volume)
        data.extend(struct.pack('<h', value))
    return data

def generate_tone_sequence(notes, duration_per_note, decay=True):
    # notes: list of (freq, volume)
    full_data = bytearray()
    samples_per_note = int(SAMPLE_RATE * duration_per_note)
    
    for freq, vol in notes:
        for i in range(samples_per_note):
            t = float(i) / SAMPLE_RATE
            # Envelope
            env = 1.0
            if decay:
                 env = 1.0 - (float(i) / samples_per_note)
            
            value = int(math.sin(2 * math.pi * freq * t) * 32767 * vol * env)
            full_data.extend(struct.pack('<h', value))
    return full_data

def generate_white_noise(duration, volume=0.3):
    n_samples = int(SAMPLE_RATE * duration)
    data = bytearray()
    for i in range(n_samples):
        value = int((random.random() * 2 - 1) * 32767 * volume)
        data.extend(struct.pack('<h', value))
    return data

def generate_brown_noise(duration, volume=0.3):
    n_samples = int(SAMPLE_RATE * duration)
    data = bytearray()
    last_out = 0.0
    for i in range(n_samples):
        white = random.random() * 2 - 1
        output = (last_out + (0.02 * white)) / 1.02
        last_out = output
        output *= 3.5 # Make up for gain loss
        
        # Clip
        if output > 1.0: output = 1.0
        if output < -1.0: output = -1.0
        
        value = int(output * 32767 * volume)
        data.extend(struct.pack('<h', value))
    return data

def main():
    os.makedirs('assets/sounds', exist_ok=True)
    
    # 1. Rain (White Noise) - 10 seconds loop
    print("Generating Rain...")
    rain_data = generate_white_noise(10.0, 0.15)
    save_wav('assets/sounds/rain.wav', rain_data)
    
    # 2. Forest (Brown Noise / Deeper) - 10 seconds loop
    print("Generating Forest...")
    forest_data = generate_brown_noise(10.0, 0.2)
    save_wav('assets/sounds/forest.wav', forest_data)
    
    # 3. Wind (Pink Noise with LFO Modulation)
    print("Generating Wind...")
    # Wind: Pink Noise + Lowpass + Amplitude Modulation (LFO)
    # LFO: 0.2Hz sine wave to modulate volume between 0.6 and 1.0
    pink_data_raw = generate_brown_noise(10.0, 0.4) # Use brown as base for deeper wind
    
    # Apply simplified modulation directly to samples (post-process)
    # Since we don't have numpy, we do it inline in a new function or here.
    # Actually, let's just make a specific generate_wind function.
    
    wind_data = bytearray()
    n_samples = int(SAMPLE_RATE * 10.0)
    last_out = 0.0
    lfo_phase = 0.0
    lfo_inc = (2 * math.pi * 0.2) / SAMPLE_RATE # 0.2 Hz
    
    for i in range(n_samples):
        white = random.random() * 2 - 1
        # Pink-ish approximation (Brown is too deep, White too harsh)
        # Using simple lowpass on white
        output = (last_out + (0.1 * white)) / 1.1
        last_out = output
        output *= 2.0 
        
        # Modulate
        lfo = (math.sin(lfo_phase) + 1) / 2 # 0 to 1
        lfo_phase += lfo_inc
        vol_mod = 0.3 + (lfo * 0.4) # 0.3 to 0.7
        
        val = output * vol_mod
        
        # Clip
        if val > 1.0: val = 1.0
        if val < -1.0: val = -1.0
        
        value = int(val * 32767 * 0.5) # Master vol for wind
        wind_data.extend(struct.pack('<h', value))
        
    save_wav('assets/sounds/wind.wav', wind_data)

    # 4. Start Notification (Nice Major Arpeggio)
    print("Generating Start...")
    # C5, E5, G5
    start_notes = [(523.25, 0.6), (659.25, 0.6), (783.99, 0.6)]
    start_data = generate_tone_sequence(start_notes, 0.15, decay=True)
    save_wav('assets/sounds/start.wav', start_data)

    # 5. Complete Notification (Victory)
    print("Generating Complete...")
    # C5, E5, G5, C6 (High C)
    victory_notes = [(523.25, 0.6), (659.25, 0.6), (783.99, 0.6), (1046.50, 0.8)]
    # Make the last note longer? logic above is fixed duration. 
    # Let's just do a sequence.
    victory_data = generate_tone_sequence(victory_notes, 0.15, decay=True)
    save_wav('assets/sounds/complete.wav', victory_data)

    # 6. Break Notification (Two notes descending)
    print("Generating Break...")
    # E5, C5
    break_notes = [(659.25, 0.6), (523.25, 0.6)]
    break_data = generate_tone_sequence(break_notes, 0.2, decay=True)
    save_wav('assets/sounds/break.wav', break_data)

if __name__ == "__main__":
    main()
