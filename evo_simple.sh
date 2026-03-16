#!/bin/bash
curl -v -X POST http://localhost:8080/instance/create \
-H "apikey: cafteriaflow_evo_key" \
-H "Content-Type: application/json" \
-d '{"instanceName": "test_minimal"}'
