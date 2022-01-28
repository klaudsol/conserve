#!/bin/bash

rm function.zip
zip -r function.zip .
aws lambda update-function-code --function-name Conserve --zip-file fileb://function.zip