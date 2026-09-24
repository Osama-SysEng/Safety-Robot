/*
 * Safety Robot simulation harness — NOT field firmware.
 * It intentionally emits serial telemetry only. It contains no servo, GSM,
 * WiFi, MQTT, motor, fuel-valve, buzzer, or emergency-actuation commands.
 */
#ifndef SAFETY_ROBOT_SIMULATION_ONLY
#error "Define SAFETY_ROBOT_SIMULATION_ONLY; this sketch must not be used for field control."
#endif

struct SimReadings { float gasIndex; float temperatureC; float smokeIndex; };
unsigned long sequenceNo = 0;

SimReadings nextReadings() {
  const unsigned long phase = (millis() / 1000UL) % 4UL;
  if (phase == 3) return { 620.0F, 32.0F, 15.0F }; // simulated critical sample only
  return { 120.0F + float(phase * 20), 27.0F + float(phase), 5.0F };
}

void setup() { Serial.begin(115200); }
void loop() {
  const SimReadings sample = nextReadings();
  Serial.print("{\"deviceId\":\"simulation-unit\",\"sequence\":"); Serial.print(++sequenceNo);
  Serial.print(",\"occurredAt\":"); Serial.print(millis());
  Serial.print(",\"location\":{\"lat\":24.7136,\"lng\":46.6753},\"readings\":{\"gasIndex\":"); Serial.print(sample.gasIndex);
  Serial.print(",\"temperatureC\":"); Serial.print(sample.temperatureC);
  Serial.print(",\"smokeIndex\":"); Serial.print(sample.smokeIndex);
  Serial.println("}}");
  delay(1000);
}
