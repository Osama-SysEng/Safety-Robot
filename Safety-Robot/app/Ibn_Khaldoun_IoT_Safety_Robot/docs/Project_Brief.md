# Ibn Khaldoun IoT Safety Robot — Project Brief

## Overview
Autonomous multi-environment safety robot deployed across petroleum facilities, factories, and educational institutions in Saudi Arabia. Detects invisible hazardous leaks, triggers full automated emergency response, and streams live data to a cloud dashboard with remote control capability.

## Hardware Stack
`
MCU:        Arduino (C/C++)
Sensors:    Gas + Temperature + Smoke + [multi-sensor array]
Navigation: GPS module + Ultrasonic obstacle avoidance
Actuators:  Fuel valve servo (auto-shutoff)
Comms:      WiFi (primary) + GSM/4G (fallback)
Alert:      Local buzzer/LED + cloud push
`

## Autonomous Response Pipeline
`
Sensor trigger
  ? Threshold breach detected
  ? Valve shutoff (servo, immediate)
  ? Local alert (buzzer + LED)
  ? Cloud push (WiFi ? GSM fallback)
  ? SMS/WhatsApp notification to operators
  ? Dashboard incident logged
`

## Navigation
- GPS-guided patrol across facility zones
- Ultrasonic obstacle avoidance — real-time path correction
- No pre-mapped routes — fully autonomous traversal

## Cloud Dashboard Features
- Real-time sensor readings (gas levels, temp, smoke index)
- Live robot GPS position
- Remote control (override navigation, manual valve control)
- Automated incident reports (timestamp, location, sensor values, action taken)
- Alert history + trend analytics

## Tech Stack
- Arduino C/C++ · GPS · Ultrasonic · Multi-sensor array · Servo
- WiFi module + GSM module · MQTT/HTTP cloud protocol
- Cloud backend (private) · Real-time dashboard · SMS/WhatsApp API

## Deployment
- Multi-environment: petroleum + industrial + educational
- Developed remotely — full Arduino programming + cloud integration delivered via video consulting
- Private cloud aggregating data from all deployed units

## Deliverables Required
1. Arduino firmware — sensor reading + threshold logic
2. Valve shutoff + local alert actuation
3. GPS + obstacle avoidance navigation loop
4. WiFi?GSM fallback comms layer
5. MQTT/HTTP cloud publisher
6. Cloud backend — data ingestion + storage
7. Real-time dashboard — live map + sensor feeds
8. Remote control API
9. Alert system — SMS/WhatsApp integration
10. Automated report generator
